#!/usr/bin/env python3
"""
voice_trainer.py - Hermes Agent Voice Training Module (Self-Learning Loop)

This module evaluates the TTS (Kokoro) output by running it through the STT (Whisper).
If the STT fails to transcribe the text exactly as generated, the module can test
alternative phonetic spellings and save the best ones to ~/.hermes/tts_dictionary.json.
This provides the agents with a permanent mechanism to improve their pronunciation
over time to "Hollywood-film quality".

Usage:
  python3 voice_trainer.py "Mein Name ist Hermes, ich bin dein persönlicher Agent."
"""

import sys
import os
import json
import requests
import Levenshtein
import tempfile
import time

PROXY_URL = "http://127.0.0.1:1240/v1/audio"
DICT_PATH = os.path.expanduser("~/.hermes/tts_dictionary.json")

def generate_tts(text: str, voice="df_victoria") -> bytes:
    """Generate TTS audio via the Hermes Proxy."""
    print(f"Generating TTS for: '{text}' (Voice: {voice})")
    resp = requests.post(f"{PROXY_URL}/speech", json={
        "model": "kokoro",
        "input": text,
        "voice": voice,
        "response_format": "wav"
    })
    resp.raise_for_status()
    return resp.content

def run_stt(audio_bytes: bytes) -> str:
    """Run STT via the Hermes Proxy."""
    print("Running STT analysis...")
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_name = tmp.name

    try:
        with open(tmp_name, "rb") as f:
            resp = requests.post(
                f"{PROXY_URL}/transcriptions",
                files={"file": f},
                data={"model": "mlx-community/whisper-small-mlx"}
            )
        resp.raise_for_status()
        result = resp.json()
        return result.get("text", "").strip()
    finally:
        os.remove(tmp_name)

def evaluate_quality(original: str, transcribed: str) -> float:
    """Calculate the clarity score using Levenshtein distance."""
    # Normalize texts for fairer comparison
    import re
    norm_orig = re.sub(r'[^\w\s]', '', original.lower().strip())
    norm_trans = re.sub(r'[^\w\s]', '', transcribed.lower().strip())
    
    dist = Levenshtein.distance(norm_orig, norm_trans)
    max_len = max(len(norm_orig), len(norm_trans), 1)
    
    score = max(0, 100 - (dist / max_len * 100))
    return score

def save_custom_dict(d: dict):
    with open(DICT_PATH, "w") as f:
        json.dump(d, f, indent=2)

def train_phrase(phrase: str, target_word: str = None, alternatives: list = None):
    """
    Train the system on a difficult phrase. 
    If target_word and alternatives are provided, it will test them 
    and update the dictionary with the one that scores highest.
    """
    print(f"\n--- Training Loop Started ---")
    baseline_audio = generate_tts(phrase)
    baseline_text = run_stt(baseline_audio)
    baseline_score = evaluate_quality(phrase, baseline_text)
    
    print(f"Baseline Score: {baseline_score:.1f}%")
    print(f"Original:   {phrase}")
    print(f"Transcribed: {baseline_text}")
    
    if baseline_score == 100.0:
        print("Perfect clarity! No training needed.")
        return
        
    if target_word and alternatives:
        print(f"\nAttempting to improve word '{target_word}'...")
        best_alt = None
        best_score = baseline_score
        
        # Load existing dict
        if os.path.exists(DICT_PATH):
            with open(DICT_PATH, "r") as f:
                custom_dict = json.load(f)
        else:
            custom_dict = {}
            
        for alt in alternatives:
            print(f"\nTesting alternative phonetics: '{alt}'")
            # Temporarily apply dictionary change
            custom_dict[target_word] = alt
            save_custom_dict(custom_dict)
            
            # Allow Kokoro to reload dictionary (it loads it per request now)
            audio = generate_tts(phrase)
            transcribed = run_stt(audio)
            score = evaluate_quality(phrase, transcribed)
            
            print(f"Score for '{alt}': {score:.1f}% -> Transcribed as: '{transcribed}'")
            if score > best_score:
                best_score = score
                best_alt = alt
                
        if best_alt:
            print(f"\n>>> Improvement found! Setting '{target_word}' -> '{best_alt}' permanently.")
            custom_dict[target_word] = best_alt
            save_custom_dict(custom_dict)
        else:
            print(f"\n>>> No better alternative found. Reverting to baseline.")
            # Revert dictionary
            if target_word in custom_dict:
                del custom_dict[target_word]
                save_custom_dict(custom_dict)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        phrase = sys.argv[1]
        train_phrase(phrase)
    else:
        # Default test run
        print("Running default test loop...")
        train_phrase("Hermes ist die beste Software für Künstliche Intelligenz auf dem Mac.")
        train_phrase("Die Software Architektur des Agenten ist fantastisch.", target_word="Software", alternatives=["Soft-Wär", "Zoft-wäher", "Softwähr"])
