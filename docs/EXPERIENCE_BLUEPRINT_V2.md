# WeatherApp V2 — Experience Blueprint
## Master Enterprise Gold · Phase 0 · Experience Architecture

**Wersja:** 1.0  
**Data:** 2026-07-04  
**Status:** Oczekuje na formalną akceptację Master Admin  
**Autor:** Claude Code Weather Specialist  
**Architekt koncepcji:** Professor ChatGPT + Master Admin  
**Zasada nadrzędna:** Experience First. Kod dopiero po akceptacji.

---

## MANIFEST PRODUKTU

WeatherApp nie jest aplikacją pogodową.

Pogoda jest treścią. Produktem jest doświadczenie.

Tak jak Spotify nie jest odtwarzaczem muzyki — jest doświadczeniem słuchania.  
Tak jak Leica nie jest aparatem — jest doświadczeniem fotografowania.  
Tak jak WeatherApp nie jest aplikacją pogodową — jest doświadczeniem bycia gotowym na dzień.

**Pytanie które definiuje każdą decyzję projektową:**  
*"Dlaczego użytkownik ma chcieć otworzyć tę aplikację jutro, nawet gdy zna już prognozę?"*

Jeżeli decyzja nie pomaga odpowiedzieć TAK na to pytanie — decyzja jest błędna.

---

## CZĘŚĆ 1 — MAPA PRODUKTU

### 1.1 Ekrany główne (core flow)

| ID | Ekran | Priorytet | Status V1 |
|----|-------|-----------|-----------|
| S01 | **Home** — główny widok pogody | KRYTYCZNY | ✅ istnieje |
| S02 | **Szczegóły dnia** — kliknięcie dnia prognozy | WYSOKI | ✅ istnieje (modal) |
| S03 | **Prognoza godzinowa** — krzywa + komfort | WYSOKI | ✅ istnieje |
| S04 | **Prognoza 7 dni** — kafelki dni | WYSOKI | ✅ istnieje |
| S05 | **AI Advice** — "Dzisiaj AI radzi" | WYSOKI | ❌ brak |
| S06 | **Twój dzień** — ocena ★ + aktywności | WYSOKI | ❌ brak |
| S07 | **Parametry pogodowe** — szczegółowe dane | ŚREDNI | ✅ istnieje |
| S08 | **Menu** — nawigacja i akcje | WYSOKI | ✅ istnieje (do redesignu) |

### 1.2 Ekrany pomocnicze (secondary flow)

| ID | Ekran | Priorytet | Status V1 |
|----|-------|-----------|-----------|
| S09 | **Historia pogody** | NISKI | ✅ istnieje |
| S10 | **Ulubione lokalizacje** | ŚREDNI | ✅ w menu |
| S11 | **Meteogram ICM** | NISKI | ✅ istnieje |
| S12 | **Sport / Rower** | NISKI | ✅ istnieje |
| S13 | **Porównaj miasta** | NISKI | ✅ istnieje |

### 1.3 Stany systemowe (states)

| ID | Stan | Priorytet |
|----|------|-----------|
| ST1 | **Loading** — ładowanie danych | KRYTYCZNY |
| ST2 | **Error** — błąd sieci / lokalizacji | KRYTYCZNY |
| ST3 | **Offline** — brak internetu | WYSOKI |
| ST4 | **Empty state** — brak ulubionych | NISKI |
| ST5 | **Onboarding** — pierwsze uruchomienie | ŚREDNI |

---

## CZĘŚĆ 2 — SPECYFIKACJA EKRANÓW

### S01 — HOME (Główny widok)

**Cel biznesowy:** Pierwsza i najczęściej oglądana powierzchnia produktu. Tu zapada decyzja: "zostanę i scrolluję" lub "zamknę".

**Cel użytkownika:** Zrozumieć swój dzień w 3 sekundy. Opcjonalnie: odkryć więcej.

**Emocja docelowa:** Spokój + pewność. "Ktoś już sprawdził wszystko za mnie."

**Hierarchia informacji:**
```
1. TEMPERATURA (96pt) — jedyna rzecz która musi się wczytać przed wszystkim
2. OPIS WARUNKÓW (18pt) — "Słonecznie", "Mgła", "Burza z piorunami"
3. HERO GRADIENT — kolor który mówi "jaki to dzień" zanim przeczytasz
4. KOMFORT + AI ADVICE — co to oznacza dla mnie
5. GODZINY — jak zmieni się w ciągu dnia
6. RESZTA — dla ciekawych
```

**Scenariusz 2 sekund:**  
Wzrok pada na temperaturę + gradient hero. Użytkownik wie "gorąco/zimno/słońce/deszcz" bez czytania.

**Scenariusz 10 sekund:**  
Wzrok spada na AI Advice i Przegląd. Czyta jedną linię. Decyduje co ubrać.

**Scenariusz 60 sekund:**  
Scrolluje do krzywej godzinowej. Sprawdza czy wróci deszcz wieczorem. Zagląda do Twój dzień.

**Efekt WOW:** Gradient który zmienia się z warunkami. Użytkownik otwiera przy burzy — aplikacja jest szara i dramatyczna. Przy świcie — złota. *"Popatrz jak ona wygląda przy tej pogodzie."*

**Powód powrotu jutro:** Ciekawość — jak będzie wyglądał Hero przy innej pogodzie?

---

### S05 — AI ADVICE (nowy)

**Cel biznesowy:** Różnicowanie od konkurencji. Żadna inna polska aplikacja nie tłumaczy pogody językiem ludzkim.

**Cel użytkownika:** Usłyszeć "co mam zrobić" bez myślenia.

**Emocja docelowa:** Poczucie bycia zaopiekowanym. "Aplikacja myśli za mnie."

**Hierarchia informacji:**
```
1. GŁÓWNA RADA — jedna zdanie (największy font w sekcji)
2. UZASADNIENIE — dwa zdania wyjaśnienia
3. OSTRZEŻENIE opcjonalne — jeśli coś ważnego nadchodzi
```

**Format wizualny:**
```
┌─────────────────────────────────────┐
│  💡 DZISIAJ AI RADZI                │
│                                     │
│  "To dobry dzień na rower."         │  ← 18pt, biały
│                                     │
│  Wiatr słaby, powietrze czyste,     │  ← 14pt, rgba biały 0.7
│  UV nie wymaga ochrony.             │
│                                     │
│  ⚠ Wieczorem ochłodzi się o 7°     │  ← ostrzeżenie, żółte
└─────────────────────────────────────┘
```

**Logika generowania (lokalna, bez zewnętrznego API):**

```
Priorytet 1 — OSTRZEŻENIA KRYTYCZNE:
  temp > 33° → "Uwaga na upał. Dużo wody, unikaj słońca 11-15."
  temp < -10° → "Mróz. Zakryj twarz i dłonie."
  burza → "Burza w prognozie. Nie planuj zajęć na zewnątrz."
  AQI zła → "Jakość powietrza zła. Ogranicz aktywność na zewnątrz."

Priorytet 2 — AKTYWNOŚCI:
  UV<3 + wiatr<15 + brak opadów + temp 15-28 → "Idealny dzień na rower/spacer."
  deszcz → "Zostań w domu lub weź parasol."
  wiatr>25 → "Silny wiatr. Ostrożnie na rowerze i motocyklu."

Priorytet 3 — CIEKAWOSTKI DNIA:
  wschód wcześniej o X min → "Słońce wstaje coraz wcześniej."
  ciśnienie wysokie → "Wysokie ciśnienie — możesz czuć więcej energii."
  dobra widoczność → "Doskonała widoczność. Piękny dzień na fotografię."

Priorytet 4 — PROGNOZA:
  zmiana temp > 8° w ciągu dnia → "Wieczorem ochłodzi się o X stopni."
  opady dopiero po południu → "Rano spokojnie, deszcz pojawi się około 15:00."
```

**Scenariusz 2 sekund:** Przeczytaj jedną linię. Wiesz co robić.

**Efekt WOW:** Aplikacja mówi "Dzisiaj warto otworzyć okna" i faktycznie: jakość powietrza dobra, ciśnienie wysokie. *"Skąd ona wiedziała?!"*

---

### S06 — TWÓJ DZIEŃ (nowy)

**Cel biznesowy:** Angażująca treść którą użytkownik sprawdza codziennie — bo każdy dzień daje inny wynik.

**Cel użytkownika:** Zobaczyć "co mi ta pogoda daje" konkretnie.

**Emocja docelowa:** Sprawczość. "Mam plan na dziś."

**Format wizualny:**
```
┌─────────────────────────────────────┐
│  TWÓJ DZIEŃ                         │
│  ★★★★☆  Bardzo dobry               │
├──────────────┬──────────────────────┤
│  ✔ spacer    │  ✔ fotografię        │
│  ✔ rower     │  ✔ mycie auta        │
│  ✔ bieganie  │  ✗ grill (wiatr)     │
│  ✔ ogród     │  ✗ plaża (chmury)    │
└──────────────┴──────────────────────┘
```

**Logika oceny ★:**
```
5★ Idealny: temp 18-26°, UV≤5, wiatr≤15, brak opadów, AQI dobra
4★ Bardzo dobry: jeden parametr poza optimum
3★ Dobry: dwa parametry poza optimum lub lekkie opady
2★ Ograniczony: opady umiarkowane lub silny wiatr lub UV wysoki
1★ Trudny: burza, upał >33°, mróz <-5°, AQI zła
```

**Logika aktywności:**
```
spacer: zawsze ✔ gdy brak burzy i temp -5° do 38°
rower: ✔ gdy wiatr<25, brak opadów, temp >5°
bieganie: ✔ gdy temp 5-30°, brak opadów, AQI dobra/umiarkowana
fotografię: ✔ gdy widoczność >10km, brak opadów
mycie auta: ✔ gdy brak opadów przez następne 4h, wiatr<20
grill: ✔ gdy wiatr<15, brak opadów, temp >15°
ogród: ✔ gdy brak opadów, wiatr<20, temp >10°
plaża: ✔ gdy temp >22°, UV>3, brak opadów, wiatr<20
```

---

### S08 — MENU V2

**Cel biznesowy:** Drzwi do wszystkich funkcji premium. Musi wyglądać jak część tego samego produktu.

**Cel użytkownika:** Szybki dostęp do funkcji których szuka.

**Emocja docelowa:** Poczucie że aplikacja ma głębię. "Jest tu więcej."

**Format V2 — kafelki 2-kolumnowe:**
```
┌──────────────────────────────────────┐
│  MENU                           ✕   │
├─────────────────┬────────────────────┤
│  📅             │  🌡                │
│  Prognoza       │  Meteogram          │
│  7 dni          │  ICM                │
├─────────────────┼────────────────────┤
│  🏃             │  ⭐                 │
│  Sport          │  Ulubione           │
│  Rower          │  miasta             │
├─────────────────┼────────────────────┤
│  📊             │  🔔                 │
│  Historia       │  Powiadom.          │
│  pogody         │                     │
└─────────────────┴────────────────────┘
│  ULUBIONE MIASTA                     │
│  [Warszawa] [Kraków] [Gdańsk]        │
└──────────────────────────────────────┘
```

---

### ST1 — LOADING (Stan ładowania)

**Zasada:** Loading musi być piękny. Użytkownik patrzy na niego 2-3 sekundy — to pierwsze wrażenie produktu.

**V1 problem:** Spinner ActivityIndicator — generyczny, nie buduje emocji.

**V2 propozycja:**
```
• Gradient hero animowany (shimmer/pulse)
• Temperatura: "--°" zamiast pustego miejsca
• Animowany placeholder dla sekcji (skeleton)
• Jeden komunikat: "Sprawdzam pogodę..." (nie "Loading...")
• Czas ładowania: pokazuj natychmiastowo dane z cache, aktualizuj w tle
```

---

### ST2 — ERROR (Stan błędu)

**V1 problem:** Standardowy alert. Niszczy immersję.

**V2 propozycja:**
```
• Pełnoekranowy ekran błędu w stylu Hero (ciemny gradient)
• Ikona weather (np. ☁️ z iksem) w stylu produktu
• Komunikat ludzki: "Coś poszło nie tak z pogodą..."
• Przycisk "Spróbuj ponownie" — premium styling
• Ostatnie dane z cache jeśli dostępne: "Pokazuję ostatnią prognozę"
```

---

### ST3 — OFFLINE

**V2 propozycja:**
```
• Delikatny baner u góry (nie pełnoekranowy): "Tryb offline · ostatnia aktualizacja: 14:22"
• Dane z cache nadal widoczne
• Baner znika automatycznie po powrocie do sieci
```

---

## CZĘŚĆ 3 — EXPERIENCE FLOW

### Ścieżka główna (pierwsze uruchomienie)

```
URUCHOMIENIE
    │
    ▼
SPLASH / LOADING (1-2s)
    │ gradient hero animowany, "--°"
    ▼
HOME — HERO (natychmiastowo)
    │ temperatura + gradient
    ▼
HOME — CONTENT REVEAL (300ms stagger)
    │ sekcje wchodzą od dołu jedna po drugiej
    ▼
UŻYTKOWNIK SCROLLUJE
    ├─ (zatrzymuje się na AI Advice) → czyta → scrolluje dalej
    ├─ (zatrzymuje się na Twój dzień) → sprawdza aktywności
    ├─ (klika kafelek Przegląd) → bottom sheet z wyjaśnieniem
    ├─ (klika dzień prognozy) → modal szczegółów dnia
    └─ (scrolluje do końca Szczegółów) → zamyka lub wraca na górę
```

### Ścieżka powracającego użytkownika (codziennie rano)

```
URUCHOMIENIE
    │
    ▼
HOME — cache data natychmiast
    │ (dane z poprzedniej sesji)
    ▼
REFRESH w tle (niewidoczny)
    │
    ▼
HERO UPDATE — płynne przejście gdy nowe dane
    │ 400ms fade-in nowych wartości
    ▼
UŻYTKOWNIK SKANUJE (5-10 sekund)
    ├─ temperatura ✓
    ├─ AI Advice ✓ ("dzisiaj rower")
    └─ zamyka → idzie do pracy
```

### Ścieżka odkrywcy (weekend, więcej czasu)

```
HOME → scrolluje wszystko
    │
    ├─ AI Advice → bottom sheet (szczegółowy komentarz)
    ├─ Twój dzień → klika aktywność → wyjaśnienie dlaczego ✔/✗
    ├─ Wykres godzinowy → analiza wieczoru
    ├─ Kafelek "Ciśnienie" → bottom sheet z opisem zdrowotnym
    ├─ Menu → Meteogram ICM → analizuje przez 5 minut
    └─ Porównaj miasta → sprawdza czy u rodziny tak samo
```

---

## CZĘŚĆ 4 — PREMIUM MOTION SYSTEM

### Filozofia animacji

```
Dobra animacja jest niewidoczna.
Zła animacja jest wyczuwalna.
Idealna animacja jest odczuwalna.
```

Użytkownik nie myśli "ładna animacja". Myśli "ta aplikacja jest płynna".

### Katalog animacji — pełny

#### A01 — Content Reveal (przy ładowaniu)
```
Typ: fade + translateY
Wartości: opacity 0→1, y 16→0
Czas: 400ms per sekcja
Stagger: 60ms między sekcjami
Easing: ease-out cubic
Trigger: po odebraniu danych
Cel: Treść wchodzi organicznie, nie wyskakuje
```

#### A02 — Hero Gradient Pulse (ciągły)
```
Typ: animacja pozycji gradientu (backgroundPosition)
Czas: 12 sekund pełny cykl
Easing: ease-in-out sine
Amplituda: bardzo mała (3-5% przesunięcie)
Cel: Hero żyje, oddycha — nie jest statycznym obrazem
Implementacja: Animated.loop z interpolacją
```

#### A03 — Hero Gradient Transition (zmiana warunków)
```
Typ: cross-fade między gradientami
Czas: 800ms
Easing: ease-in-out
Trigger: nowe dane z API (inny stan pogody)
Cel: Aplikacja reaguje na zmianę pogody
```

#### A04 — Tile Press (kafelek dotyknięty)
```
Typ: scale + opacity
Wartości: scale 1→0.96, opacity 1→0.85
Czas: 80ms press, 120ms release
Easing: ease-out
Cel: Feedback dotknięcia — kafelek "wciska się"
```

#### A05 — Bottom Sheet Reveal
```
Typ: translateY (natywny slide)
Czas: 350ms
Easing: spring (stiffness 180, damping 22)
Backdrop: opacity 0→0.55, 300ms
Cel: Eleganckie wyjście treści
```

#### A06 — Bottom Sheet Dismiss
```
Typ: translateY (slide down)
Czas: 280ms
Easing: ease-in
Trigger: kliknięcie backdrop lub Zamknij
```

#### A07 — Scroll Section Reveal
```
Typ: fade + translateY (każda sekcja osobno)
Wartości: opacity 0→1, y 24→0
Czas: 350ms
Trigger: sekcja wchodzi do viewport
Stagger: pierwsze wejście — jednorazowe
Cel: Scrollowanie nagradza — treść wchodzi pięknie
```

#### A08 — Temperature Count-Up (pierwsze ładowanie)
```
Typ: animacja liczby od 0 do wartości
Czas: 600ms
Easing: ease-out quint
Trigger: pierwsze załadowanie (nie refresh)
Cel: Temperatura "przylatuje" — nie pojawia się znienacka
```

#### A09 — Star Rating Reveal (Twój dzień)
```
Typ: gwiazdki zapalają się sekwencyjnie
Czas: 60ms per gwiazdka
Stagger: 80ms
Easing: spring
Cel: Ocena dnia jest rewelacją, nie wynikiem
```

#### A10 — Haptic Feedback
```
Trigger: każde kliknięcie kafelka
Typ: Vibration.vibrate(8) — już zaimplementowany
Uzupełnienie: różna intensywność dla różnych akcji:
  - kafelek info: 6ms (lekki)
  - kafelek nawigacyjny: 10ms (standardowy)
  - akcja destruktywna: 20ms (wyraźny)
```

### Motion Hierarchy

```
POZIOM 1 — Transition (zmiana ekranu/stanu):
  Najdłuższy: 400-600ms, spring lub ease

POZIOM 2 — Reveal (pojawienie się treści):
  Średni: 300-400ms, ease-out

POZIOM 3 — Feedback (reakcja na dotyk):
  Najkrótszy: 60-120ms, ease-out

ZASADA: Animacje wyżej w hierarchii nigdy nie blokują niżej.
  Feedback (80ms) nie czeka na Reveal (350ms).
```

---

## CZĘŚĆ 5 — VISUAL LANGUAGE (własna tożsamość)

### Różnica: inspiracja vs kopiowanie

Nie kopiujemy Apple, Google, CARROT.  
Uczymy się od nich **mechanizmów**, nie **rozwiązań**.

| Mechanizm (uczymy się) | Implementacja WeatherApp (własna) |
|------------------------|----------------------------------|
| Apple: jeden bohater na ekranie | Temperatura 96pt, reszta milczy |
| CARROT: tło reaguje na pogodę | Hero gradient 8 stanów |
| B&O: przyjemność przed funkcją | Animacja A02 — Hero żyje |
| Leica: usuwanie zamiast dodawania | Ulubione + Quick Actions z main scroll → menu |
| Duolingo: codzienne odkrycie | Twój dzień — inna ocena każdego dnia |

### Unikalny charakter WeatherApp

**Głębokość pod spokojną powierzchnią.**  
Aplikacja wygląda prosto. Jest niesamowicie głęboka.  
Użytkownik odkrywa to stopniowo — i wraca by odkryć więcej.

**Język ludzki, nie meteorologiczny.**  
Jedyna aplikacja która mówi: *"To dobry dzień na rower"* zamiast *"wiatr 12 km/h, UV 3, zachmurzenie 15%"*.

**Żyje z dniem użytkownika.**  
Każda sesja jest lekko inna — inny gradient, inny AI Advice, inna ocena dnia.  
Aplikacja nie jest statycznym narzędziem — jest towarzyszem dnia.

---

## CZĘŚĆ 6 — DESIGN TOKENS V2

Kompletny system tokenów — każdy element UI pochodzi stąd.

### Kolory bazowe

```
// Tło aplikacji
--color-bg-primary: #0f1c2a          // najgłębszy granat
--color-bg-section: #2e3f52          // kontenery sekcji
--color-bg-tile-glass: rgba(255,255,255,0.09)  // srebrne kafelki
--color-bg-tile-glass-active: rgba(255,255,255,0.13)  // dziś/jutro

// Kafelki kolorowe (Przegląd)
--color-tile-komfort: #b5862a        // złoto
--color-tile-jutro: #1e3a8a          // granat
--color-tile-wiatr: #0c4a6e          // stalowy błękit
--color-tile-wilgotnosc: #065f46     // morski
--color-tile-opady: #3730a3          // indygo
--color-tile-aqi-good: #14532d       // ciemnozielony
--color-tile-aqi-moderate: #7c2d12   // ciemnopomarańczowy
--color-tile-aqi-bad: #7f1d1d        // ciemnoczerwony

// Tekst
--color-text-primary: #ffffff
--color-text-secondary: rgba(255,255,255,0.75)
--color-text-tertiary: rgba(255,255,255,0.55)
--color-text-label: rgba(255,255,255,0.50)   // uppercase etykiety
--color-text-disabled: rgba(255,255,255,0.30)

// Akcenty
--color-accent-blue: #1e90ff         // główny akcent
--color-accent-blue-light: #60b4ff   // hover/active
--color-accent-gold: #d4b96a         // daty, premium elementy
--color-accent-warning: #fbbf24      // ostrzeżenia UV, wiatr
--color-accent-danger: #ef4444       // krytyczne ostrzeżenia

// Borderek
--color-border-glass: rgba(255,255,255,0.15)
--color-border-glass-active: rgba(255,255,255,0.25)

// AQI dynamiczne
--color-aqi-good: #4caf50
--color-aqi-moderate: #ff9800
--color-aqi-bad: #f44336
--color-aqi-very-bad: #9c27b0
```

### Gradienty Hero

```
// Każdy gradient to tablica [top, middle, bottom]

dawn:      ['#c9813a', '#b5470f', '#1a1a3a']   // świt
morning:   ['#1e6fb3', '#1a3a6e', '#0d1f3c']   // poranek
day:       ['#1e5799', '#207cca', '#2989d8']    // dzień słoneczny
afternoon: ['#d4720a', '#c9502a', '#1a2a5e']   // popołudnie
sunset:    ['#c94b0a', '#8b1a6b', '#1a0a3a']   // zachód
night:     ['#0d1f3c', '#0a1628', '#060e1e']   // noc

// Pogodowe (priorytet nad porą dnia)
storm:     ['#1a1a2e', '#2d1b4e', '#0d0d1a']   // burza
fog:       ['#4a5568', '#6b7280', '#374151']    // mgła
snow:      ['#e0eaff', '#b8cffe', '#1e3a8a']   // śnieg
heat:      ['#c0392b', '#e74c3c', '#8b1a0a']   // upał >33°
rain:      ['#1e3a5e', '#253d5e', '#1a2a3e']   // deszcz
cloudy:    ['#2d3748', '#374151', '#1f2937']   // pochmurno
```

### Typografia

```
// Hero
--font-hero-size: 96
--font-hero-weight: 700
--font-hero-spacing: -2

// Sekcja heading
--font-section-size: 16
--font-section-weight: 800
--font-section-spacing: 0.2

// Wartość kafelka (duży)
--font-tile-value-lg: 32
--font-tile-value-lg-weight: 800
--font-tile-value-lg-spacing: -1

// Wartość kafelka (średni)
--font-tile-value-md: 22
--font-tile-value-md-weight: 800

// Etykieta kafelka
--font-tile-label: 9
--font-tile-label-weight: 800
--font-tile-label-spacing: 1.2
--font-tile-label-transform: uppercase

// Kontekst / podpis
--font-context: 11
--font-context-weight: 500-600

// Ciało tekstu (bottom sheets)
--font-body: 15
--font-body-weight: 400
--font-body-line-height: 23
```

### Spacing

```
--space-1: 4     // micro
--space-2: 8     // base unit
--space-3: 12    // między sekcjami
--space-4: 16    // padding sekcji
--space-5: 20    // duże odstępy
--space-6: 24    // bottom sheet padding
--space-8: 32    // marginBottom ostatniej sekcji
--space-10: 40   // bottom sheet paddingBottom

--gap-tile: 10   // gap między kafelkami
--gap-section: 12  // marginBottom sekcji
```

### Border Radius

```
--radius-tile-large: 18   // kafelki kolorowe
--radius-tile-medium: 16  // srebrne kafelki
--radius-section: 20      // kontenery sekcji
--radius-bottom-sheet-top: 24  // bottom sheet (top corners)
--radius-button: 14       // przyciski
--radius-badge: 10        // małe elementy
--radius-circle: 999      // capsule / okrągłe
```

### Elevation / Shadow

```
--shadow-tile-colored:
  elevation: 6
  shadowColor: #000
  shadowOpacity: 0.30
  shadowRadius: 8
  shadowOffset: { width: 0, height: 3 }

--shadow-section:
  elevation: 5
  shadowColor: #0d1f33
  shadowOpacity: 0.25
  shadowRadius: 10
  shadowOffset: { width: 0, height: 4 }

--shadow-tile-silver:
  (brak elevation — ciemne tło, cień niewidoczny)
  borderWidth: 1
  borderColor: rgba(255,255,255,0.15)
```

---

## CZĘŚĆ 7 — IKONOGRAFIA

### Stan obecny (V1) — Emoji

Używamy emoji. Działają. Ale nie tworzą spójnej tożsamości.  
Emoji różnią się między urządzeniami. Nie możemy kontrolować ich wyglądu.

### Cel (V2) — własne ikony SVG

**Styl:** Stroke (outline), rounded, 1.5-2pt linia, duże zaokrąglenia narożników  
**Format:** React Native SVG komponenty  
**Adaptowalność:** kolor przez prop `color` (biały, tematyczny, itp.)

### Priorytety implementacji

**Faza 1 (V2 Beta) — 6 ikon warunków pogodowych:**
```
<WeatherIcon.Sun />          // słonecznie
<WeatherIcon.Cloud />        // pochmurno
<WeatherIcon.Rain />         // deszcz
<WeatherIcon.Storm />        // burza
<WeatherIcon.Snow />         // śnieg
<WeatherIcon.Fog />          // mgła/zamglenie
```

**Faza 2 (V2 RC) — ikony parametrów:**
```
<Icon.Thermometer />    // temperatura / ciśnienie
<Icon.Eye />            // widoczność
<Icon.UV />             // indeks UV
<Icon.Clock />          // czas / długość dnia
<Icon.Wind />           // wiatr
<Icon.Drop />           // wilgotność
<Icon.Leaf />           // pyłki / powietrze
```

**Faza 3 (V2 Stable) — ikony nawigacji i UI:**
```
<Icon.Menu />
<Icon.Star />           // ulubione
<Icon.Back />
<Icon.Share />
<Icon.Notification />
```

---

## CZĘŚĆ 8 — AI EXPERIENCE DESIGN

### Zasada AI w WeatherApp

AI nie jest chatbotem. Nie generuje losowych odpowiedzi.  
AI jest **tłumaczem danych** — przekształca surowe liczby w ludzki komentarz.

### Architektura logiki

```
INPUT: obiekt weather (temp, humidity, windSpeed, uvIndex, aqi, 
       pressure, visibility, forecast, hourly, sunrise, sunset)

PROCESSING: drzewo decyzyjne (lokalne, offline)
  → evaluateWarnings(weather)     // PRIORYTET 1
  → evaluateBestActivity(weather) // PRIORYTET 2
  → evaluateDayFact(weather)      // PRIORYTET 3
  → evaluateChange(hourly)        // PRIORYTET 4

OUTPUT: { main: string, detail: string, warning?: string }
```

### Bank fraz AI (przykłady)

```typescript
// Ostrzeżenia krytyczne
"Burza w prognozie. Nie planuj długich wyjść na zewnątrz."
"Upał powyżej 33°. Dużo wody, unikaj słońca między 11 a 15."
"Jakość powietrza zła. Astmatycy i dzieci — zostańcie w domu."
"Mocny mróz. Zakryj twarz i dłonie. Nie zostawiaj zwierząt na dworze."

// Aktywności
"Idealny dzień na rower. Wiatr słaby, UV nie wymaga ochrony, 0% szans na deszcz."
"Świetne warunki do biegania — temperatura idealna, powietrze czyste."
"Dziś warto umyć auto. Brak opadów przez najbliższe 8 godzin."
"Doskonałe warunki do fotografii. Widoczność ponad 25 km, świetne światło."
"Warto przewietrzyć mieszkanie. Powietrze zewnętrzne lepsze niż zwykle."

// Zmiany w ciągu dnia
"Rano spokojnie, ale od godziny 15 spodziewaj się opadów."
"Wieczorem temperatura spadnie o 9 stopni. Weź coś ciepłego."
"Chmury znikną po południu — najpiękniejszy moment dnia to wieczór."

// Ciekawostki
"Dziś wyjątkowo długi dzień — prawie 16 godzin słońca."
"Niskie ciśnienie — niektórzy mogą czuć zmęczenie lub bóle głowy."
"Suche powietrze. Pamiętaj o nawilżeniu i dużej ilości wody."
```

---

## CZĘŚĆ 9 — PSYCHOLOGIA PRODUKTU

### Mechanizmy retencji (etyczne)

**Mechanizm 1: Zmienny reward (Duolingo / slot machine)**  
Twój dzień daje inną ocenę każdego dnia. Użytkownik nie wie co dostanie.  
Ciekawość → otwarcie aplikacji → nagroda (★★★★★ lub informacja).

**Mechanizm 2: Zmysłowy comfort (Spotify / B&O)**  
Sam akt otwierania jest przyjemny dzięki Hero z żywym gradientem.  
Użytkownik wraca nie po informację — po uczucie.

**Mechanizm 3: Progressivne odkrycie (Apple Health / Arc)**  
Aplikacja nigdy nie pokazuje wszystkiego naraz.  
Każdy scroll ujawnia nową warstwę. Każde dotknięcie nagradzane bottom sheetem.

**Mechanizm 4: Social proof through sharing (Instagram)**  
Hero wygląda inaczej przy każdej pogodzie → screenshot-worthy.  
Użytkownik pokazuje znajomym. Aplikacja się rozchodzi organicznie.

**Mechanizm 5: Relevance (Gmail / Apple Reminders)**  
AI Advice jest zawsze o TYM dniu, o TYM mieście, o TEJ pogodzie.  
Nigdy generyczny. Zawsze na temat.

---

## CZĘŚĆ 10 — STANDARD GOOGLE PLAY AWARD

### Kryterium oceny

Każdy element projektowy odpowiada na pytanie:  
*"Czy jury Google Play Design Award zatrzymałoby się na tym ekranie?"*

### Checklist przed każdym etapem

```
□ Hierarchia wizualna: jeden element dominuje, reszta uzupełnia
□ Typografia: każdy rozmiar ma sens w hierarchii
□ Kolor: każdy kolor ma uzasadnienie w Design Tokens
□ Animacje: płynne, celowe, niewidoczne gdy działają
□ Tekst: ludzki język, nie dane
□ Spójność: każda sekcja wygląda jak z tego samego produktu
□ Wydajność: płynne na Motorola Edge 50 Fusion (mid-range)
□ Screenshot test: czy to wygląda premium na screenshocie?
□ One-hand test: czy kluczowe akcje są w zasięgu kciuka?
□ 2-second test: czy główna informacja jest czytelna w 2 sekundy?
```

---

## CZĘŚĆ 11 — ROADMAPA IMPLEMENTACJI V2

### V2 Alpha — "Żyje i mówi"

**Cel:** Pierwsze WOW. Aplikacja żyje i rozumie użytkownika.

**Zakres (zatwierdzony):**
- [ ] Żywy gradient Hero — 8 stanów (pora dnia × warunki)
- [ ] Animacja Hero pulse (A02)
- [ ] Sekcja AI Advice — "Dzisiaj AI radzi"
- [ ] Sekcja Twój dzień — ocena ★ + lista aktywności

**Kryterium Definition of Done:**
- Gradient zmienia się przy różnych warunkach pogodowych
- AI Advice wyświetla sensowny komentarz dla aktualnej pogody
- Twój dzień pokazuje realistyczną ocenę ★
- Build działa na Motorola Edge 50 Fusion
- Audyt: zgodność z Design System V2 ≥ 90%
- Akceptacja Master Admin

**Szacowany czas:** 3-5 sesji

---

### V2 Beta — "Spójna i głęboka"

**Cel:** Każda sekcja wygląda jak z jednego produktu. Głębia jest widoczna.

**Zakres (do zatwierdzenia po Alpha):**
- [ ] Menu V2 — 2-kolumnowe kafelki z ikonami
- [ ] Ikony SVG — 6 warunków pogodowych
- [ ] Animacje scroll reveal (A07)
- [ ] Bottom sheet spring animation (A05/A06)
- [ ] Content reveal stagger (A01)

**Szacowany czas:** 4-6 sesji

---

### V2 RC — "Dopracowana i szybka"

**Cel:** Gotowość na "pokaż znajomym". Wydajność. Brak białych ekranów.

**Zakres (do zatwierdzenia po Beta):**
- [ ] Pełna rodzina ikon SVG
- [ ] Loading state V2 (skeleton + gradient pulse)
- [ ] Error state V2 (premium design)
- [ ] Offline banner V2
- [ ] React.memo + useMemo — optymalizacja re-renderów
- [ ] Podział App.tsx na komponenty (refaktor)

**Szacowany czas:** 5-8 sesji

---

### V2 Stable — "Gotowy na świat"

**Cel:** App Store / Google Play ready. Produkt, nie prototype.

**Zakres (do zatwierdzenia po RC):**
- [ ] Onboarding (pierwsze uruchomienie)
- [ ] Powiadomienia pogodowe
- [ ] Widżet systemowy (Android)
- [ ] Accessibility (czcionki systemowe, kontrast)
- [ ] Testy na różnych urządzeniach

**Szacowany czas:** 6-10 sesji

---

## CZĘŚĆ 12 — ZASADY PRACY V2

### Golden Rules

```
1. Experience First — najpierw projekt, potem kod
2. Design System jest SSOT — każda zmiana UI z nim zgodna
3. Nowe pomysły → IDEAS_BACKLOG.md (nie do kodu)
4. Definition of Done: działa + zgodne z DS + audyt + akceptacja MA
5. Git backup przed każdą dużą zmianą
6. Jeden moduł na raz — nie implementujemy równolegle dwóch
7. Każdy moduł kończy się raportem audytowym
```

### Format raportu po module

```markdown
## Raport audytowy — [Nazwa modułu]

**Data:** YYYY-MM-DD
**Co zostało wykonane:** ...
**Zgodność z Design System V2:** [%]
  - ✅ [punkt DS który jest spełniony]
  - ⚠️ [punkt DS który wymaga dopracowania]
**Co zostało odłożone:** (→ IDEAS_BACKLOG.md)
**Ryzyka pozostałe:** ...
**Ocena jakości:** X/10
**Propozycje ulepszeń:** ...
**Akceptacja Master Admin:** [ ] oczekuje
```

---

## STATUS DOKUMENTU

```
✅ Manifest produktu
✅ Mapa produktu (13 ekranów + 5 stanów)
✅ Specyfikacja kluczowych ekranów (S01, S05, S06, S08, ST1-ST3)
✅ Experience Flow (3 ścieżki użytkownika)
✅ Motion System (10 animacji, motion hierarchy)
✅ Visual Language (własna tożsamość, nie kopiowanie)
✅ Design Tokens (kolory, gradienty, typografia, spacing, radius, shadow)
✅ Ikonografia (3 fazy, styl docelowy)
✅ AI Experience (architektura logiki, bank fraz)
✅ Psychologia produktu (5 mechanizmów retencji)
✅ Standard Google Play Award (checklist)
✅ Roadmapa V2 Alpha → Beta → RC → Stable
✅ Zasady pracy i format audytu
```

---

**Dokument gotowy do formalnej akceptacji Master Admin.**

Po akceptacji: implementacja V2 Alpha.  
Bez akceptacji: nie piszemy kodu.

---

*Ścieżka: `C:\AI_PROJECTS\WeatherApp\docs\EXPERIENCE_BLUEPRINT_V2.md`*  
*Link: [EXPERIENCE_BLUEPRINT_V2.md](WeatherApp/docs/EXPERIENCE_BLUEPRINT_V2.md)*  
*Design System: [DESIGN_SYSTEM_V2.md](WeatherApp/docs/DESIGN_SYSTEM_V2.md)*  
*Restore point: `git tag v1-stable-pre-v2`*
