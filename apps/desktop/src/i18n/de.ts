import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const de: Translations = defineLocale({
  "common": {
    "apply": "Anwenden",
    "back": "Zurück",
    "save": "Speichern",
    "saving": "Speichern…",
    "cancel": "Abbrechen",
    "change": "Ändern",
    "choose": "Auswählen",
    "clear": "Leeren",
    "close": "Schließen",
    "collapse": "Einklappen",
    "confirm": "Bestätigen",
    "connect": "Verbinden",
    "connecting": "Verbindet…",
    "continue": "Fortfahren",
    "copied": "Kopiert",
    "copy": "Kopieren",
    "copyFailed": "Kopieren fehlgeschlagen",
    "delete": "Löschen",
    "docs": "Dokumentation",
    "done": "Fertig",
    "error": "Fehler",
    "expand": "Ausklappen",
    "failed": "Fehlgeschlagen",
    "formatJson": "JSON formatieren",
    "free": "Frei",
    "loading": "Wird geladen…",
    "notSet": "Nicht festgelegt",
    "refresh": "Aktualisieren",
    "remove": "Entfernen",
    "replace": "Ersetzen",
    "retry": "Wiederholen",
    "run": "Ausführen",
    "send": "Senden",
    "set": "Festlegen",
    "skip": "Überspringen",
    "update": "Aktualisieren",
    "on": "Ein",
    "off": "Aus"
  },
  "fileMenu": {
    "revealFinder": "Im Finder anzeigen",
    "revealExplorer": "Im Explorer anzeigen",
    "revealFileManager": "Ordner öffnen",
    "revealInSidebar": "In Seitenleiste anzeigen",
    "copyPath": "Pfad kopieren",
    "copyRelativePath": "Relativen Pfad kopieren",
    "rename": "Umbenennen…",
    "delete": "Löschen",
    "renameTitle": "Umbenennen",
    "renameLabel": "Neuer Name",
    "deleteBody": "Möchten Sie dieses Element wirklich löschen?",
    "pathCopied": "Pfad kopiert"
  },
  "boot": {
    "ready": "Hermes Desktop ist bereit",
    "steps": {
      "connectingGateway": "Verbinde mit Gateway",
      "loadingSettings": "Lade Einstellungen",
      "loadingSessions": "Lade Sitzungen",
      "startingDesktopConnection": "Starte Desktop-Verbindung",
      "startingHermesDesktop": "Starte Hermes Desktop…"
    },
    "errors": {
      "backgroundExited": "Hintergrundprozess beendet",
      "backendStopped": "Backend gestoppt",
      "desktopBootFailed": "Desktop-Start fehlgeschlagen",
      "gatewayConnectionLost": "Gateway-Verbindung verloren",
      "gatewaySignInRequired": "Anmeldung erforderlich",
      "ipcBridgeUnavailable": "IPC-Bridge nicht verfügbar"
    },
    "failure": {
      "title": "Verbindungsfehler",
      "description": "Konnte keine Verbindung zum Hermes-Backend herstellen.",
      "remoteTitle": "Remote-Verbindungsfehler",
      "remoteDescription": "Remote-Gateway nicht erreichbar.",
      "retry": "Wiederholen",
      "repairInstall": "Installation reparieren",
      "useLocalGateway": "Lokales Gateway nutzen",
      "gatewaySettings": "Gateway-Einstellungen",
      "back": "Zurück",
      "openLogs": "Protokolle öffnen",
      "repairHint": "Starten Sie den Backend-Dienst neu.",
      "signOutAndSignIn": "Abmelden und neu anmelden"
    }
  },
  "titlebar": {
    "hideSidebar": "Seitenleiste ausblenden",
    "showSidebar": "Seitenleiste einblenden",
    "search": "Suchen",
    "searchTitle": "Sitzungen, Ansichten und Aktionen durchsuchen",
    "swapSidebarSides": "Seitenleistenposition wechseln",
    "hideRightSidebar": "Rechte Leiste ausblenden",
    "showRightSidebar": "Rechte Leiste einblenden",
    "muteHaptics": "Haptik stummschalten",
    "unmuteHaptics": "Haptik aktivieren",
    "openSettings": "Einstellungen öffnen",
    "openStarmap": "Sternenkarte öffnen"
  },
  "language": {
    "label": "Sprache",
    "description": "Wählen Sie die Sprache für die Desktop-Oberfläche.",
    "saving": "Sprache wird gespeichert…",
    "saveError": "Sprachaktualisierung fehlgeschlagen",
    "switchTo": "Sprache wechseln",
    "searchPlaceholder": "Sprachen durchsuchen…",
    "noResults": "Keine Sprachen gefunden"
  },
  "sidebar": {
    "nav": {
      "new-session": "Neue Sitzung",
      "skills": "Fähigkeiten",
      "messaging": "Nachrichten",
      "artifacts": "Artefakte"
    },
    "searchAria": "Sitzungen durchsuchen",
    "searchPlaceholder": "Sitzungen durchsuchen…",
    "clearSearch": "Suche leeren",
    "results": "Ergebnisse",
    "pinned": "Angepinnt",
    "sessions": "Sitzungen",
    "cronJobs": "Cron-Jobs",
    "shiftClickHint": "Umschalt-Klick zum Anpinnen",
    "noWorkspace": "Kein Arbeitsbereich",
    "projectEmpty": "Noch keine Sitzungen",
    "noSessions": "Noch keine Sitzungen",
    "dateDivider": {
      "today": "Heute",
      "yesterday": "Gestern",
      "thisWeek": "Diese Woche",
      "lastWeek": "Letzte Woche",
      "thisMonth": "Diesen Monat"
    },
    "row": {
      "openInSplit": "In Teilansicht öffnen"
    }
  },
  "composer": {
    "message": "Nachricht",
    "placeholderStarting": "Hermes wird gestartet…",
    "placeholderReconnecting": "Verbindung wird wiederhergestellt…",
    "placeholderFollowUp": "Folgenachricht senden",
    "newSessionPlaceholders": [
      "Was bauen wir?",
      "Gib Hermes eine Aufgabe",
      "Was beschäftigt dich?",
      "Beschreibe, was du brauchst",
      "Was packen wir an?",
      "Frag einfach",
      "Beginne mit einem Ziel"
    ],
    "followUpPlaceholders": [
      "Folgenachricht senden",
      "Mehr Kontext hinzufügen",
      "Anfrage verfeinern",
      "Was kommt als Nächstes?",
      "Weiter so",
      "Weiter vertiefen",
      "Anpassen oder fortfahren"
    ],
    "startVoice": "Sprachkonversation starten",
    "queueMessage": "Nachricht einreihen",
    "steer": "Ausführung steuern",
    "stop": "Stoppen",
    "send": "Senden",
    "speaking": "Spricht",
    "transcribing": "Transkribiert",
    "thinking": "Denkt nach"
  },
  "skills": {
    "tabSkills": "Fähigkeiten",
    "tabToolsets": "Werkzeuge",
    "tabMcp": "MCP",
    "tabHub": "Hub durchsuchen",
    "all": "Alle",
    "searchSkills": "Fähigkeiten durchsuchen…",
    "searchToolsets": "Werkzeuge durchsuchen…",
    "refresh": "Aktualisieren",
    "refreshing": "Wird aktualisiert…"
  },
  "artifacts": {
    "search": "Artefakte durchsuchen…",
    "refresh": "Aktualisieren",
    "refreshing": "Wird aktualisiert…",
    "indexing": "Artefakte werden indiziert",
    "tabAll": "Alle",
    "tabImages": "Bilder",
    "tabFiles": "Dateien",
    "tabLinks": "Links",
    "noArtifactsTitle": "Keine Artefakte gefunden"
  },
  "commandCenter": {
    "close": "Befehlsmenü schließen",
    "paletteTitle": "Befehlspalette",
    "back": "Zurück",
    "searchPlaceholder": "Sitzungen, Ansichten und Aktionen durchsuchen",
    "goTo": "Gehe zu",
    "goToSession": "Zur Sitzung springen",
    "branches": "Zweige",
    "projects": "Projekte",
    "openFolder": "Ordner als Projekt öffnen…"
  },
  "statusStack": {
    "agents": "Agenten",
    "goalActive": "Ziel aktiv",
    "goalDone": "Ziel erreicht",
    "goalPaused": "Ziel pausiert",
    "goalWaiting": "Ziel wartet",
    "running": "Läuft"
  },
  "modelPicker": {
    "title": "Modell wechseln",
    "current": "Aktuell:",
    "unknown": "(unbekannt)",
    "search": "Anbieter und Modelle filtern…",
    "noModels": "Keine Modelle gefunden",
    "addProvider": "Anbieter hinzufügen",
    "loadFailed": "Modelle konnten nicht geladen werden",
    "pro": "Pro"
  },
  "desktop": {
    "desktopCommands": "Desktop-Befehle",
    "audioReadFailed": "Audioaufnahme konnte nicht gelesen werden",
    "sessionUnavailable": "Sitzung nicht verfügbar",
    "createSessionFailed": "Neue Sitzung konnte nicht erstellt werden",
    "promptFailed": "Eingabe fehlgeschlagen",
    "emptySlashCommand": "Leerer Schrägstrich-Befehl",
    "resumeStrandedTitle": "Gestrandete Sitzung",
    "resumeStrandedBody": "Diese Sitzung kann aus der vorherigen Ausführung fortgesetzt werden.",
    "resumeRetry": "Fortsetzen"
  },
  "settings": {
    "closeSettings": "Einstellungen schließen",
    "exportConfig": "Konfiguration exportieren",
    "importConfig": "Konfiguration importieren",
    "resetToDefaults": "Auf Standard zurücksetzen",
    "resetConfirm": "Alle Einstellungen auf Hermes-Standard zurücksetzen?",
    "nav": {
      "providers": "Anbieter",
      "providerAccounts": "Konten",
      "providerApiKeys": "API-Schlüssel",
      "providerCustomEndpoints": "Eigene Endpunkte",
      "gateway": "Gateway",
      "apiKeys": "API-Schlüssel",
      "keybinds": "Tastaturkürzel",
      "keysTools": "Werkzeuge",
      "keysSettings": "Einstellungen",
      "mcp": "MCP",
      "archivedChats": "Archivierte Chats",
      "about": "Über",
      "billing": "Abrechnung",
      "notifications": "Benachrichtigungen",
      "plugins": "Plugins"
    }
  },
  "profiles": {
    "close": "Profile schließen",
    "title": "Profile",
    "search": "Profile durchsuchen…",
    "loading": "Profile werden geladen…",
    "newProfile": "Neues Profil",
    "allProfiles": "Alle Profile",
    "showAllProfiles": "Alle Profile anzeigen"
  },
  "cron": {
    "close": "Cron schließen",
    "title": "Geplante Aufgaben",
    "search": "Cron-Jobs durchsuchen…",
    "loading": "Aufgaben werden geladen…"
  }
})
