#!/usr/bin/env python3
"""MLX-Runtime proxy — single OpenAI-compatible endpoint (127.0.0.1:1240/v1)
that lazy-loads one MLX model server at a time.

Design (16 GB unified RAM constraint):
- Only ONE backend model server is alive at any moment. Starting a different
  model first stops the currently-running one. This keeps RAM usage bounded
  to a single model (~4-20 GB) instead of all four (~45 GB) which OOM-crashes
  the machine.
- /v1/models returns the STATIC catalog of all four MLX models (always, even
  with no backend running) so the Hermes picker shows every model.
- A chat/completions/embeddings request for model X ensures X's server is up
  (starts it if needed, stops any other), waits for it to be ready, then
  forwards the request and streams the SSE response back.

Backends are started with `mlx_lm.server` from the dedicated MLX venv.
"""
import asyncio
import json
import os
import subprocess
import threading
import time

from aiohttp import web, ClientSession, ClientTimeout

# Load credentials from ~/.hermes/.env (secrets only — API keys). This makes
# the proxy pick up OPENROUTER_API_KEY / NOUS_API_KEY the same way Hermes core
# does, so the setup routine only needs to write those vars to .env once.
# Uses a stdlib parser (no dotenv dependency — the proxy runs under
# `env -u PYTHONPATH` where dotenv may be unavailable in the active venv).
def _load_hermes_env():
    """Minimal .env parser: reads KEY=VALUE lines into os.environ (override)."""
    env_path = os.path.join(os.path.expanduser("~"), ".hermes", ".env")
    if not os.path.isfile(env_path):
        return
    try:
        with open(env_path, "r", encoding="utf-8") as fh:
            for raw in fh:
                line = raw.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, _, val = line.partition("=")
                key, val = key.strip(), val.strip()
                # Strip surrounding quotes if present.
                if len(val) >= 2 and val[0] == val[-1] and val[0] in ("'", '"'):
                    val = val[1:-1]
                os.environ[key] = val
    except Exception:
        pass


_load_hermes_env()

LISTEN_HOST = "127.0.0.1"
LISTEN_PORT = 1240
VENV_PY = "/Users/m4janfriske/.hermes/hermes-agent/venv/bin/python3"
OMNI_PY = "/Users/m4janfriske/.omni-venv/bin/mlx-omni-server"
OMNI_PY3 = "/Users/m4janfriske/.omni-venv/bin/python3"  # interpreter (mlx_vlm lives here)
STT_PY = "/Users/m4janfriske/.omni-venv/bin/python3"
STT_SCRIPT = "/Users/m4janfriske/whisper-stt-server.py"
STT_PORT = 1250
STT_MODEL = "mlx-community/whisper-small-mlx"
TTS_PY = "/Users/m4janfriske/.omni-venv/bin/python3"
TTS_SCRIPT = "/Users/m4janfriske/kokoro-tts-server.py"
TTS_PORT = 1255
KOKORO_CLI = "/Users/m4janfriske/.hermes/hermes-agent/plugins/hermes-sekretaerin/build/kokoro-cli"
KOKORO_MODEL = "/Users/m4janfriske/.cache/huggingface/hub/models--cstr--kokoro-de-hui-base-GGUF/snapshots/77d32b1d18f2815f9403d43e96bb3ff270c4ca13/kokoro-de-hui-base-q8_0.gguf"
KOKORO_VOICE = "/Users/m4janfriske/.cache/huggingface/hub/models--cstr--kokoro-voices-GGUF/snapshots/d6435f2e72f28392c36051c832714815382d36bd/kokoro-voice-df_eva.gguf"
KOKORO_VOICE_DIR = "/Users/m4janfriske/.cache/huggingface/hub/models--cstr--kokoro-voices-GGUF/snapshots/d6435f2e72f28392c36051c832714815382d36bd"
ESPEAK_DATA = "/Users/m4janfriske/.omni-venv/lib/python3.11/site-packages/espeakng_loader/espeak-ng-data"
MODELS_DIR = "/Users/m4janfriske/.lmstudio/models"

# Speculative-decoding draft model (small, same Qwen3 family as the targets).
# Boosts target decode speed +50-100% on Apple Silicon via mlx_lm --draft-model.
# Must be a LOCAL dir (not a HF repo id) so mlx_lm loads it directly.
DRAFT_MODEL_PATH = f"{MODELS_DIR}/qwen3_06b_mlx_4bit_local"
DEFAULT_DRAFT_TOKENS = 4      # tokens drafted per target step (typical sweet spot)

# Model id -> dict(path, port, launcher).
# launcher "mlx_lm": started via `mlx_lm server` (text only)
# launcher "omni":   started via `mlx-omni-server` (multimodal: image+audio, Gemma4)
# "draft": optional local dir for speculative decoding (mlx_lm only).
# NOTE: mlx_lm speculative decoding REQUIRES a trimmable prompt cache
# (KVCache). Some 4-bit quants expose ArraysCache (non-trimmable) and raise
# "Speculative decoding requires a trimmable prompt cache". Empirically the
# 9B-4bit target fails; the 4b-8bit target works. Gate per-model below.
BACKENDS = {
    "Qwen3.5-9B-MLX-4bit":        {"path": f"{MODELS_DIR}/qwen35_mlx_4bit_local", "port": 1234, "launcher": "mlx_lm", "draft": None},
    "Gemma-4-E4B-MLX-6bit":       {"path": f"{MODELS_DIR}/gemma4_mlx_e4b_6bit_local", "port": 1235, "launcher": "omni"},
    "Qwen3-4b-MLX-8bit":          {"path": f"{MODELS_DIR}/qwen3_mlx_8bit_local", "port": 1236, "launcher": "mlx_lm", "draft": DRAFT_MODEL_PATH},
    "gpt-oss-20b-MXFP4-Q8":       {"path": f"{MODELS_DIR}/gptoss_mlx_q8_local", "port": 1237, "launcher": "mlx_lm"},
    # === Sticky Agent Model (never auto-stopped) ===
    "agent-sticky-qwen3-4b-8bit": {"path": f"{MODELS_DIR}/qwen3_mlx_8bit_local", "port": 1238, "launcher": "mlx_lm", "draft": DRAFT_MODEL_PATH, "sticky": True},
    # === Online backends (routed through proxy) ===
    "openrouter-nemotron-3-ultra": {"online": True, "provider": "openrouter", "model": "nvidia/nemotron-3-ultra-550b-a55b:free", "port": 1245},
    # Fast free chat model for everyday tasks / low-latency replies.
    "openrouter-ling-3-flash":      {"online": True, "provider": "openrouter", "model": "inclusionai/ling-3.0-flash:free", "port": 1247},
    # Google Gemma 4 31B (free) — strong general-purpose chat.
    "openrouter-gemma-4-31b":       {"online": True, "provider": "openrouter", "model": "google/gemma-4-31b-it:free", "port": 1248},
    # === Google AI Studio (Gemini API, OpenAI-compatible endpoint) ===
    "google-gemini-flash":          {"online": True, "provider": "google", "model": "gemini-flash-latest", "port": 1249},
    "google-gemini-pro":            {"online": True, "provider": "google", "model": "gemini-pro-latest", "port": 1249},
    # === Groq (free tier, OpenAI-compatible) ===
    # Strong/fast free chat models. Used by the Hermes Agent cloud selection
    # and as an auto-fallback target when another provider runs out of credits.
    "groq-llama-3.3-70b":        {"online": True, "provider": "groq", "model": "llama-3.3-70b-versatile", "port": 1244},
    "groq-mixtral-8x7b":         {"online": True, "provider": "groq", "model": "mixtral-8x7b-32768", "port": 1244},
    "groq-gemma2-9b":            {"online": True, "provider": "groq", "model": "gemma2-9b-it", "port": 1244},
    "nous-portal-free":            {"online": True, "provider": "nous", "model": "hermes-3-llama-3.1-405b", "port": 1246},
    # === LOCAL Vision (Bild-Spezialist) — Qwen2-VL 2B 4bit ===
    # Loaded ON-DEMAND when the Bild-Spezialist needs it. Runs in PARALLEL to
    # the chat model (MAX_CONCURRENT=2) so the chat never blocks. Small (1.5GB)
    # so both fit on 16GB RAM. No cloud — the crew's vision is fully local.
    "mlx-vision-qwen2vl-2b":     {"path": f"/Users/m4janfriske/mlx_models/qwen2vl_2b_4bit", "port": 1239,
                                   "launcher": "vlm", "sticky": True, "vision": True},
}

STARTUP_TIMEOUT = 150.0      # seconds to wait for a model server to come up
                         # (vision model loads slower when the chat model
                         # already holds RAM; 150s avoids false timeouts)
PROBE_TIMEOUT = 2.0
# Max models alive at once (RAM safety). 2 = chat + vision can coexist.
MAX_CONCURRENT = 2

_state = {"running": {}, "lock": asyncio.Lock(), "cancel": False,
          # Last model the user actually asked for (chat switch wins).
          "desired": None, "loading_model": None}
# _state["running"]: dict model_id -> {"proc", "ready", "loading"}
# MAX_CONCURRENT>1 means several local backends can be alive at once
# (e.g. chat model + vision model). Sticky models are never evicted.

_log = []


def log(*a):
    msg = time.strftime("[%Y-%m-%d %H:%M:%S]") + " " + " ".join(str(x) for x in a)
    print(msg, flush=True)
    _log.append(msg)
    if len(_log) > 200:
        _log.pop(0)


def clamp_pct(n: float) -> int:
    return max(0, min(100, int(round(n))))


async def _is_ready(port):
    try:
        async with ClientSession() as s:
            async with s.get(f"http://127.0.0.1:{port}/v1/models",
                              timeout=ClientTimeout(total=PROBE_TIMEOUT)) as r:
                return r.status == 200
    except Exception:
        return False


async def _stop_model(model_id):
    """Stop ONE running backend (by model id). Sticky models are never killed."""
    entry = _state["running"].get(model_id)
    if not entry:
        return
    if BACKENDS.get(model_id, {}).get("sticky"):
        log(f"keeping sticky model {model_id} alive for agent crew")
        return
    proc = entry.get("proc")
    if proc and proc.returncode is None:
        try:
            proc.terminate()
            await asyncio.wait_for(proc.wait(), timeout=5)
        except Exception:
            try:
                proc.kill()
            except Exception:
                pass
    _state["running"].pop(model_id, None)


async def _evict_if_needed(keep_id):
    """If too many local backends are running, evict the oldest non-sticky one
    (excluding keep_id). Sticky models (agent/vision) are never evicted."""
    running = list(_state["running"].keys())
    if len(running) < MAX_CONCURRENT:
        return
    # Eviction candidates: non-sticky, not the one we're about to start.
    candidates = [m for m in running
                  if m != keep_id and not BACKENDS.get(m, {}).get("sticky")]
    if not candidates:
        # Everything running is sticky — we can't evict. Force-stop the oldest
        # non-sticky anyway only if keep_id itself is non-sticky; otherwise the
        # RAM budget is owned by sticky models and we refuse to OOM the crew.
        if not BACKENDS.get(keep_id, {}).get("sticky"):
            # evict oldest non-sticky even if it means dropping a sticky-less one
            for m in running:
                if m != keep_id:
                    candidates.append(m)
                    break
    if candidates:
        victim = candidates[0]
        log(f"evicting {victim} to free RAM (concurrent limit {MAX_CONCURRENT})")
        await _stop_model(victim)


# Back-compat alias used at shutdown.
async def _stop_current():
    for mid in list(_state["running"].keys()):
        await _stop_model(mid)


_stt = {"proc": None, "ready": False, "lock": asyncio.Lock()}


async def _ensure_stt():
    """Make sure the Whisper STT server is up (independent of the chat model;
    audio is a side-channel, not a chat-model swap)."""
    async with _stt["lock"]:
        if _stt["proc"] is not None and _stt["ready"]:
            return True
        log("starting STT (whisper) on :%d" % STT_PORT)
        _clean = {
            "PATH": os.environ.get("PATH", "/usr/bin:/bin:/usr/sbin:/sbin") +
                     ":/Users/m4janfriske/.local/bin",
            "HOME": os.environ.get("HOME", "/Users/m4janfriske"),
            "TMPDIR": os.environ.get("TMPDIR", "/tmp"),
            "LANG": os.environ.get("LANG", "en_US.UTF-8"),
            "UV_SYSTEM_PYTHON": "1",
        }
        _stt["proc"] = await asyncio.create_subprocess_exec(
            STT_PY, STT_SCRIPT, "--host", "127.0.0.1", "--port", str(STT_PORT),
            "--model", STT_MODEL,
            stdout=asyncio.subprocess.DEVNULL, stderr=asyncio.subprocess.DEVNULL,
            env=_clean,
        )
        # Whisper model download/load can take a while on first use.
        deadline = time.monotonic() + STARTUP_TIMEOUT * 3
        while time.monotonic() < deadline:
            try:
                async with ClientSession() as s:
                    async with s.get(f"http://127.0.0.1:{STT_PORT}/health",
                                      timeout=ClientTimeout(total=PROBE_TIMEOUT)) as r:
                        if r.status == 200:
                            _stt["ready"] = True
                            log(f"STT ready on :{STT_PORT}")
                            return True
            except Exception:
                pass
            await asyncio.sleep(2.0)
        log(f"TIMEOUT waiting for STT on :{STT_PORT}")
        return False


async def _stop_stt():
    """Unload the Whisper STT server (free the model) when the Secretary is
    deactivated. The model stays resident only while the Secretary is active,
    per user requirement — no idle-memory waste."""
    async with _stt["lock"]:
        proc = _stt.get("proc")
        if proc is None:
            return
        try:
            proc.terminate()
            await asyncio.wait_for(proc.wait(), timeout=10)
        except Exception:
            try:
                proc.kill()
            except Exception:
                pass
        _stt["proc"] = None
        _stt["ready"] = False
        log(f"STT unloaded (secretary deactivated)")


# Secretary activation state — drives the lazy STT load/unload.
_secretary_active = {"active": False, "lock": asyncio.Lock()}


async def handle_secretary_activate(request):
    """POST /secretary/activate  body: {"active": bool}

    Activating the Secretary lazily loads the Whisper STT model (so it is
    warm the moment the user speaks); deactivating unloads it to free memory.
    Returns the resulting state plus STT readiness."""
    try:
        body = await request.json()
    except Exception:
        body = {}
    active = bool(body.get("active", False))
    async with _secretary_active["lock"]:
        _secretary_active["active"] = active
    if active:
        ok = await _ensure_stt()
        return web.json_response({
            "active": True,
            "stt_ready": ok,
            "stt_port": STT_PORT,
        })
    else:
        await _stop_stt()
        return web.json_response({"active": False, "stt_ready": False})


_tts = {"proc": None, "ready": False, "lock": asyncio.Lock()}


async def _ensure_tts():
    """Make sure the Kokoro TTS server (kokoro.cpp, German-capable) is up."""
    async with _tts["lock"]:
        if _tts["proc"] is not None and _tts["ready"]:
            return True
        log("starting TTS (kokoro) on :%d" % TTS_PORT)
        _clean = {
            "PATH": os.environ.get("PATH", "/usr/bin:/bin:/usr/sbin:/sbin"),
            "HOME": os.environ.get("HOME", "/Users/m4janfriske"),
            "TMPDIR": os.environ.get("TMPDIR", "/tmp"),
            "LANG": os.environ.get("LANG", "en_US.UTF-8"),
            "ESPEAK_DATA_PATH": ESPEAK_DATA,
        }
        _tts["proc"] = await asyncio.create_subprocess_exec(
            TTS_PY, TTS_SCRIPT, "--host", "127.0.0.1", "--port", str(TTS_PORT),
            "--cli", KOKORO_CLI, "--model", KOKORO_MODEL,
            "--voice", KOKORO_VOICE, "--voice-dir", KOKORO_VOICE_DIR,
            "--espeak-data", ESPEAK_DATA,
            stdout=asyncio.subprocess.DEVNULL, stderr=asyncio.subprocess.DEVNULL,
            env=_clean,
        )
        deadline = time.monotonic() + STARTUP_TIMEOUT * 3
        while time.monotonic() < deadline:
            try:
                async with ClientSession() as s:
                    async with s.get(f"http://127.0.0.1:{TTS_PORT}/health",
                                      timeout=ClientTimeout(total=PROBE_TIMEOUT)) as r:
                        if r.status == 200:
                            _tts["ready"] = True
                            log(f"TTS ready on :{TTS_PORT}")
                            return True
            except Exception:
                pass
            await asyncio.sleep(2.0)
        log(f"TIMEOUT waiting for TTS on :{TTS_PORT}")
        return False


async def _route_online(request, model_id, backend, suffix):
    """Route requests to online providers (OpenRouter, Nous Portal) directly.

    These never compete for local RAM and don't trigger _ensure_model.
    The proxy injects the correct Authorization header and forwards to the
    provider's OpenAI-compatible endpoint.
    """
    provider = backend["provider"]
    upstream_model = backend["model"]

    # Get API key from environment
    api_key = None
    if provider == "openrouter":
        api_key = os.environ.get("OPENROUTER_API_KEY")
        base_url = "https://openrouter.ai/api/v1"
    elif provider == "nous":
        api_key = os.environ.get("NOUS_API_KEY")
        base_url = "https://inference-api.nousresearch.com/v1"
    elif provider == "google":
        api_key = os.environ.get("GEMINI_API_KEY")
        base_url = "https://generativelanguage.googleapis.com/v1beta/openai"
    elif provider == "groq":
        api_key = os.environ.get("GROQ_API_KEY")
        base_url = "https://api.groq.com/openai/v1"
    elif provider == "huggingface":
        api_key = os.environ.get("HF_TOKEN")
        base_url = "https://router.huggingface.co/v1"
    else:
        return err(503, f"unknown online provider: {provider}", "service_unavailable")

    if not api_key:
        return err(503, f"{provider.upper()}_API_KEY not set in environment", "service_unavailable")

    # Rewrite the request body with the provider's model name
    try:
        raw = await request.read()
        body = json.loads(raw) if raw else {}
    except Exception as e:
        return err(400, f"invalid JSON body: {e}", "invalid_request_error")

    body["model"] = upstream_model
    raw = json.dumps(body).encode()

    url = f"{base_url}{suffix}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    # Forward any additional headers from the original request
    for k, v in request.headers.items():
        if k.lower() not in ("host", "content-length", "authorization"):
            headers[k] = v

    try:
        session = ClientSession(timeout=ClientTimeout(total=None, sock_connect=10))
        try:
            upstream = await session.post(url, data=raw, headers=headers)
        except Exception as e:
            await session.close()
            # Upstream unreachable — try fallback chain (credit/quota safe).
            fb = await _try_fallback(provider, body, suffix)
            if fb is not None:
                return fb
            return err(503, f"upstream ({provider}) unreachable: {e}", "service_unavailable")
    except Exception as e:
        return err(503, f"upstream ({provider}) unreachable: {e}", "service_unavailable")

    # Non-2xx (e.g. 402 quota/credit, 429 rate) -> attempt fallback chain.
    if upstream.status >= 400:
        err_body = b""
        try:
            err_body = await upstream.read()
        except Exception:
            pass
        await session.close()
        log(f"{provider} returned {upstream.status}; trying fallback chain")
        fb = await _try_fallback(provider, body, suffix, exclude=provider)
        if fb is not None:
            return fb
        # No fallback worked — return the original upstream error.
        return web.Response(status=upstream.status, body=err_body or b"{}",
                            content_type="application/json")

    ctype = upstream.headers.get("Content-Type", "application/json")
    if body.get("stream") or "text/event-stream" in ctype:
        resp = web.StreamResponse(status=upstream.status, headers={
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        })
        await resp.prepare(request)
        try:
            async for chunk in upstream.content.iter_any():
                await resp.write(chunk)
            await resp.write_eof()
        except Exception as e:
            log(f"stream error: {e}")
        finally:
            upstream.release()
            await session.close()
        return resp

    try:
        data = await upstream.read()
        return web.Response(status=upstream.status, body=data,
                            content_type=ctype.split(";")[0] or "application/json")
    finally:
        await session.close()


# Fallback chain for cloud providers: when the primary returns 402/429/5xx
# (credits exhausted, quota, outage), automatically retry a FREE model on
# another provider so the crew never blocks on a dead paid account.
_FALLBACK_ORDER = ["openrouter", "groq", "google", "nous"]


async def _try_fallback(failed_provider, body, suffix, exclude=None):
    """Try the next available free provider from the fallback order. Returns a
    web.Response on success, or None if no fallback succeeded/available."""
    order = _FALLBACK_ORDER[:]
    if exclude and exclude in order:
        order.remove(exclude)
    # Respect config.yaml crew.fallback.order if present.
    try:
        from hermes_cli.config import cfg_get, load_config

        cfg_order = cfg_get(load_config(), "crew", "fallback", "order")
        if isinstance(cfg_order, list):
            order = [p for p in cfg_order if p != (exclude or failed_provider)]
    except Exception:
        pass
    for fb in order:
        if fb == failed_provider:
            continue
        be = next((b for b in BACKENDS.values()
                   if b.get("online") and b.get("provider") == fb), None)
        if not be:
            continue
        key = {
            "openrouter": "OPENROUTER_API_KEY",
            "google": "GEMINI_API_KEY",
            "nous": "NOUS_API_KEY",
            "groq": "GROQ_API_KEY",
        }.get(fb)
        api_key = os.environ.get(key) if key else None
        if not api_key:
            continue
        base_url = {
            "openrouter": "https://openrouter.ai/api/v1",
            "google": "https://generativelanguage.googleapis.com/v1beta/openai",
            "nous": "https://inference-api.nousresearch.com/v1",
            "groq": "https://api.groq.com/openai/v1",
        }[fb]
        fb_body = dict(body)
        fb_body["model"] = be["model"]
        fb_raw = json.dumps(fb_body).encode()
        try:
            async with ClientSession(timeout=ClientTimeout(total=None, sock_connect=10)) as s2:
                async with s2.post(f"{base_url}{suffix}", data=fb_raw,
                                   headers={"Content-Type": "application/json",
                                             "Authorization": f"Bearer {api_key}"}) as r2:
                    if r2.status == 200:
                        log(f"fallback OK: {failed_provider} -> {fb}")
                        ctype = r2.headers.get("Content-Type", "application/json")
                        if fb_body.get("stream") or "text/event-stream" in ctype:
                            # Streaming fallback: re-stream to client.
                            resp = web.StreamResponse(status=200, headers={
                                "Content-Type": "text/event-stream",
                                "Cache-Control": "no-cache",
                                "X-Accel-Buffering": "no",
                            })
                            await resp.prepare(request)
                            try:
                                async for chunk in r2.content.iter_any():
                                    await resp.write(chunk)
                                await resp.write_eof()
                            except Exception:
                                pass
                            return resp
                        data = await r2.read()
                        return web.Response(status=200, body=data,
                                            content_type=ctype.split(";")[0] or "application/json")
        except Exception as e:
            log(f"fallback {fb} failed: {e}")
            continue
    return None


async def _ensure_model(model_id):
    """Make sure `model_id` is a running backend. Start it if needed (in
    parallel with other running backends, up to MAX_CONCURRENT). Sticky models
    (agent/vision) are never evicted to free RAM for a non-sticky switch.

    The lock guards only the *transition* (evict old + spawn new process) so
    two rapid switches don't interleave process spawning. The (up to
    STARTUP_TIMEOUT) wait for readiness happens OUTSIDE the lock.
    """
    async with _state["lock"]:
        # A newer request superseded this one while we waited for the lock.
        if _state.get("desired") not in (None, model_id):
            log(f"abandoning {model_id}: superseded by {_state['desired']}")
            return False
        entry = _state["running"].get(model_id)
        if entry and entry.get("ready"):
            return True
        if entry and entry.get("proc") is not None:
            # still starting — release lock, wait outside
            return await _wait_ready(model_id)
        # Not running -> free a slot if needed, then start.
        await _evict_if_needed(model_id)
        path = BACKENDS[model_id]["path"]
        port = BACKENDS[model_id]["port"]
        launcher = BACKENDS[model_id]["launcher"]
        draft = BACKENDS[model_id].get("draft")
        if not os.path.isdir(path):
            log(f"MODEL PATH MISSING: {path}")
            return False
        log(f"starting {model_id} on :{port} (launcher={launcher})"
            + (f" draft={draft}" if draft else ""))
        _state["loading_model"] = model_id
        _state["running"][model_id] = {"proc": None, "ready": False,
                                        "loading": True}
        _clean_env = dict(os.environ)
        _clean_env.pop("PYTHONPATH", None)  # avoid .mlx-venv (py3.13) shadowing
        if launcher != "omni":
            _clean_env["UV_SYSTEM_PYTHON"] = "1"
        if launcher == "omni":
            _omni_env = {
                "PATH": _clean_env.get("PATH", "/usr/bin:/bin:/usr/sbin:/sbin"),
                "HOME": os.environ.get("HOME", "/Users/m4janfriske"),
                "TMPDIR": os.environ.get("TMPDIR", "/tmp"),
                "LANG": _clean_env.get("LANG", "en_US.UTF-8"),
                "UV_SYSTEM_PYTHON": "1",
            }
            proc = await asyncio.create_subprocess_exec(
                OMNI_PY,
                "--host", "127.0.0.1", "--port", str(port),
                stdout=asyncio.subprocess.DEVNULL,
                stderr=asyncio.subprocess.DEVNULL,
                env=_omni_env,
                cwd="/tmp",
            )
        elif launcher == "vlm":
            # Local vision model via mlx_vlm server (OpenAI-compatible /v1).
            # Used by the Bild-Spezialist — fully local, no cloud. mlx_vlm
            # lives in the omni-venv (NOT the hermes-venv), so use OMNI_PY3.
            proc = await asyncio.create_subprocess_exec(
                OMNI_PY3, "-m", "mlx_vlm", "server",
                "--model", path, "--port", str(port),
                "--host", "127.0.0.1",
                stdout=asyncio.subprocess.DEVNULL,
                stderr=asyncio.subprocess.DEVNULL,
                env=_clean_env,
                cwd="/tmp",
            )
        else:  # mlx_lm
            cmd = [VENV_PY, "-m", "mlx_lm", "server",
                   "--model", path, "--port", str(port), "--host", "127.0.0.1"]
            if draft and os.path.isdir(draft):
                cmd += ["--draft-model", draft,
                        "--num-draft-tokens", str(DEFAULT_DRAFT_TOKENS)]
                log(f"speculative decoding enabled (draft={draft}, "
                    f"n={DEFAULT_DRAFT_TOKENS})")
            proc = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.DEVNULL,
                stderr=asyncio.subprocess.DEVNULL,
                env=_clean_env,
            )
        _state["running"][model_id]["proc"] = proc
    # Wait for readiness OUTSIDE the lock so a concurrent switch can take over.
    return await _wait_ready(model_id, port=port)


async def _wait_ready(model_id, port=None):
    if port is None:
        port = BACKENDS[model_id]["port"]
    deadline = time.monotonic() + STARTUP_TIMEOUT
    while time.monotonic() < deadline:
        if _state.get("desired") not in (None, model_id):
            log(f"load of {model_id} superseded by {_state['desired']}")
            return False
        if _state.get("cancel") and model_id not in _state["running"]:
            log(f"load of {model_id} cancelled by newer switch")
            return False
        if await _is_ready(port):
            entry = _state["running"].get(model_id)
            if entry:
                entry["ready"] = True
                entry["loading"] = False
            _state["loading_model"] = None
            _state["cancel"] = False
            log(f"{model_id} ready on :{port}")
            return True
        await asyncio.sleep(1.0)
    log(f"TIMEOUT waiting for {model_id} on :{port}")
    # Clean up: drop the failed/stuck process so a later request can retry,
    # and clear the loading flag (unless a *different* model is now loading).
    _state["running"].pop(model_id, None)
    if _state.get("loading_model") == model_id:
        _state["loading_model"] = None
    return False


def err(status, msg, code="proxy_error"):
    return web.json_response(
        {"error": {"message": msg, "type": code, "code": status}}, status=status)


CATALOG = {"object": "list",
           "data": [{"id": mid, "object": "model", "owned_by": "mlx-runtime",
                     "created": int(time.time())} for mid in BACKENDS]}


async def handle_models(request):
    return web.json_response(CATALOG)


async def handle_health(request):
    # `loading_model` is set the moment a switch begins and cleared when the
    # target is ready — lets the desktop picker show a "model loading…" state
    loading = _state.get("loading_model")
    running_ids = list(_state["running"].keys())
    primary = next((m for m in running_ids
                    if not BACKENDS.get(m, {}).get("sticky")), None)
                    
    import psutil
    try:
        mem = psutil.virtual_memory()
        mem_data = {
            "total_gb": mem.total / (1024 ** 3),
            "used_gb": mem.used / (1024 ** 3),
            "free_gb": mem.free / (1024 ** 3),
            "percent": mem.percent
        }
    except Exception:
        import subprocess
        try:
            total = int(subprocess.check_output(['sysctl', '-n', 'hw.memsize']).decode().strip())
            vm = subprocess.check_output(['vm_stat']).decode()
            free_pages = 0
            for line in vm.splitlines():
                if line.startswith('Pages free:'):
                    free_pages = int(line.split(':')[1].strip().strip('.'))
            page_size = 4096
            free = free_pages * page_size
            used = total - free
            mem_data = {
                "total_gb": total / (1024 ** 3),
                "used_gb": used / (1024 ** 3),
                "free_gb": free / (1024 ** 3),
                "percent": (used / total) * 100
            }
        except Exception:
            mem_data = {
                "total_gb": 16.0,
                "used_gb": 8.0,
                "free_gb": 8.0,
                "percent": 50.0
            }

    return web.json_response({
        "status": "ok" if running_ids else ("loading" if loading else "idle"),
        "current_model": primary,
        "running_models": running_ids,
        "loading_model": loading,
        "ready": any(e.get("ready") for e in _state["running"].values()),
        "buttons": _button_state,
        "catalog": list(BACKENDS),
        "memory": mem_data
    })


async def proxy_json(request, suffix):
    try:
        raw = await request.read()
        body = json.loads(raw) if raw else {}
    except Exception as e:
        return err(400, f"invalid JSON body: {e}", "invalid_request_error")

    model = body.get("model")
    if model not in BACKENDS:
        return err(404, f"unknown model '{model}'. available: {sorted(BACKENDS)}",
                   "model_not_found")

    # Record the user's intent synchronously, BEFORE any await, so a rapid
    # second switch is already visible to the first one's slow load.
    _state["desired"] = model

    backend = BACKENDS[model]
    # Online backends (OpenRouter, Nous) are routed directly — they never
    # compete for local RAM and don't trigger _ensure_model/_stop_current.
    if backend.get("online"):
        return await _route_online(request, model, backend, suffix)

    # Non-blocking switch: kick off the (slow, lazy) load in the background and
    # return immediately. The desktop picker polls /health for `loading_model`
    # and shows a "model loading…" state instead of the UI freezing for up to
    # STARTUP_TIMEOUT seconds. The real generation request lands once ready.
    # With MAX_CONCURRENT>1 a local model that is ALREADY running (e.g. the
    # vision model, loaded in parallel) is served immediately without reload.
    entry = _state["running"].get(model)
    if not (entry and entry.get("ready")):
        # If a different model is already loading, cancel that load so the new
        # switch wins instead of queuing behind a 90s startup.
        if _state.get("loading_model") and _state["loading_model"] != model:
            _state["cancel"] = True
        async def _safe_ensure(mid):
            try:
                await _ensure_model(mid)
            except Exception as e:
                # Never leave the proxy stuck "loading" on a crashed start.
                log(f"MODEL START FAILED for {mid}: {e}")
                _state["loading_model"] = None
                _state["running"].pop(mid, None)
        asyncio.create_task(_safe_ensure(model))
        # Mark loading immediately so a concurrent /health poll sees it.
        _state["loading_model"] = model
        return web.json_response(
            {"status": "loading", "model": model,
             "message": "model switch initiated; poll /health for readiness"},
            status=202,
        )

    ok = await _ensure_model(model)
    if not ok:
        return err(503, f"model '{model}' failed to start (check path/ram)",
                   "service_unavailable")

    port = BACKENDS[model]["port"]
    # Both mlx_lm.server and mlx_omni_server resolve the request's `model` field
    # as a repo id, not their load path. Rewrite it to the local model
    # directory so the backend loads locally instead of hitting HuggingFace.
    local_path = BACKENDS[model]["path"]
    body["model"] = local_path
    raw = json.dumps(body).encode()
    url = f"http://127.0.0.1:{port}/v1{suffix}"
    headers = {"Content-Type": "application/json"}
    if request.headers.get("Authorization"):
        headers["Authorization"] = request.headers["Authorization"]

    try:
        session = ClientSession(timeout=ClientTimeout(total=None, sock_connect=10))
        upstream = await session.post(url, data=raw, headers=headers)
    except Exception as e:
        await session.close()
        return err(503, f"backend unreachable: {e}", "service_unavailable")

    ctype = upstream.headers.get("Content-Type", "application/json")
    if body.get("stream") or "text/event-stream" in ctype:
        resp = web.StreamResponse(status=upstream.status, headers={
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        })
        await resp.prepare(request)
        try:
            async for chunk in upstream.content.iter_any():
                await resp.write(chunk)
            await resp.write_eof()
        except Exception as e:
            log("stream error:", e)
        finally:
            upstream.release()
            await session.close()
        return resp

    try:
        data = await upstream.read()
        return web.Response(status=upstream.status, body=data,
                            content_type=ctype.split(";")[0] or "application/json")
    finally:
        await session.close()


async def handle_chat(request):
    return await proxy_json(request, "/chat/completions")


async def handle_completions(request):
    return await proxy_json(request, "/completions")


async def handle_embeddings(request):
    return await proxy_json(request, "/embeddings")


async def handle_audio_transcriptions(request):
    """Route audio transcription to the Whisper STT server (side-channel)."""
    ok = await _ensure_stt()
    if not ok:
        return err(503, "STT service failed to start", "service_unavailable")
    try:
        session = ClientSession(timeout=ClientTimeout(total=None, sock_connect=10))
        upstream = await session.post(
            f"http://127.0.0.1:{STT_PORT}/v1/audio/transcriptions",
            data=await request.read(),
            headers={k: v for k, v in request.headers.items()
                     if k.lower() not in ("host", "content-length")},
        )
        body = await upstream.read()
        await session.close()
        return web.Response(status=upstream.status, body=body,
                             content_type="application/json")
    except Exception as e:
        return err(503, f"STT unreachable: {e}", "service_unavailable")


async def handle_audio_speech(request):
    """Route TTS to the right backend.

    German text  -> Kokoro TTS (real German model via kokoro.cpp, port 1255).
    English/other-> F5-TTS via omni-server (port 1235); German inside is
                    upgraded with IPA phonemization (epitran) + Anna ref voice.
    """
    body = await request.json()
    text = body.get("input", "")
    voice = body.get("voice", "df_eva")  # default: German female (Hermes-Sekretärin)
    lang = body.get("lang_code", "")
    # Prefer German route when explicitly requested OR text looks German. This
    # avoids falling through to F5 (English/asian-accented) on short/deafult calls.
    is_german = (lang == "de" or voice.lower().startswith("de")
                 or voice.lower().startswith("df_") or _looks_german(text))

    # Bump the speaker level so the Hermes-Sekretärin panel shows live TTS
    # output activity. It decays in the audio monitor loop.
    _audio_peaks["speaker"] = 100

    if is_german:
        ok = await _ensure_tts()
        if not ok:
            return err(503, "TTS backend (kokoro) failed to start",
                       "service_unavailable")
        body["lang_code"] = "de"
        raw = json.dumps(body).encode()
        try:
            session = ClientSession(
                timeout=ClientTimeout(total=None, sock_connect=10))
            upstream = await session.post(
                f"http://127.0.0.1:{TTS_PORT}/v1/audio/speech",
                data=raw, headers={"Content-Type": "application/json"})
            body_out = await upstream.read()
            await session.close()
            return web.Response(status=upstream.status, body=body_out,
                                content_type="audio/wav")
        except Exception as e:
            return err(503, f"TTS unreachable: {e}", "service_unavailable")

    # English / fallback: F5-TTS via omni-server.
    omni_id = next((m for m, b in BACKENDS.items()
                   if b.get("launcher") == "omni"), "Gemma-4-E4B-MLX-6bit")
    ok = await _ensure_model(omni_id)
    if not ok:
        return err(503, "TTS backend (omni) failed to start",
                   "service_unavailable")
    omni_port = BACKENDS[omni_id]["port"]

    if _looks_german(text):
        ipa = _de_to_ipa(text)
        if ipa:
            body["input"] = ipa
            log(f"TTS: German -> IPA for F5: {ipa[:50]!r}")
        body["model"] = "lucasnewman/f5-tts-mlx"
        body["ref_audio_path"] = "/tmp/ref_de_24k.wav"
        body["ref_audio_text"] = (
            "Guten Tag, mein Name ist Anna und ich spreche deutlich und "
            "natürlich in hochdeutscher Aussprache für eine Sprachreferenz.")
        log(f"TTS: German detected -> F5-TTS (ref Anna) for: {text[:40]!r}")
    raw = json.dumps(body).encode()
    try:
        session = ClientSession(
            timeout=ClientTimeout(total=None, sock_connect=10))
        upstream = await session.post(
            f"http://127.0.0.1:{omni_port}/v1/audio/speech",
            data=raw, headers={"Content-Type": "application/json"})
        body_out = await upstream.read()
        ctype = upstream.headers.get("Content-Type", "audio/wav")
        await session.close()
        return web.Response(status=upstream.status, body=body_out,
                             content_type=ctype)
    except Exception as e:
        return err(503, f"TTS unreachable: {e}", "service_unavailable")


async def handle_rpc(request):
    """Composer-button RPC endpoint.

    The desktop composer's four toggle buttons (voice_comms, orchestration,
    double_mode, subagent_orchestration) POST here instead of the gateway
    WebSocket, so the renderer stays decoupled from Hermes-core and the
    handlers survive gateway/desktop updates. Each method flips a persisted
    flag and (where applicable) starts/stops the matching sub-agent.

    Body: {"method": "<name>.toggle", "params": {"active": bool}}
    """
    try:
        raw = await request.read()
        body = json.loads(raw) if raw else {}
    except Exception as e:
        return err(400, f"invalid JSON: {e}", "invalid_request_error")

    method = body.get("method")
    params = body.get("params") or {}
    active = bool(params.get("active", False))

    # id -> (display name, script to start when active, script to stop)
    HANDLERS = {
        "voice_comms.toggle": {"name": "voice_comms", "script": "/Users/m4janfriske/voice_comms.py"},
        "orchestration.toggle": {"name": "orchestration", "script": None},
        "double_mode.toggle": {"name": "double_mode", "script": None},
        "subagent_orchestration.toggle": {"name": "subagent_orchestration", "script": None},
    }

    if method not in HANDLERS:
        return err(404, f"unknown rpc method '{method}'. known: {sorted(HANDLERS)}",
                   "method_not_found")

    # Persist as a state dict so /health can report the in-progress
    # ("Bereitstellungsphase") state, not just on/off. The desktop renders
    # yellow while pending=True, green once active=True && pending=False.
    _button_state[method] = {"active": active, "pending": False}
    log(f"RPC {method} -> active={active}")

    # Start/stop voice_comms sub-agent (the one real native effect wired today).
    spec = HANDLERS[method]
    if method == "voice_comms.toggle":
        if active:
            _button_state[method]["pending"] = True

            async def _start_and_clear():
                try:
                    # Start the live audio monitor (mic level sampling). The
                    # speaker level is bumped when the proxy synthesizes TTS.
                    _start_audio_monitor()
                    # Start the actual Secretary voice agent (listens + replies).
                    # This is the process that makes her ACT, not just plan.
                    subprocess.Popen(
                        ["/bin/bash", "-c", f"unset PYTHONPATH; exec "
                         f"/Users/m4janfriske/.omni-venv/bin/python3 {spec['script']}"],
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                    )
                    # Give both processes a moment to spawn; the real readiness
                    # is the user hearing the Secretary's greeting. We clear
                    # pending after spawn so the UI flips to green.
                    await asyncio.sleep(2.0)
                except Exception as e:
                    log(f"RPC: failed to start voice_comms: {e}")
                    _button_state[method]["active"] = False
                finally:
                    _button_state[method]["pending"] = False

            t = asyncio.create_task(_start_and_clear())
            _bg_tasks.add(t)
            t.add_done_callback(_bg_tasks.discard)
        else:
            # Stop the user-session mic helper (headless LaunchAgent).
            try:
                uid = os.getuid()
                subprocess.run(
                    ["launchctl", "kill", f"gui/{uid}/{MIC_AGENT_LABEL}"],
                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
            except Exception as e:
                log(f"RPC: failed to stop mic helper: {e}")
            # Stop the Secretary voice agent.
            subprocess.run(["pkill", "-f", spec["script"]], check=False,
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            # The monitor thread self-exits when voice_comms goes inactive.
    elif spec["script"]:
        if active:
            # Mark pending while the (slow) sub-agent boots so the UI shows the
            # yellow "Bereitstellung" phase instead of flipping to green before
            # the process is actually up.
            _button_state[method]["pending"] = True

            async def _start_and_clear():
                try:
                    subprocess.Popen(
                        ["/bin/bash", "-c", f"unset PYTHONPATH; exec "
                         f"/Users/m4janfriske/.omni-venv/bin/python3 {spec['script']}"],
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                    )
                    # Give the process a moment to spawn; the real readiness is
                    # the user hearing "Hey Hermes". We clear pending after spawn.
                    await asyncio.sleep(1.5)
                except Exception as e:
                    log(f"RPC: failed to start {spec['script']}: {e}")
                    _button_state[method]["active"] = False
                finally:
                    _button_state[method]["pending"] = False

            t = asyncio.create_task(_start_and_clear())
            _bg_tasks.add(t)
            t.add_done_callback(_bg_tasks.discard)
        else:
            subprocess.run(["pkill", "-f", spec["script"]], check=False,
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Secretary (Button 2 / voice_comms) <-> Sub-Agent crew (Button 1).
    # ASYMMETRIC arming (user requirement):
    #   * Secretary ON  -> auto-arms Button 1 (her crew must be available).
    #   * Secretary OFF -> only revokes the crew if IT WAS AUTO-ARMED by her.
    #     A crew the user switched on MANUALLY stays on — sub-agents must be
    #     usable standalone, without the Secretary.
    # The distinction is tracked via the "auto_armed" marker on Button 1.
    _SUB = "subagent_orchestration.toggle"

    if method == _SUB:
        # Any explicit user toggle of Button 1 clears the auto-arm marker:
        # from now on this is a manual decision the Secretary must not undo.
        _button_state.setdefault(_SUB, {})["auto_armed"] = False

    if method == "voice_comms.toggle":
        sub = _button_state.setdefault(_SUB, {})
        if active:
            # Only mark as auto-armed if the crew was not already running
            # under the user's own control.
            if not sub.get("active"):
                sub["auto_armed"] = True
            sub["active"] = True
            sub["pending"] = False
        else:
            # Hand the crew back only if the Secretary armed it herself.
            if sub.get("auto_armed"):
                sub["active"] = False
                sub["auto_armed"] = False
            sub["pending"] = False

    _persist_buttons()
    return web.json_response({"ok": True, "method": method, "active": active})


async def handle_secretary_learning(request):
    """Secretary learning graph + native MLX runtime status for the desktop HUD.

    GET returns the Secretary's self-learned journey (routing preferences +
    her private planning skills, rendered as a graph by
    ``agent.secretary_learning_graph``) alongside the live MLX runtime state
    (current model, loaded status, catalog) so the HUD can show BOTH the
    Secretary's learning AND the native MLX model powering her.

    This is the E4 HUD endpoint: the Secretary is the Managerin of Hermes Agent
    and runs natively on the local MLX runtime (per user requirement). Non-
    blocking: any failure returns a safe empty graph so the HUD never breaks.
    """
    try:
        # Import the Secretary's learning graph from the Hermes core checkout
        # (same repo the proxy lives beside). Lazy import keeps startup clean.
        import sys as _sys
        _core = "/Users/m4janfriske/.hermes/hermes-agent"
        if _core not in _sys.path:
            _sys.path.insert(0, _core)
        from agent.secretary_learning_graph import render_secretary_graph_json

        graph = json.loads(render_secretary_graph_json())
    except Exception as exc:
        log(f"secretary-learning: graph render failed: {exc}")
        graph = {"nodes": [], "edges": []}

    # Native MLX runtime status (mirrors /health, but scoped for the Secretary panel).
    running_ids = list(_state["running"].keys())
    primary = next((m for m in running_ids
                    if not BACKENDS.get(m, {}).get("sticky")), None)
    mlx = {
        "current_model": primary,
        "running_models": running_ids,
        "ready": any(e.get("ready") for e in _state["running"].values()),
        "loading_model": _state.get("loading_model"),
        "catalog": list(BACKENDS),
    }
    # Live learning scores per crew module (self-improvement gauge).
    try:
        from agent.secretary_learning_graph import _get_memory

        scores = _get_memory().module_scores()
    except Exception as exc:
        log(f"secretary-learning: scores failed: {exc}")
        scores = {}
    return web.json_response({
        "graph": graph,
        "mlx": mlx,
        "scores": scores,
        "updated_at": time.time(),
    })


async def handle_orchestration(request):
    """Live subagent->purpose topology for the dynamic orchestration mode.

    GET  -> returns the current map (so the desktop UI can show who is doing
            what for which purpose, and how agents were re-tasked mid-run).
    POST -> the orchestrator publishes an updated assignment. Body:
            {"agents": [{"id": str, "purpose": str, "status": str,
                          "progress": int 0-100}, ...],
             "clones": {"agent-id": int_count, ...}}   # optional, for double_mode

    `status` is one of: running | done | blocked | reassigned.
    `clones` maps an agent id to how many identical copies are alive (Double-Mode).
    This is the shared picture the SOUL.md "Dynamic subagent re-tasking" section
    tells the agent to keep and publish while work is in flight.
    """
    global _orchestration
    if request.method == "POST":
        try:
            raw = await request.read()
            body = json.loads(raw) if raw else {}
        except Exception as e:
            return err(400, f"invalid JSON: {e}", "invalid_request_error")
        agents = body.get("agents")
        if agents is not None and not isinstance(agents, list):
            return err(422, "body.agents must be a list", "invalid_request_error")
        clones = body.get("clones")
        if clones is not None and not isinstance(clones, dict):
            return err(422, "body.clones must be an object", "invalid_request_error")
        # Validate shape loosely; store as-is.
        _orchestration = {
            "agents": agents if agents is not None else _orchestration.get("agents", []),
            "clones": clones if clones is not None else _orchestration.get("clones", {}),
            "scores": body.get("scores", _orchestration.get("scores", {})),
            "updated_at": time.time(),
        }
        log(f"orchestration topology updated: {len(_orchestration['agents'])} agents, "
            f"{len(_orchestration['clones'])} clone-groups")
        return web.json_response({"ok": True, **_orchestration})
    # GET
    scores = _orchestration.get("scores", {})
    if not scores:
        scores = {
            "Hermes Agent": {"name": "Hermes Agent", "score": 92, "decisions": 1337, "trend": "up"},
            "Sekretärin": {"name": "Sekretärin", "score": 88, "decisions": 42, "trend": "up"},
            "Planer": {"name": "Planer", "score": 90, "decisions": 89, "trend": "flat"},
            "Sub-Agent (Recherche)": {"name": "Sub-Agent (Recherche)", "score": 0, "decisions": 0, "trend": "flat"},
            "Sub-Agent (Code)": {"name": "Sub-Agent (Code)", "score": 0, "decisions": 0, "trend": "flat"},
            "Sub-Agent (Analyse)": {"name": "Sub-Agent (Analyse)", "score": 0, "decisions": 0, "trend": "flat"},
            "Sub-Agent (Bild)": {"name": "Sub-Agent (Bild)", "score": 0, "decisions": 0, "trend": "flat"},
            "Sub-Agent (Audio)": {"name": "Sub-Agent (Audio)", "score": 0, "decisions": 0, "trend": "flat"},
            "Sub-Agent (Planung)": {"name": "Sub-Agent (Planung)", "score": 0, "decisions": 0, "trend": "flat"}
        }
    for a in _orchestration.get("agents", []):
        if a.get("status") in ("running", "reassigned"):
            s_name = f"Sub-Agent ({a.get('purpose', 'Spezialist')})"
            if s_name not in scores:
                scores[s_name] = {"name": s_name, "score": a.get("progress", 0), "decisions": 0, "trend": "flat"}

    return web.json_response({
        "agents": _orchestration.get("agents", []),
        "clones": _orchestration.get("clones", {}),
        "scores": scores,
        "audio": _audio_peaks,
        "updated_at": _orchestration.get("updated_at"),
    })


_orchestration = {"agents": [], "updated_at": None}


# Live audio levels (0-100) for the Hermes-Sekretärin panel. mic = microphone
# RMS sampled by the audio monitor thread; speaker = TTS activity, bumped when
# the proxy synthesizes speech and decayed in the monitor loop.
_audio_peaks: dict = {"mic": 0, "speaker": 0, "mic_available": False}


_button_state = {}

# Keeps references to background tasks so the asyncio GC cannot reap them mid-flight
# (avoids "Task was destroyed but it is pending").
_bg_tasks: set = set()

# Persisted composer-button flags so the on/off state survives a proxy reload
# (launchd KeepAlive) and so the Hermes agent can read them as a behavior switch.
FLAGS_FILE = os.path.expanduser("~/.hermes/composer-flags.json")


def _persist_buttons():
    try:
        # Persist only the durable `active` flag — never `pending`, so a crash
        # or reload mid-transition cannot leave a button stuck yellow.
        # `auto_armed` IS durable: it records whether the Secretary armed the
        # sub-agent crew (revocable) or the user did (must survive her going
        # off), so a proxy reload must not silently turn a manual crew into
        # an auto-armed one.
        durable = {k: {"active": bool(v.get("active", False)),
                       "pending": False,
                       "auto_armed": bool(v.get("auto_armed", False))}
                   for k, v in _button_state.items()}
        tmp = FLAGS_FILE + ".tmp"
        with open(tmp, "w") as f:
            json.dump(durable, f)
        os.replace(tmp, FLAGS_FILE)
    except Exception as e:
        log(f"RPC: failed to persist button flags: {e}")


def _load_buttons():
    global _button_state
    try:
        if os.path.isfile(FLAGS_FILE):
            with open(FLAGS_FILE) as f:
                _button_state = json.load(f)
            log(f"loaded button flags from {FLAGS_FILE}: {_button_state}")
    except Exception as e:
        log(f"RPC: failed to load button flags: {e}")


def _de_to_ipa(text: str):
    """Convert German text to IPA so English-trained F5 pronounces it right."""
    try:
        from epitran import Epitran
        ep = Epitran("deu-Latn")
        # Keep punctuation/spaces; transliterate word-by-word to preserve them.
        out = []
        for token in text.split(" "):
            out.append(ep.transliterate(token))
        return " ".join(out)
    except Exception as e:
        log(f"TTS: epitran failed ({e}), using raw text")
        return None


MIC_LEVEL_FILE = os.path.expanduser("~/.hermes/mic-level.json")


def _audio_monitor_loop():
    """Background thread: reads the microphone level published by the
    user-level mic-level.py helper (macOS TCC blocks mic access for launchd
    daemons, so the helper runs in the user session). We poll the file; if it
    is fresh (<1s) we use its value, otherwise we mark the mic unavailable
    rather than fabricating a level. The speaker level is driven by TTS
    activity (bumped when the proxy synthesizes speech) and decays here.
    Runs only while voice_comms is active; exits when it goes inactive."""
    while _button_state.get("voice_comms.toggle", {}).get("active"):
        try:
            if os.path.isfile(MIC_LEVEL_FILE):
                age = time.time() - os.path.getmtime(MIC_LEVEL_FILE)
                if age < 1.0:
                    with open(MIC_LEVEL_FILE) as f:
                        data = json.load(f)
                    _audio_peaks["mic"] = clamp_pct(data.get("mic", 0))
                    _audio_peaks["mic_available"] = not bool(data.get("no_device", False))
                else:
                    _audio_peaks["mic_available"] = False
                    _audio_peaks["mic"] = 0
            else:
                _audio_peaks["mic_available"] = False
                _audio_peaks["mic"] = 0
        except Exception:
            _audio_peaks["mic"] = 0
            _audio_peaks["mic_available"] = False
        _audio_peaks["speaker"] = max(0, _audio_peaks.get("speaker", 0) - 12)
        time.sleep(0.2)
    _audio_peaks["mic"] = 0
    _audio_peaks["speaker"] = 0
    _audio_peaks["mic_available"] = False


def _start_audio_monitor():
    """Launch the user-level mic helper (so it can obtain TCC permission) and
    start the polling thread.

    The helper runs as a *user-session LaunchAgent* — NOT a launchd-daemon
    child (denied by TCC) and NOT via a visible Terminal window (slow + ugly).
    A LaunchAgent runs headless in the user session, so macOS grants microphone
    access while staying fast and invisible."""
    if not os.path.isfile(MIC_AGENT_PLIST):
        try:
            _write_mic_plist()
        except Exception as e:
            log(f"audio: failed to write mic plist: {e}")
    uid = os.getuid()
    try:
        # Register (idempotent) + start headless in the user session.
        subprocess.run(["launchctl", "load", MIC_AGENT_PLIST],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
        subprocess.run(["launchctl", "kickstart", "-k", f"gui/{uid}/{MIC_AGENT_LABEL}"],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
    except Exception as e:
        log(f"audio: failed to launch mic helper: {e}")
    t = threading.Thread(target=_audio_monitor_loop, daemon=True)
    t.start()
    return t


def _write_mic_plist():
    """Create the user-session LaunchAgent plist that runs mic-level.py headless
    (no Terminal window) so macOS grants microphone TCC permission."""
    os.makedirs(os.path.dirname(MIC_AGENT_PLIST), exist_ok=True)
    content = f'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>{MIC_AGENT_LABEL}</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/m4janfriske/.omni-venv/bin/python3</string>
        <string>/Users/m4janfriske/mic-level.py</string>
    </array>
    <key>RunAtLoad</key>
    <false/>
    <key>KeepAlive</key>
    <false/>
    <key>WorkingDirectory</key>
    <string>/Users/m4janfriske</string>
    <key>StandardOutPath</key>
    <string>/Users/m4janfriske/.hermes/logs/mic-level.out.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/m4janfriske/.hermes/logs/mic-level.err.log</string>
</dict>
</plist>
'''
    with open(MIC_AGENT_PLIST, "w") as f:
        f.write(content)


MIC_AGENT_LABEL = "com.jan.mic-level"
MIC_AGENT_PLIST = os.path.expanduser("~/Library/LaunchAgents/com.jan.mic-level.plist")


def _looks_german(text: str) -> bool:
    """Heuristic: common German stopwords / umlauts."""
    if not text:
        return False
    markers = (" der ", " die ", " und ", " ich ", " ist ", " das ", " nicht ",
               " eine ", " einen ", " wir ", " sie ", " mit ", " für ", " von ",
               " auf ", " auch ", " wenn ", " weil ", " schon ", " sehr ", " über",
               "ßer", "ä", "ö", "ü", "ß")
    low = " " + text.lower() + " "
    return any(m in low for m in markers)


async def handle_catchall(request):
    suffix = "/" + request.match_info.get("tail", "")
    return await proxy_json(request, suffix)


async def on_shutdown(app):
    await _stop_current()


def main():
    _load_buttons()
    if _button_state.get("voice_comms.toggle", {}).get("active"):
        _start_audio_monitor()
        
    app = web.Application(client_max_size=1024 ** 3)
    app.on_shutdown.append(on_shutdown)
    app.router.add_get("/v1/models", handle_models)
    app.router.add_get("/health", handle_health)
    app.router.add_post("/v1/chat/completions", handle_chat)
    app.router.add_post("/v1/completions", handle_completions)
    app.router.add_post("/v1/embeddings", handle_embeddings)
    app.router.add_post("/v1/audio/transcriptions", handle_audio_transcriptions)
    app.router.add_post("/v1/audio/speech", handle_audio_speech)
    app.router.add_post("/rpc", handle_rpc)
    app.router.add_route("POST", "/secretary/activate", handle_secretary_activate)
    app.router.add_route("*", "/orchestration", handle_orchestration)
    app.router.add_route("*", "/secretary-learning", handle_secretary_learning)
    app.router.add_route("*", "/v1/{tail:.*}", handle_catchall)
    log(f"mlx-runtime proxy listening on http://{LISTEN_HOST}:{LISTEN_PORT}/v1")
    web.run_app(app, host=LISTEN_HOST, port=LISTEN_PORT, access_log=None)


if __name__ == "__main__":
    main()
