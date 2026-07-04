# WeatherApp Design System V2
## Weather Experience — Dokument referencyjny

**Wersja:** 2.0  
**Data:** 2026-07-04  
**Status:** Zatwierdzony przez Master Admin  
**Architekt koncepcji:** Professor ChatGPT  
**Realizacja:** Claude Code Weather Specialist  
**Poprzednia wersja:** `docs/DESIGN_SYSTEM.md` (archiwum — nie usuwać)

---

## CZĘŚĆ I — FILOZOFIA PRODUKTU

### Zmiana paradygmatu

WeatherApp V1 był aplikacją pogodową.  
WeatherApp V2 jest **doświadczeniem**.

Różnica nie jest estetyczna. Jest fundamentalna.

Aplikacja pogodowa odpowiada na pytanie: *"Jaka jest pogoda?"*  
Weather Experience odpowiada na pytanie: *"Jak wygląda mój dzień?"*

Użytkownik nie otwiera aplikacji dlatego, że potrzebuje temperatury.  
Otwiera ją dlatego, że **samo korzystanie sprawia przyjemność**.

Tak jak B&O głośnik sprawia przyjemność zanim go włączysz.  
Tak jak Leica M sprawia przyjemność zanim zrobisz zdjęcie.  
Tak jak dobra kawa sprawia przyjemność zanim jej skosztasz — samym zapachem.

### Zasada transformacji danych

Nigdy nie pokazujemy danych. Pokazujemy ich **znaczenie dla człowieka**.

| Dane (V1) | Znaczenie (V2) |
|-----------|----------------|
| 61% wilgotności | Komfortowa wilgotność. Idealne warunki na spacer. |
| 1020 hPa | Wysokie ciśnienie. Możesz czuć więcej energii. |
| PM2.5 = 5 | Powietrze bardzo dobre. Warto przewietrzyć mieszkanie. |
| UV = 1 | SPF nie jest dziś potrzebny. |
| 15 km/h wiatr | Lekki wiatr. Nie utrudni spaceru. |
| Widoczność 25 km | Doskonała widoczność. Piękny dzień na fotografię. |

**Zasada:** Każdy parametr odpowiada na pytanie *"Co to oznacza dla mnie?"*

### Trzy słowa które definiują V2

**Spokój. Fascynacja. Powrót.**

Spokój — bo ekran niczego nie żąda.  
Fascynacja — bo każda sekcja jest głębsza niż poprzednia.  
Powrót — bo użytkownik wraca nie po pogodę, ale po uczucie.

---

## CZĘŚĆ II — PERSONY UŻYTKOWNIKÓW

### Persona 1: Piotr, 34 lata — "Sprawdzacz poranny"

Otwiera aplikację każdego ranka przed wyjściem. Ma 40 sekund.  
Chce: temperatura + czy zabrać kurtkę + ogólne nastawienie na dzień.  
Ocenia aplikację przez: szybkość pierwszego wrażenia.

**Design musi:** uderzać w 2 sekundy. Hero i kafelek AI Advice to jego ekran.

### Persona 2: Marta, 28 lat — "Plannerka weekendu"

Sprawdza pogodę w czwartek na weekend. Scrolluje wszystko.  
Chce: prognoza 7 dni + warunki do aktywności + opady godzinowe.  
Ocenia aplikację przez: czy dane są zrozumiałe bez wysiłku.

**Design musi:** sekcja Najbliższe dni i Twój dzień to jej rdzeń.

### Persona 3: Tomasz, 52 lata — "Ekspert"

Śledzi pogodę hobbystycznie. Zna meteogramy. Chce liczby.  
Chce: ciśnienie, PM2.5, PM10, prędkość wiatru w knotsach, Meteogram ICM.  
Ocenia aplikację przez: czy ma dane których inni nie mają.

**Design musi:** Warstwa 3 (Szczegóły) to jego terytorium. Musi być premium — nie technicznie.

### Persona 4: Zofia, 22 lata — "Estetka"

Pokazuje aplikację znajomym. Robi screenshoty.  
Chce: żeby aplikacja była piękna. Żeby Tik-Tok był zazdrosny.  
Ocenia aplikację przez: czy jest screenshot-worthy.

**Design musi:** Hero z żywym gradientem i duże kolorowe kafelki to jej WOW.

---

## CZĘŚĆ III — JĘZYK WIZUALNY

### Zasada 1: Hierarchia przez kontrast, nie przez dekorację

Na każdym ekranie jeden element dominuje.  
Pozostałe milczą i uzupełniają.  
Nigdy dwa elementy walczące o uwagę jednocześnie.

```
Rozmiar 96pt → temperatura (KRÓL)
Rozmiar 28-32pt → wartości kafelków (WAŻNE)
Rozmiar 16-20pt → wartości szczegółów (INFORMACJA)
Rozmiar 10-12pt → etykiety i kontekst (TŁO)
```

### Zasada 2: Kolor jest komunikatem

Każdy kolor w aplikacji niesie konkretne znaczenie.

| Kolor | Znaczenie | Użycie |
|-------|-----------|--------|
| Złoto `#b5862a` / `#d4b96a` | Komfort, premium, wartość | KOMFORT kafelek, daty, akcenty premium |
| Granat `#1e3a8a` | Pewność, stabilność, prognoza | JUTRO kafelek, elementy nawigacji |
| Stalowy błękit `#0c4a6e` | Ruch, dynamika | WIATR kafelek |
| Morski `#065f46` | Natura, życie, zdrowie | WILGOTNOŚĆ kafelek |
| Indygo `#3730a3` | Głębia, tajemnica | OPADY kafelek |
| `#2e3f52` | Scena, tło sekcji | Kontenery wszystkich sekcji |
| `rgba(255,255,255,0.09–0.13)` | Srebrny glass | Kafelki Najbliższe dni, Szczegóły |

**Zasada:** żaden kolor nie może być użyty "bo ładnie wygląda". Każdy musi mieć uzasadnienie w systemie.

### Zasada 3: Przestrzeń jest elementem designu

Przestrzeń między elementami nie jest pustką — jest oddechem.  
Brak przestrzeni = brak luksusu.

```
Gap między kafelkami: 10pt
Padding sekcji: 16pt
Padding kafelka: 14pt
Marginesy boczne: 16pt
Gap między sekcjami: 12pt
Ostatnia sekcja marginBottom: 32pt (zapobiega ucięciu)
```

---

## CZĘŚĆ IV — TYPOGRAFIA

### Hierarchia fontów

```
HERO TEMPERATURA
Font: System default bold
Rozmiar: 96pt
Waga: 700
Letter-spacing: -2
Kolor: #ffffff
Cel: absolutna dominacja

WARTOŚCI KAFELKÓW (Warstwa 1)
Rozmiar: 28-32pt
Waga: 800
Letter-spacing: -1
Kolor: #ffffff

WARTOŚCI KAFELKÓW (Warstwa 2–3)
Rozmiar: 20-22pt
Waga: 800
Kolor: #ffffff lub kolor tematyczny

ETYKIETY (uppercase)
Rozmiar: 9-10pt
Waga: 800
Letter-spacing: 1.2
Kolor: rgba(255,255,255,0.55-0.65)
TextTransform: uppercase

KONTEKST / INTERPRETACJA
Rozmiar: 11pt
Waga: 500-600
Kolor: kolor tematyczny lub rgba(255,255,255,0.65)

CIAŁO TEKSTU (bottom sheets, opisy)
Rozmiar: 15pt
Waga: 400
Line-height: 23
Kolor: rgba(255,255,255,0.75)
```

### Zasada czyszczenia danych

Każda wartość w kafelku musi być **kompletna albo elegancko skrócona**.  
`"°C"` → `"°"` (ciętsze, bardziej premium)  
`"km/h"` → pokazuj ale nie dominuj  
`" mb"` → `" hPa"` (bardziej naukowe, bardziej premium)

---

## CZĘŚĆ V — HERO: ŻYWY GRADIENT

Hero to najważniejszy element aplikacji. Ma **żyć**.

### Mapa gradientów (pora dnia × warunki)

```
ŚWIT (05:00–07:00) + brak opadów
→ ['#c9813a', '#b5470f', '#1a1a3a']  złoto/pomarańcz/granat

PORANEK (07:00–11:00) + słonecznie
→ ['#1e6fb3', '#1a3a6e', '#0d1f3c']  błękitny świt

DZIEŃ (11:00–16:00) + słonecznie
→ ['#1e5799', '#207cca', '#2989d8']  głęboki błękit

POPOŁUDNIE (16:00–19:00) + słonecznie
→ ['#d4720a', '#c9502a', '#1a2a5e']  złoto/pomarańcz

ZACHÓD (19:00–21:00)
→ ['#c94b0a', '#8b1a6b', '#1a0a3a']  magenta/fiolet

NOC (21:00–05:00)
→ ['#0d1f3c', '#0a1628', '#060e1e']  głęboki granat

BURZA (priorytet nad porą dnia)
→ ['#1a1a2e', '#2d1b4e', '#0d0d1a']  grafit/fiolet

MGŁA (priorytet)
→ ['#4a5568', '#6b7280', '#374151']  mleczny szary

ŚNIEG (priorytet)
→ ['#e0eaff', '#b8cffe', '#1e3a8a']  biało-niebieski

UPAŁ >33°C (priorytet)
→ ['#c0392b', '#e74c3c', '#8b1a0a']  czerwień ognia
```

### Animacja Hero

Gradient ma być żywy ale **spokojny** — nie ekscytujący.

```tsx
// Implementacja: Animated.loop z interpolacją pozycji gradientu
// Okres: 8-12 sekund (bardzo wolno)
// Typ: spring/ease (nie linear)
// Co animuje: delikatne przesunięcie punktu gradientu
// Nie animuje: zmiana kolorów nagle — tylko przy fetchWeather
```

---

## CZĘŚĆ VI — NOWE SEKCJE

### Sekcja: AI ADVICE — "Dzisiaj AI radzi"

Nie jest generowana losowo. Wykorzystuje dane pogodowe do tworzenia **inteligentnego komentarza**.

**Logika generowania (w kodzie, bez zewnętrznego AI):**

```
Priorytet 1: Ostrzeżenia (burza, upał >33°, mróz <-10°, zła jakość powietrza)
Priorytet 2: Aktywności optymalne (UV niski + brak wiatru + brak opadów → rower)
Priorytet 3: Ciekawostki (wschód/zachód, długość dnia, ciśnienie)
Priorytet 4: Ogólny komfort
```

**Format wyświetlania:**
```
💡 Dzisiaj AI radzi

"To dobry dzień na rower. Wiatr słaby, powietrze czyste,
UV nie wymaga ochrony. Wróć przed 19:00 — wieczorem
ochłodzi się o 7 stopni."
```

### Sekcja: TWÓJ DZIEŃ — ocena aktywności

Ocena na ★★★★★ + lista aktywności zalecanych/niezalecanych.

```
TWÓJ DZIEŃ
★★★★☆ Bardzo dobry

✔ spacer           ✔ fotografię
✔ rower            ✔ mycie auta
✔ bieganie         ✗ grill (wiatr)
✔ praca w ogrodzie ✗ plaża (zachmurzenie)
```

**Logika oceny:**
- 5★: temp 18-26°, UV<5, wiatr<15, brak opadów, AQI dobra
- 4★: jeden parametr poza optimum
- 3★: dwa parametry poza optimum
- 2★: opady lub silny wiatr
- 1★: burza, upał >33°, mróz, bardzo zła jakość powietrza

---

## CZĘŚĆ VII — KOMPONENTY PREMIUM

### Zasada glassmorphism (V2)

Glassmorphism **tak** — ale z dyscypliną.  
Nie nakładamy blur na wszystko. Tylko tam gdzie daje głębię.

```tsx
// Styl silver glass tile (Najbliższe dni, Szczegóły)
{
  backgroundColor: 'rgba(255,255,255,0.09)',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.15)',
  // Brak elevation na Android (niewidoczna na ciemnym tle)
}

// Styl colored tile (Przegląd)
{
  backgroundColor: '#b5862a', // lub inny kolor tematyczny
  borderRadius: 18,
  elevation: 6,
  shadowColor: '#000',
  shadowOpacity: 0.3,
  shadowRadius: 8,
}
```

### Bottom Sheet — standard V2

Każdy bottom sheet ma:
1. Handle bar (40x4, rgba biały 0.2, zaokrąglony)
2. Kolorowy akcent pionowy (6x24px) obok tytułu
3. Duża wartość w kolorze tematycznym (40pt)
4. Ciało tekstu (15pt, rgba biały 0.75, lineHeight 23)
5. Przycisk "Zamknij" — półprzeźroczysty

```tsx
// Styl bottom sheet container
{
  backgroundColor: '#1a2b3c',
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  padding: 24,
  paddingBottom: 40,
}
```

### Menu V2 — Panel premium

Zamiast listy przycisków: duże eleganckie kafelki z ikonami.

```
┌─────────────────┬─────────────────┐
│  📅             │  🌡              │
│  Prognoza       │  Meteogram       │
│  7 dni          │  ICM             │
├─────────────────┼─────────────────┤
│  🏃             │  🌆              │
│  Sport          │  Ulubione        │
│  Rower          │  miasta          │
├─────────────────┼─────────────────┤
│  📊             │  🔔              │
│  Historia       │  Powiadomienia   │
│  pogody         │                  │
└─────────────────┴─────────────────┘
```

---

## CZĘŚĆ VIII — ANIMACJE

### Zasada animacji V2

Animacja **niewidoczna gdy dobra, kłująca gdy zła.**

Dobra animacja:
- Użytkownik myśli "aplikacja jest płynna"
- Nie myśli "ładna animacja"

Zła animacja:
- Użytkownik myśli "to się rusza"
- Uwaga idzie na animację, nie na treść

### Katalog animacji

```
fade-in przy ładowaniu danych
→ Animated.timing, 400ms, ease-out

spring przy kliknięciu kafelka
→ Animated.spring, stiffness 200, damping 20

scroll reveal (sekcje wchodzą od dołu)
→ Animated.timing, 300ms per section, staggered 50ms

gradient hero pulse
→ Animated.loop, 10s period, ease-in-out
→ BARDZO delikatny — ledwo zauważalny

bottom sheet slide-up
→ animationType="slide" (natywny Android)
```

---

## CZĘŚĆ IX — SIATKA I ODSTĘPY

```
Jednostka podstawowa: 8pt

Marginesy boczne kontenera: 16pt (= 2 × 8)
Gap między kafelkami 2-kolumnowymi: 10pt (≈ 1.25 × 8)
Gap między sekcjami: 12pt (= 1.5 × 8)
Padding wewnętrzny sekcji: 16pt (= 2 × 8)
Padding kafelka kolorowego: 14pt (≈ 1.75 × 8)
Padding kafelka srebrnego: 14pt
Border radius sekcji: 20pt
Border radius kafelka kolorowego: 18pt
Border radius kafelka srebrnego: 16pt
Border radius bottom sheet: 24pt
MarginBottom ostatniej sekcji: 32pt (= 4 × 8)
```

---

## CZĘŚĆ X — IKONOGRAFIA

### Stan obecny (V1)

Ikony emoji — poprawne, ale nie tworzą własnej tożsamości.

### Cel (V2)

Własna rodzina ikon — spójny styl, nowoczesny charakter.

**Styl docelowy:**
- Stroke (outline), nie fill
- Grubość linii: 1.5-2pt
- Zaokrąglenia: duże (jak SF Symbols Apple)
- Rozmiar: 24pt base
- Kolor: adaptowalny (biały na ciemnym, tematyczny na kafelkach)

**Priorytet implementacji:**
1. Warunki pogodowe (słońce, deszcz, śnieg, burza, mgła, wiatr) — KRYTYCZNE
2. Parametry (termometr, oko, słońce UV, zegar, wiatr) — WAŻNE
3. Nawigacja (menu, ulubione, wstecz) — STANDARD

**Narzędzie:** React Native SVG — własne komponenty ikonograficzne

---

## CZĘŚĆ XI — ROADMAPA WDROŻENIA

### V2 Alpha — "Żywy Hero + AI Advice"

**Cel:** pierwsze WOW.  
**Zakres:**
- [ ] Dynamiczny gradient Hero (pora dnia × warunki)
- [ ] Delikatna animacja Hero pulse
- [ ] Sekcja AI Advice (logika lokalna, bez zewnętrznego API)
- [ ] Sekcja Twój dzień (★ + aktywności)

**Kryterium ukończenia:** Pablo patrzy na Hero i mówi "wow".

### V2 Beta — "Menu Premium + Komponenty"

**Cel:** spójność designu.  
**Zakres:**
- [ ] Menu przebudowane na 2-kolumnowe duże kafelki
- [ ] Własne ikony SVG dla warunków pogodowych (6 podstawowych)
- [ ] Animacje scroll reveal dla sekcji
- [ ] Bottom sheet spring animation

**Kryterium ukończenia:** każda sekcja wygląda jak zaprojektowana przez ten sam team tego samego dnia.

### V2 RC — "Performance + Polish"

**Cel:** gotowość na "pokaż znajomym".  
**Zakres:**
- [ ] Pełna rodzina ikon SVG
- [ ] Optymalizacja re-renderów (React.memo, useMemo)
- [ ] Testy na wolnym urządzeniu
- [ ] Brak białych ekranów przy pierwszym ładowaniu

**Kryterium ukończenia:** 5 osób testuje aplikację i pyta "skąd to masz?"

### V2 Stable — "App Store Ready"

**Cel:** produkt gotowy do dystrybucji.  
**Zakres:**
- [ ] Obsługa błędów klasy premium (piękne ekrany błędów)
- [ ] Onboarding (pierwsze uruchomienie)
- [ ] Powiadomienia pogodowe
- [ ] Widżet systemowy (opcjonalnie)

---

## CZĘŚĆ XII — ESTYMACJA PROJEKTU

### Metodologia

Trzy warianty: optymistyczny / realistyczny / pesymistyczny  
Jednostka: sesje pracy (1 sesja ≈ 2-4 godziny z Claude Code)

| Moduł | Optymistyczny | Realistyczny | Pesymistyczny | Ryzyko |
|-------|---------------|--------------|---------------|--------|
| Żywy gradient Hero | 1 sesja | 2 sesje | 3 sesje | NISKIE |
| Animacja Hero pulse | 0.5 sesji | 1 sesja | 2 sesje | NISKIE |
| AI Advice (logika) | 1 sesja | 2 sesje | 3 sesje | ŚREDNIE |
| Twój dzień (★) | 0.5 sesji | 1 sesja | 2 sesje | NISKIE |
| Menu premium (kafelki) | 1 sesja | 2 sesje | 4 sesje | ŚREDNIE |
| Ikony SVG (6 bazowych) | 1 sesja | 2 sesje | 4 sesje | WYSOKIE |
| Ikony SVG (pełna rodzina) | 2 sesje | 4 sesje | 8 sesji | WYSOKIE |
| Animacje scroll reveal | 1 sesja | 2 sesje | 3 sesje | NISKIE |
| Bottom sheet spring | 0.5 sesji | 1 sesja | 2 sesje | NISKIE |
| Performance optymalizacja | 1 sesja | 2 sesje | 4 sesje | ŚREDNIE |
| **SUMA (bez pełnych ikon)** | **7.5** | **15** | **27** | |
| **SUMA (pełen zakres)** | **9.5** | **19** | **35** | |

### Zależności implementacji

```
Najpierw (blokują wszystko):
└─ Żywy gradient Hero   [MUSI być pierwszy — to "twarz" V2]

Równolegle po Hero:
├─ AI Advice logic
├─ Twój dzień sekcja
└─ Menu premium

Po AI Advice:
└─ Ikony SVG (bazowe)

Po Menu premium + ikonach bazowych:
└─ Animacje scroll reveal

Na końcu (nie blokują niczego):
└─ Performance + Pełna rodzina ikon
```

### Ocena obecnego projektu

| Obszar | Ocena | Uzasadnienie |
|--------|-------|--------------|
| Architektura kodu | 7/10 | Monolityczny App.tsx (~2800 linii) — działa, ale trudny w utrzymaniu |
| UI obecne | 7/10 | Dobre podstawy, V2 buduje na istniejącym — nie zaczyna od zera |
| UX flow | 8/10 | Scroll jednoekranowy — właściwy dla aplikacji pogodowej |
| Wydajność | 8/10 | Build 22s, start ~3s — akceptowalne |
| Dług techniczny | ŚREDNI | App.tsx do podziału na komponenty w V2 RC |
| Możliwość rozwoju | 9/10 | React Native + TypeScript — solidna podstawa |

### Rekomendacja

**Pozostać przy obecnym kodzie. Nie zaczynać od nowa.**

Uzasadnienie:
1. Architektura jest poprawna — problem to rozmiar App.tsx, nie architektura
2. Wszystkie V2 Alpha i Beta można wdrożyć bez refaktoru
3. Refaktor App.tsx to V2 RC — po udowodnieniu wartości produktu
4. Nowa architektura = 3-4 tygodnie bez widocznych efektów dla użytkownika
5. Inkrementalny development pozwala Pablo testować każdy etap na telefonie

---

## ZASADY PRACY V2

### Przed każdą zmianą kodu

1. Czy to jest zgodne z filozofią "Doświadczenie, nie dane"?
2. Czy odpowiada na pytanie "Co to oznacza dla człowieka"?
3. Czy przechodzi 5 pytań (piękniej / wzrok / scroll / powrót / rok)?
4. Czy Design System V2 jest zachowany?
5. Git backup przed dużą zmianą.

### Format pracy z Pablo

- Propozycja planu → czekamy na "tak"
- Implementacja → commit → test na telefonie
- Raport: co zrobiono, co widać, co następne

---

*Ścieżka: `C:\AI_PROJECTS\WeatherApp\docs\DESIGN_SYSTEM_V2.md`*  
*Link: [DESIGN_SYSTEM_V2.md](WeatherApp/docs/DESIGN_SYSTEM_V2.md)*  
*Restore point: git tag `v1-stable-pre-v2`*  
*Poprzednia wersja: [DESIGN_SYSTEM.md](WeatherApp/docs/DESIGN_SYSTEM.md) — archiwum*
