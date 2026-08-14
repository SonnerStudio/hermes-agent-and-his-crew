import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const cz: Translations = defineLocale({
  "common": {
    "apply": "Uplatnit",
    "back": "Zpět",
    "save": "Uložit",
    "saving": "Ukládání…",
    "cancel": "Zrušit",
    "change": "Změnit",
    "choose": "Vybrat",
    "clear": "Vymazat",
    "close": "Zavřít",
    "collapse": "Sbalit",
    "confirm": "Potvrdit",
    "connect": "Připojit",
    "connecting": "Připojování…",
    "continue": "Pokračovat",
    "copied": "Zkopírováno",
    "copy": "Kopírovat",
    "copyFailed": "Kopírování selhalo",
    "delete": "Smazat",
    "docs": "Dokumentace",
    "done": "Hotovo",
    "error": "Chyba",
    "expand": "Rozbalit",
    "failed": "Selhalo",
    "formatJson": "Formátovat JSON",
    "free": "Volno",
    "loading": "Načítání…",
    "notSet": "Nenastaveno",
    "refresh": "Obnovit",
    "remove": "Odebrat",
    "replace": "Nahradit",
    "retry": "Zkusit znovu",
    "run": "Spustit",
    "send": "Odeslat",
    "set": "Nastavit",
    "skip": "Přeskočit",
    "update": "Aktualizovat",
    "on": "Zapnuto",
    "off": "Vypnuto"
  },
  "fileMenu": {
    "revealFinder": "Zobrazit ve Finderu",
    "revealExplorer": "Zobrazit v Průzkumníku",
    "revealFileManager": "Otevřít složku",
    "revealInSidebar": "Zobrazit v postranním panelu",
    "copyPath": "Kopírovat cestu",
    "copyRelativePath": "Kopírovat relativní cestu",
    "rename": "Přejmenovat…",
    "delete": "Smazat",
    "renameTitle": "Přejmenovat",
    "renameLabel": "Nový název",
    "deleteBody": "Opravdu chcete tuto položku smazat?",
    "pathCopied": "Cesta zkopírována"
  },
  "boot": {
    "ready": "Hermes Desktop je připraven",
    "steps": {
      "connectingGateway": "Připojování k živé bráně",
      "loadingSettings": "Načítání nastavení",
      "loadingSessions": "Načítání relací",
      "startingDesktopConnection": "Spouštění desktopového připojení",
      "startingHermesDesktop": "Spouštění Hermes Desktop…"
    },
    "errors": {
      "backgroundExited": "Proces na pozadí byl ukončen",
      "backendStopped": "Backend byl zastaven",
      "desktopBootFailed": "Spuštění aplikace selhalo",
      "gatewayConnectionLost": "Spojení s bránou bylo ztraceno",
      "gatewaySignInRequired": "Je vyžadováno přihlášení",
      "ipcBridgeUnavailable": "IPC můstek není dostupný"
    },
    "failure": {
      "title": "Chyba připojení",
      "description": "Nepodařilo se připojit k backendu Hermes.",
      "remoteTitle": "Chyba vzdáleného připojení",
      "remoteDescription": "Vzdálená brána je nedostupná.",
      "retry": "Zkusit znovu",
      "repairInstall": "Opravit instalaci",
      "useLocalGateway": "Použít lokální bránu",
      "gatewaySettings": "Nastavení brány",
      "back": "Zpět",
      "openLogs": "Otevřít protokoly",
      "repairHint": "Restartujte službu backendu.",
      "signOutAndSignIn": "Odhlásit a znovu přihlásit"
    }
  },
  "titlebar": {
    "hideSidebar": "Skrýt postranní panel",
    "showSidebar": "Zobrazit postranní panel",
    "search": "Hledat",
    "searchTitle": "Prohledat relace, zobrazení a akce",
    "swapSidebarSides": "Změnit stranu postranního panelu",
    "hideRightSidebar": "Skrýt pravý panel",
    "showRightSidebar": "Zobrazit pravý panel",
    "muteHaptics": "Ztlumit haptiku",
    "unmuteHaptics": "Zapnout haptiku",
    "openSettings": "Otevřít nastavení",
    "openStarmap": "Otevřít mapu"
  },
  "language": {
    "label": "Jazyk",
    "description": "Vyberte jazyk pro desktopové rozhraní.",
    "saving": "Ukládání jazyka…",
    "saveError": "Aktualizace jazyka selhala",
    "switchTo": "Přepnout jazyk",
    "searchPlaceholder": "Hledat jazyky…",
    "noResults": "Žádné jazyky nenalezeny"
  },
  "sidebar": {
    "nav": {
      "new-session": "Nová relace",
      "skills": "Dovednosti",
      "messaging": "Zprávy",
      "artifacts": "Artefakty"
    },
    "searchAria": "Hledat relace",
    "searchPlaceholder": "Hledat relace…",
    "clearSearch": "Vymazat hledání",
    "results": "Výsledky",
    "pinned": "Připnuté",
    "sessions": "Relace",
    "cronJobs": "Plánované úlohy",
    "shiftClickHint": "Shift-kliknutím připnete",
    "noWorkspace": "Žádný pracovní prostor",
    "projectEmpty": "Zatím žádné relace",
    "noSessions": "Zatím žádné relace",
    "dateDivider": {
      "today": "Dnes",
      "yesterday": "Včera",
      "thisWeek": "Tento týden",
      "lastWeek": "Minulý týden",
      "thisMonth": "Tento měsíc"
    },
    "row": {
      "openInSplit": "Otevřít v rozděleném zobrazení"
    }
  },
  "composer": {
    "message": "Zpráva",
    "placeholderStarting": "Hermes se spouští…",
    "placeholderReconnecting": "Obnovování spojení s Hermes…",
    "placeholderFollowUp": "Odeslat navazující zprávu",
    "newSessionPlaceholders": [
      "Na čem pracujeme?",
      "Zadejte Hermesovi úkol",
      "Co máte na mysli?",
      "Popište, co potřebujete",
      "Co budeme řešit?",
      "Zeptejte se na cokoli",
      "Začněte s cílem"
    ],
    "followUpPlaceholders": [
      "Odeslat navazující zprávu",
      "Přidat další kontext",
      "Zpřesnit žádost",
      "Co dál?",
      "Pokračovat",
      "Prohloubit téma",
      "Upravit nebo pokračovat"
    ],
    "startVoice": "Spustit hlasovou konverzaci",
    "queueMessage": "Zařadit zprávu do fronty",
    "steer": "Řídit provádění",
    "stop": "Zastavit",
    "send": "Odeslat",
    "speaking": "Mluví",
    "transcribing": "Přepisuje",
    "thinking": "Přemýšlí"
  },
  "skills": {
    "tabSkills": "Dovednosti",
    "tabToolsets": "Nástroje",
    "tabMcp": "MCP",
    "tabHub": "Procházet Hub",
    "all": "Vše",
    "searchSkills": "Hledat dovednosti…",
    "searchToolsets": "Hledat nástroje…",
    "refresh": "Obnovit dovednosti",
    "refreshing": "Obnovování dovedností…"
  },
  "artifacts": {
    "search": "Hledat artefakty…",
    "refresh": "Obnovit",
    "refreshing": "Obnovování…",
    "indexing": "Indexování nedávných artefaktů",
    "tabAll": "Vše",
    "tabImages": "Obrázky",
    "tabFiles": "Soubory",
    "tabLinks": "Odkazy",
    "noArtifactsTitle": "Nebyly nalezeny žádné artefakty"
  },
  "commandCenter": {
    "close": "Zavřít příkazové centrum",
    "paletteTitle": "Paleta příkazů",
    "back": "Zpět",
    "searchPlaceholder": "Prohledat relace, zobrazení a akce",
    "goTo": "Přejít na",
    "goToSession": "Přejít na relaci",
    "branches": "Větve",
    "projects": "Projekty",
    "openFolder": "Otevřít složku jako projekt…"
  },
  "statusStack": {
    "agents": "Agenti",
    "goalActive": "Cíl aktivní",
    "goalDone": "Cíl dokončen",
    "goalPaused": "Cíl pozastaven",
    "goalWaiting": "Cíl čeká",
    "running": "Běží"
  },
  "modelPicker": {
    "title": "Přepnout model",
    "current": "Aktuální:",
    "unknown": "(neznámý)",
    "search": "Filtrovat poskytovatele a modely…",
    "noModels": "Nenalezeny žádné modely",
    "addProvider": "Přidat poskytovatele",
    "loadFailed": "Modely se nepodařilo načíst",
    "pro": "Pro"
  },
  "desktop": {
    "desktopCommands": "Desktopové příkazy",
    "audioReadFailed": "Nepodařilo se načíst nahraný zvuk",
    "sessionUnavailable": "Relace není dostupná",
    "createSessionFailed": "Nepodařilo se vytvořit novou relaci",
    "promptFailed": "Provedení dotazu selhalo",
    "emptySlashCommand": "Prázdný příkaz",
    "resumeStrandedTitle": "Přerušená relace",
    "resumeStrandedBody": "Tuto relaci lze obnovit z předchozího běhu.",
    "resumeRetry": "Obnovit"
  },
  "settings": {
    "closeSettings": "Zavřít nastavení",
    "exportConfig": "Exportovat konfiguraci",
    "importConfig": "Importovat konfiguraci",
    "resetToDefaults": "Obnovit výchozí",
    "resetConfirm": "Obnovit veškeré nastavení na výchozí hodnoty Hermes?",
    "nav": {
      "providers": "Poskytovatelé",
      "providerAccounts": "Účty",
      "providerApiKeys": "API klíče",
      "providerCustomEndpoints": "Vlastní koncové body",
      "gateway": "Brána",
      "apiKeys": "API klíče",
      "keybinds": "Klávesové zkratky",
      "keysTools": "Nástroje",
      "keysSettings": "Nastavení",
      "mcp": "MCP",
      "archivedChats": "Archivované chaty",
      "about": "O aplikaci",
      "billing": "Fakturace",
      "notifications": "Oznámení",
      "plugins": "Pluginy"
    }
  },
  "profiles": {
    "close": "Zavřít profily",
    "title": "Profily",
    "search": "Hledat profily…",
    "loading": "Načítání profilů…",
    "newProfile": "Nový profil",
    "allProfiles": "Všechny profily",
    "showAllProfiles": "Zobrazit všechny profily"
  },
  "cron": {
    "close": "Zavřít plánovač",
    "title": "Naplánované úlohy",
    "search": "Hledat úlohy…",
    "loading": "Načítání úloh…"
  }
})
