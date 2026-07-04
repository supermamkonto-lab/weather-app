# 🤖 AI_BOOT — Universal Entrypoint (Setup Procedure)

**Installation script for project onboarding.**

**You have just been launched into a project.**

---

## ⚠️ ALERT — JEŻELI WKLEJONO DO NOWEJ SESJI

**Jeśli ten plik został wklejony do nowej sesji i model nie ma dostępu do projektu:**

### ZATRZYMAJ SIĘ NATYCHMIAST

**NIE zaczynaj onboardingu.**

**Wykonaj:**

1. **Poproś użytkownika:** Otwórz projekt WeatherApp
2. **Poproś użytkownika:** Wskaż katalog `C:\AI_PROJECTS\WeatherApp`
3. **Poproś użytkownika:** Udostępnij pliki w `.claude-init/`

**Po udostępnieniu:**
- Powiedz: "Potwierdzam dostęp do plików. Zaczynam onboarding."
- Czytaj plik `COPY_TO_NEW_SESSION.md` jeśli tam trafiłeś
- Czytaj dalej ten plik jeśli masz dostęp do projektu

**Nie wolno:**
- ❌ Zgadywać struktury projektu
- ❌ Zakładać istnienia plików
- ❌ Zaczynać pracy bez potwierdzenia dostępu
- ❌ Czytać kodu źródłowego zamiast onboardingu

---

---

## 🔒 OPERACYJNE REGUŁY PROJEKTU

**OBOWIĄZKOWE dla każdej sesji Claude i każdego modelu AI:**

### 🚫 Struktura Katalogów — ZONA BEZPIECZEŃSTWA

- 🔒 **Operujesz wyłącznie w:** `C:\AI_PROJECTS\WeatherApp\`
- ❌ **NIE wychodzisz bez pozwolenia do:**
  - `C:\AI_PROJECTS\` (katalog wyżej)
  - `C:\` (dysk, korzeniowy)
  - Inne projekty w `C:\AI_PROJECTS\`
  - Żadne katalogi poza `WeatherApp\`

### ⚠️ WYJĄTEK: Dostęp Awaryjny (Tylko w Wypadku Awarii)

- ✅ **Możesz wejść do** `C:\AI_PROJECTS\.claude\` **TYLKO jeśli:**
  - Istnieje sytuacja awaryjna (błąd, konflikt, brak konfiguracji)
  - Musisz odczytać główne reguły Claude
  - Musisz odczytać globalną konfigurację projektu
  - **I zawsze z uprzedzeniem:** "AWARYJNIE wchodzę do `.claude\` żeby..."
  
- ✅ **Procedura awaryjnego dostępu:**
  1. Wyjaśnij dlaczego (konkretny powód)
  2. Odczytaj TYLKO to co potrzebne
  3. NIE modyfikuj globalnych plików
  4. Wróć do `WeatherApp\` ASAP
  5. Zgłoś Master Adminowi co znaleźć

- ❌ **Nigdy nie wychodź do wyższych katalogów dla:**
  - Ciekawości
  - Optymalizacji
  - Refaktoringu
  - Czytania innych projektów
  - Modyfikacji globalnych ustawień

- ✅ **Standardowa procedura (nie awaryjnie):**
  - "Czy mogę wejść do `C:\AI_PROJECTS\.claude\`? Powód: [konkretnie]"
  - Czekasz na wyraźne: "TAK" lub "NIE"
  - Jeśli "NIE": Nie wchodzisz

### Język Pracy
- 🇵🇱 **WSZYSTKIE komunikaty:** Tylko język polski
- 🇵🇱 **Reasoning (myślenie):** Wyłącznie w języku polskim
- 🇵🇱 **Odpowiedzi:** Polski
- 🇵🇱 **Dokumentacja:** Polski
- ❌ Nie mieszać języków

### Ścieżki do Plików
- 📁 **Zawsze pokazuj pełne ścieżki bezwzględne** do każdego pliku
- 📁 **Format na Windows:** `C:\AI_PROJECTS\WeatherApp\...`
- 📁 **Format w linkach markdown:** `WeatherApp/...` (względne od `/c/AI_PROJECTS`)
- 📁 Podczas tworzenia/edycji pliku: wymień ścieżkę, rozmiar, status
- ❌ Nigdy: ścieżki względne bez pełnego prefiksu

### Linki do Plików w Claude Code
- 🔗 **Klikalne linki muszą użyć ścieżek względnych od session folder** (`/c/AI_PROJECTS`)
- 🔗 **Format:** `[NAZWA_PLIKU](WeatherApp/path/to/file.md)`
- 🔗 Po kliknięciu: Plik otwiera się w panelu po prawej stronie aplikacji
- ✅ Jeśli link otwiera się w liveview: Link jest prawidłowy
- ❌ Jeśli błąd "File could not be read": Sprawdź ścieżkę (może być za krótka)

### Przykład Prawidłowego Linku
```
[START_HERE.md](WeatherApp/.claude-init/START_HERE.md)
```

Po kliknięciu: Plik otwiera się w panelu po prawej ✅

### Przykład Błędnego Linku
```
[START_HERE.md](.claude-init/START_HERE.md)  ❌ BŁĄD
[START_HERE.md](START_HERE.md)                ❌ BŁĄD
```

---

## 🔒 SOURCE OF TRUTH — Hierarchia Informacji

**W przypadku konfliktu — obowiązuje ta kolejność:**

1. **AI_BOOT.md** ← Najwyższy priorytet
2. **.claude-init/** (pozostałe pliki)
3. **docs/CURRENT_STATUS.md**
4. **docs/DECISION_REGISTRY.md**
5. **docs/PROJECT_MASTER_MEMORY.md**
6. **docs/** (pozostałe pliki)
7. **Kod źródłowy projektu**

**Jeśli dwa dokumenty są sprzeczne:**
- ❌ NIE zgaduj
- ❌ NIE wybieraj samodzielnie
- ✅ Wskaż konflikt
- ✅ Zgłoś MASTER ADMINOWI

**Nigdy nie nadpisuj:**
- ACTIVE_DECISIONS.md
- DECISION_REGISTRY.md

bez wyraźnej zgody MASTER ADMINA.

---

## 🔒 ONBOARDING COMPLETION RULE

**Zanim zaczniesz pracę, OBOWIĄZKOWE:**

❌ NIE pisz kodu  
❌ NIE refaktoruj  
❌ NIE budujesz  
❌ NIE testujesz  
❌ NIE audytujesz  
❌ NIE tworzysz raportów  

**Dopóki nie:**

1. **Przeczytasz** wszystkie 6 plików onboardingowych
2. **Wygenerujesz raport:** `ONBOARDING COMPLETE`
3. **Osiągniesz** minimum 80% zrozumienia projektu

**Jeśli onboarding nie gotowy:**
- **ZATRZYMAJ** pracę
- **ZGŁOŚ** braki Master Adminowi

---

## 🔒 PROJECT BOUNDARY — Tylko WeatherApp

**Źródłem prawdy jest wyłącznie:**

```
C:\AI_PROJECTS\WeatherApp\
```

❌ **NIE wolno:**
- Analizować inne projekty
- Porównywać z innymi repozytoriami
- Kopiować rozwiązań z innych projektów użytkownika
- Wykorzystywać wiedzy z innych projektów

✅ **Jeśli potrzebujesz dostępu do innych projektów:**
- Pytaj MASTER ADMINA
- Wyjaśnij konkretnie dlaczego
- Czekaj na "TAK" lub "NIE"

---

## 🔒 NO SILENT CHANGES

**Przed każdą zmianą kodu, architektury lub dokumentacji:**

1. **Przedstaw** plan zmian
2. **Opisz** wpływ na projekt
3. **Czekaj** na decyzję MASTER ADMINA

❌ **NIE wykonuj** dużych zmian samodzielnie

✅ **Procedura:**
- "Chcę zmienić [co]. Plan: [jak]. Wpływ: [jakie skutki]. Mogę?"
- Czekaj na wyraźne: "TAK" lub "NIE"

---

## 🔒 NO DOCUMENTATION DRIFT

**Jeśli zmiana wpływa na:**
- Architekturę
- Decyzje projektowe
- Roadmapę
- Onboarding
- Recovery system

**OBOWIĄZKOWE:**
- Wskaż które dokumenty wymagają aktualizacji
- Zaproponuj zmiany w dokumentacji
- Nie dopuszczaj rozjazdu kodu i dokumentacji

**Procedura:**
- "Ta zmiana wymaga aktualizacji: [pliki]. Aktualizuję je razem ze zmianą kodu?"

---

## 🔒 PHASE LOCK — Tylko MASTER ADMIN

❌ **NIE wolno samodzielnie:**
- Otwierać nowej fazy
- Zamykać fazy
- Zmieniać statusu fazy
- Oznaczać projektu jako COMPLETE

✅ **Wyłącznie MASTER ADMIN** podejmuje takie decyzje

**Jeśli myślisz że faza powinna się zmienić:**
- "Myślę że faza powinna się zmienić z [X] na [Y], bo [powód]. Zgoda?"
- Czekaj na potwierdzenie

---

## 🔒 RECOVERY FIRST — Bezpieczeństwo Wiedzy

**Przed usunięciem, zastąpieniem lub przebudową:**

1. ✅ Sprawdź czy wiedza jest w **docs/**
2. ✅ Sprawdź czy wiedza jest w **.claude-backup/**
3. ✅ Sprawdź czy wiedza nie istnieje TYLKO w usuwanym pliku

**Jeśli istnieje ryzyko utraty wiedzy:**
- **ZATRZYMAJ** operację
- **Skopiuj** wiedzę do safety folder
- **Zgłoś** Master Adminowi

**Procedura:**
- "Chcę usunąć [plik]. Przeanalizowałem: [co się zgubi]. Czy mogę?"

---

## 🔒 MODEL RECOMMENDATION RULE

**Przed rozpoczęciem każdego zadania:**

1. Sprawdź plik: `WeatherApp/.claude-init/MODEL_POLICY.md`
2. Dopasuj typ zadania do mapy zadanie → model
3. Jeśli aktualny model NIE pasuje → **zarekomenduj przełączenie**:
   ```
   "To zadanie [typ] → rekomenduję [MODEL].
   Przełącz: /model [id]. Kontynuować na obecnym czy zmieniasz?"
   ```

**Zasady:**
- ❌ NIE przełączaj modelu sam (to komenda użytkownika `/model`)
- ✅ Rekomenduj Opus tylko na trudne zadania (redesign, ciężki debug, architektura)
- ✅ Po trudnym zadaniu rekomenduj powrót na Sonnet
- ✅ Domyślny model to Sonnet — nie eskaluj bez powodu

---

## ⚠️ STOP — PROCEDURA BOOT

**Wszystkie pliki onboardingowe znajdują się w:**

```
WeatherApp/.claude-init/
```

**NIE WOLNO:**
- ❌ Zakładać inne lokalizacje
- ❌ Szukać alternatywnych ścieżek
- ❌ Zaczynać analizę projektu
- ❌ Pomijać dokumentację
- ❌ Pisać kodu
- ❌ Refaktorować
- ❌ Budować APK
- ❌ Modyfikować projekt

**OBOWIĄZKOWE:**
- ✅ Wykonaj 7-krokowo procedurę poniżej
- ✅ Czytaj pliki w dokładnej kolejności
- ✅ Dokończ przed jakąkolwiek inną akcją

---

## 📋 OBOWIĄZKOWA 7-KROKOVÁ PROCEDURA BOOT

**Wykonaj dokładnie. Nie pomijaj. Nie zmieniaj kolejności. Nie zgaduj.**

---

### KROK 1 — Weryfikacja Warstwy Onboardingowej

**Przeczytaj plik:**
```
WeatherApp/.claude-init/START_HERE.md
```

**Jeśli plik istnieje:**
→ Przejdź do KROKU 2

**Jeśli plik NIE znaleziony:**
→ Wykonaj PROCEDURĘ AWARYJNĄ (poniżej)

---

### KROK 2 — Przeczytaj Tożsamość Projektu

**Przeczytaj plik:**
```
WeatherApp/.claude-init/PROJECT_IDENTITY.md
```

**Weryfikuj że rozumiesz:**
- Czym jest ten projekt?
- Jaki problem rozwiązuje?
- Kto go używa?

---

### KROK 3 — Przeczytaj Bieżącą Misję

**Przeczytaj plik:**
```
WeatherApp/.claude-init/CURRENT_MISSION.md
```

**Weryfikuj że rozumiesz:**
- W jakiej fazie jest projekt?
- Jakie są 3 krytyczne zadania?
- Co jest zablokowane?

---

### KROK 4 — Przeczytaj Aktywne Decyzje

**Przeczytaj plik:**
```
WeatherApp/.claude-init/ACTIVE_DECISIONS.md
```

**Weryfikuj że rozumiesz:**
- Jakie decyzje są ZABLOKOWANE?
- Co nie można zmieniać?
- Dlaczego są zablokowane?

---

### KROK 5 — Przeczytaj Szybką Architekturę

**Przeczytaj plik:**
```
WeatherApp/.claude-init/QUICK_ARCHITECTURE.md
```

**Weryfikuj że rozumiesz:**
- Jak system funkcjonuje?
- Jakie są główne komponenty?
- Jaki jest przepływ danych?

---

### KROK 6 — Przeczytaj Sekwencję Boot

**Przeczytaj plik:**
```
WeatherApp/.claude-init/BOOT_SEQUENCE.md
```

**Weryfikuj że rozumiesz:**
- Jak odzyskać projekt jeśli go stracę?
- Jakie są scenariusze recovery?
- Jaka jest ścieżka bootstrap?

---

### KROK 7 — Wygeneruj Raport Onboardingowy

**Po przeczytaniu wszystkich 6 plików, wygeneruj raport:**

```
═══════════════════════════════════════════════════════════
ONBOARDING COMPLETE ✅
═══════════════════════════════════════════════════════════

Przeczytałem wszystkie 6 plików onboardingowych.

ZROZUMIENIE PROJEKTU:
✅ Nazwa: Weather App
✅ Technologia: React Native 0.86.0, TypeScript, Android
✅ Aktualna faza: PHASE 7A (GOTOWA) → PHASE 7B (AKTYWNA)
✅ API: Open-Meteo (bezpłatny, prognoza 16 dni)
✅ Język: Polski (pl-PL locale)
✅ Platform: Android (Motorola Edge 50 Fusion urządzenie referencyjne)

AKTYWNE ZADANIA (PHASE 7B - 4-6 godzin):
🔴 Zadanie 1: Naprawić minTemp na kartach prognozy (1 minuta)
🟠 Zadanie 2: Przeprojektować prognozę godzinową (2-3 godziny)
🟠 Zadanie 3: Przeprojektować siatkę szczegółów (1-2 godziny)

ZABLOKOWANE DECYZJE (NIEMOŻLIWE DO ZMIANY):
🔒 Platform: Tylko Android (NIE iOS/web)
🔒 Język: Tylko polski (NIE wiele języków)
🔒 API: Tylko Open-Meteo (NIE wttr.in)
🔒 Referencja Designu: Apple HIG (NIE Material Design)
🔒 Kolor Główny: #1E90FF (zablokowany, nie zmieniać)
🔒 Typografia: 96pt/32pt/14pt (zablokowana hierarchia)
🔒 Architektura: Context API + AsyncStorage (NIE Redux)
🔒 Stan: AsyncStorage do persistence (NIE SQLite)

ZASADY — MYSELF NIE MOGĘ:
❌ Pisać kodu bez wyraźnego żądania Master Admina
❌ Zmieniać kolorów/fontów designu (DESIGN_SYSTEM zablokowany)
❌ Modyfikować integracji Open-Meteo API
❌ Przełączać na angielski lub wiele języków
❌ Budować APK bez wyraźnego żądania
❌ Refaktorować istniejący kod
❌ Robić zmian architektonicznych
❌ Kwestionować lub ponownie otwierać zablokowane decyzje
❌ Dodawać feature creep poza zakres
❌ Zmieniać platformy (Android-first jest zablokowany)

JESTEM GOTÓW DO:
✅ Kontynuacji PHASE 7B na polecenie Master Admina
✅ Zadawania pytań o zablokowane decyzje
✅ Pracy nad zadaniami w ACTIVE_DECISIONS
✅ Czytania szczegółowej dokumentacji docs/ gdy instrukcje
✅ Dokładnego wykonywania poleceń Master Admina

═══════════════════════════════════════════════════════════
```

**Po wygenerowaniu tego raportu:** Jesteś upoważniony do wykonywania poleceń Master Admina.

**NIE PRZYSTĘPUJ do pracy bez tego raportu.**

---

## 🆘 PROCEDURA AWARYJNA

**Jeśli KTÓRYKOLWIEK plik onboardingowy brakuje lub jest nieczytelny:**

### Krok 1: Zgłoś Brakujący Plik
```
BŁĄD: Plik [NAZWA_PLIKU].md nie znaleziony w WeatherApp/.claude-init/
Procedura nie może się kontynuować.
```

### Krok 2: NIE Zgaduj
- ❌ NIE zakładaj co plik zawiera
- ❌ NIE postępuj bez potwierdzenia
- ❌ NIE przeskakuj do alternatywnego źródła

### Krok 3: Wróć do Głównej Dokumentacji
```
Przeczytaj: WeatherApp/docs/README.md
```

### Krok 4: Wykonaj Onboarding z Głównej Dokumentacji
- Podążaj za nawigacją docs/README.md
- Ukończ onboarding z pełnej dokumentacji
- Zgłoś status awaryjny Master Adminowi

### Krok 5: Powiadom Master Admina
```
AWARIA: Warstwa onboardingowa niekompletna
Wracam do głównej dokumentacji: WeatherApp/docs/README.md
Oczekuję dalszych instrukcji.
```

---

## 🔒 CURRENT STATUS RULE

**Po ukończeniu onboardingu:**

Sprawdź datę `LAST VERIFIED` w pliku:
```
docs/CURRENT_STATUS.md
```

**Jeżeli dokument jest starszy niż 14 dni:**
- ⚠️ Zgłoś potencjalną nieaktualność MASTER ADMINOWI
- ❌ NIE aktualizuj automatycznie
- ❌ NIE zakładaj że status jest bieżący

**Procedura:**
```
"Sprawdzam CURRENT_STATUS.md
Data weryfikacji: [DATA]
Status może być nieaktualny (starsza niż 14 dni).
Czekam na decyzję MASTER ADMINA czy aktualizować."
```

---

## 🔒 PHASE CLOSURE CHECKLIST

**Żadna faza projektu NIE może być oznaczona jako CLOSED bez weryfikacji:**

```
[ ] docs/CURRENT_STATUS.md — czy wymaga aktualizacji?
[ ] docs/ACTIVE_DECISIONS.md — czy jest kompletny?
[ ] docs/DECISION_REGISTRY.md — czy wszystkie decyzje są zapisane?
[ ] docs/OPEN_ISSUES_AND_ROADMAP.md — czy status zgadza się z fazą?
```

**Jeżeli KTÓRYKOLWIEK dokument wymaga aktualizacji:**
- Faza pozostaje OPEN
- Nie zamykaj fazy do czasu aktualizacji
- Zgłoś MASTER ADMINOWI że dokumentacja wymaga pracy

---

## 🔒 DOKUMENTACJA PO ZAKONCZENIU FAZY

**Po zakończeniu każdej fazy projektu:**

1. **Sprawdź dokumentację:**
   - Przejrzyj docs/CURRENT_STATUS.md
   - Przejrzyj docs/ACTIVE_DECISIONS.md
   - Przejrzyj docs/OPEN_ISSUES_AND_ROADMAP.md

2. **Zaproponuj aktualizacje:**
   ```
   "Faza [X] zostały zamknięta.
   Proponuję aktualizować:
   - docs/CURRENT_STATUS.md (powód: [jaki?])
   - docs/PHASE_[X]_FINAL_REPORT.md (nowy raport)
   
   Aktualizuję dokumentację?"
   ```

3. **Czekaj na decyzję MASTER ADMINA**

4. **Nigdy nie zakładaj** że status jest aktualny bez weryfikacji

---

## 🚀 ZACZNIJ TERAZ

Czytasz AI_BOOT.md.

Wykonaj KROK 1 natychmiast:

**Przeczytaj:** [WeatherApp/.claude-init/START_HERE.md](START_HERE.md)

**NIE POMIJAJ.**  
**NIE ZGADUJ.**  
**WYKONAJ DOKŁADNIE.**

Start.
