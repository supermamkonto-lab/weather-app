# WeatherApp V2 — Phase 0.5
## Visual Concept Review · Enterprise Gold

**Data:** 2026-07-04  
**Status:** Oczekuje na akceptację Master Admin  
**Poprzedni etap:** Phase 0 — Design System V2 ✅  
**Ten etap:** Pełna specyfikacja UX przed implementacją  
**Zasada:** Nie piszemy kodu dopóki UX, UI, Premium Feeling, WOW < 9.5

---

## WSTĘP: KRYTYCZNE ZAŁOŻENIA PRZED PROJEKTOWANIEM

Zanim opiszę każdy ekran, muszę postawić trzy fundamenty które definiują **każdą** decyzję projektową.

**Fundament 1: Aplikacja ma jeden ekran.** Nie mamy wielu ekranów przełączanych nawigacją. Mamy jeden kontinuum scrollu — to jest nasz canvas. Modalne bottom sheety i overlaye uzupełniają, ale nie zastępują głównego przepływu. To jak czytanie dobrej książki: nie skaczemy między rozdziałami — płyniemy przez nią.

**Fundament 2: Każda sekcja jest nagrodą za ciekawość.** Użytkownik który scrolluje niżej dostaje coś lepszego niż to co widział wyżej. Nie więcej — *głębiej*. Jak zejście do piwniczki z winem: schodzisz niżej, odkrywasz więcej.

**Fundament 3: Aplikacja żyje.** Nie jest statyczną stroną z danymi. Jest żywym organizmem który reaguje na porę dnia, warunki pogodowe, lokalizację. Dwa otwarcia tej samej aplikacji tego samego dnia o różnych godzinach mają wyglądać i czuć się inaczej.

---

## CZĘŚĆ A — SPECYFIKACJA EKRANÓW GŁÓWNYCH

---

### EKRAN S01 — HOME (Główny widok)

**Definicja:** Nie jest to "ekran". Jest to cała aplikacja. Jeden scroll od góry do dołu.

#### 1. Cel biznesowy
Jedyna powierzchnia na której użytkownik spędza 95% czasu. Musi być:
- Wystarczająco prosta, żeby Piotr (sprawdzacz poranny) dostał wszystko w 5 sekund
- Wystarczająco głęboka, żeby Tomasz (ekspert) scrollował 3 minuty i nie widział dna
- Wystarczająco piękna, żeby Zofia (estetka) robiła screenshoty i je pokazywała

#### 2. Cel użytkownika
*"Chcę wiedzieć jaki będzie mój dzień. Natychmiast."*

#### 3. Emocja
**Spokój + zaskakująca głębia.**  
Pierwsze wrażenie: *"Czyste. Spokojne. Wiem o co chodzi."*  
Po scrollu: *"Ale tu jest więcej niż myślałem."*  
Po pełnym scrollu: *"Muszę wrócić tu jutro."*

#### 4. Hierarchia wizualna w czasie

```
1 SEKUNDA:
  Temperatura 96pt. Gradient hero. Nic więcej nie jest ważne.
  Użytkownik wie: gorąco/zimno/słońce/deszcz — bez czytania słowa.

3 SEKUNDY:
  Opis warunków ("Słonecznie"), ikona pogody, miasto.
  Pierwsze przesunięcie kciukiem — instynktowne.

10 SEKUND:
  AI Advice — jedna linia. "To dobry dzień na rower."
  Przegląd — 6 kolorowych kafelków. Komfort / Jutro.
  Wzrok skanuje kolory, nie czyta każdą wartość.

30 SEKUND:
  Krzywa godzinowa — jak zmieni się temperatura.
  Twój dzień — ocena ★. "Co mogę dziś zrobić?"
  Najbliższe dni — srebrne kafelki.

60 SEKUND:
  Szczegóły — 10 srebrnych kafelków. UV, ciśnienie, pyłki.
  Kliknięcie "Ciśnienie" → bottom sheet z interpretacją zdrowotną.
  Aplikacja odpowiada na pytania których użytkownik jeszcze nie zadał.
```

#### 5. Layout

```
┌─────────────────────────────────┐  ← pełna szerokość ekranu
│                                 │
│  🔍 Warszawa              ☰    │  ← search bar + menu (nie dominuje)
│                                 │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░  HERO GRADIENT           ░│
│  ░░░  (zmienia się z porą dnia)░│
│  ░░░                          ░│
│  ░░░         23°             ░░│  ← 96pt, centrum
│  ░░░      Słonecznie         ░░│  ← 18pt
│  ░░░   Odczuwalna 21°        ░░│  ← 14pt, rgba biały 0.6
│  ░░░                          ░│
│  ░░░  [💨 Powietrze: Dobra]  ░░│  ← badge
│  ░░░                          ░│
│                                 │
│  ┌─────────────────────────┐   │
│  │  💡 DZISIAJ AI RADZI    │   │  ← AI Advice section
│  │  "To dobry dzień        │   │
│  │  na rower."             │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌───────────┐ ┌───────────┐   │
│  │⭐ KOMFORT │ │📅 JUTRO   │   │  ← kolorowe kafelki Przegląd
│  │  87/100   │ │  19°      │   │
│  └───────────┘ └───────────┘   │
│  ┌───────────┐ ┌───────────┐   │
│  │💨 WIATR  │ │💧 WILGOTN.│   │
│  │  12 km/h  │ │  62%      │   │
│  └───────────┘ └───────────┘   │
│  ┌───────────┐ ┌───────────┐   │
│  │🌤 OPADY  │ │🌫 POWIETRZE│  │
│  │bez opadów │ │  Dobra    │   │
│  └───────────┘ └───────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  TWÓJ DZIEŃ  ★★★★☆     │   │  ← Twój dzień
│  │  ✔ spacer  ✔ fotografię │   │
│  │  ✔ rower   ✗ grill      │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  Dziś godzinowo         │   │  ← sekcja na ciemnym tle
│  │  [krzywa SVG]           │   │
│  │  [kafelki komfortu]     │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  Najbliższe dni         │   │  ← 8 srebrnych kafelków 2-col
│  │  [Pn] [Wt] [Śr] [Cz]  │   │
│  │  [Pt] [So] [Nd] [   ]  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  piątek, 5 lipca        │   │  ← Szczegóły
│  │  [🌡][👁][☀️][⏳]      │   │  ← 10 srebrnych kafelków
│  │  [🌅][🌇][🔬][🌫][🌿] │   │
│  │  [🌬 Powietrze]         │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘  ← paddingBottom 32
```

#### 6. Typografia

```
Miasto: 16pt, weight 600, rgba biały 0.8
Temperatura: 96pt, weight 700, #ffffff, letterSpacing -2
Opis: 18pt, weight 500, rgba biały 0.9
Odczuwalna: 14pt, weight 400, rgba biały 0.6
Badge: 12pt, weight 700, #ffffff
```

#### 7. Kolory

Hero gradient — dynamiczny (8 stanów zdefiniowanych w Design System V2).  
Na hero: tylko biel i jej przezroczystości — nic innego nie rywalizuje z temperaturą.

#### 8. Mikrointerakcje

```
Pull-to-refresh: gradient hero "błyska" jasność (opacity 0.85→1.0, 300ms)
Kliknięcie kafelka: scale 0.96, 80ms, spring back
Scroll > 50px: header lekko przeźroczystały (backdrop-blur efekt)
```

#### 9. Animacje

```
Pierwsze ładowanie: temperatura animuje od 0 do wartości (600ms, ease-out quint)
Sekcje: fade + translateY 16px→0, stagger 60ms
Hero pulse: delikatne przesunięcie gradientu co 12s
```

#### 10. Accessibility

```
Temperatura: aria-label "Temperatura 23 stopnie Celsjusza"
Kontrast: biały na hero gradient ≥ 4.5:1 (WCAG AA)
Touch targets: wszystkie kafelki min 44×44pt
Font scaling: temperatura nie skaluje się z systemem (zbyt duża)
Pozostałe teksty: respektują system font size
```

#### PSYCHOLOGY HOME

```
DLACZEGO zatrzymuje wzrok:
  → Temperatura 96pt jest jedyną rzeczą takiej wielkości na ekranie.
     Prawo Gestalt: kontrast rozmiaru = natychmiastowa uwaga.
  → Gradient hero komunikuje porę dnia zanim mózg przetworzy słowa.

DLACZEGO scrolluje dalej:
  → AI Advice zawiera jedną niedomkniętą myśl: "To dobry dzień na..."
     Efekt Zeigarnika: mózg szuka domknięcia. Scrolluje by doczytać.
  → Kolorowe kafelki mają luki informacyjne (kontekst poniżej wartości).

DLACZEGO wraca jutro:
  → Gradient wygląda inaczej. AI mówi coś innego. Ocena ★ może być 5/5.
     Codzienne discovery = powód powrotu.

DLACZEGO pokazuje znajomym:
  → Hero przy burzy wygląda dramatycznie (ciemny grafit z fioletami).
     Screenshot-worthy. Żadna inna aplikacja nie wygląda tak przy burzy.
```

#### PREMIUM REVIEW HOME

| Kryterium | Ocena | Uzasadnienie |
|-----------|-------|--------------|
| Elegancja | 9/10 | Temperatura dominuje bez walki z innymi elementami |
| Czytelność | 9/10 | Hierarchia jasna — ale AI Advice musi być wyraźnie widoczne |
| Emocja | 9.5/10 | Gradient + temperatura = silne emocjonalne pierwsze wrażenie |
| Premium Feeling | 8.5/10 | Ciemne sekcje + kolorowe kafelki działają, ale trzeba finezji w traktowaniu odstępów |
| Minimalizm | 8/10 | Wciąż dużo elementów — ale każdy ma uzasadnienie |
| Efekt WOW | 9/10 | Żywy gradient + kolorowe kafelki = wow |
| Praktyczność | 9.5/10 | Wszystkie potrzebne dane w jednym scrollu |

#### SELF-REVIEW HOME

```
✅ Świetnie działa:
   Temperatura jako absolutny bohater
   Dynamiczny gradient hero
   AI Advice — wyróżnia nas od konkurencji

⚠️ Przeciętne / do poprawy:
   Przejście między Hero a sekcjami: zbyt abruptowe. Potrzebny delikatny blur
   lub fade na dole hero który łagodnie przechodzi w zawartość.
   
   Kafelek OPADY: wartość "bez opadów" jest słaba. Lepiej: emoji sytuacyjny
   (☀️ jeśli brak opadów, 🌧 jeśli deszcz) + tekst.

❌ Zbyt zwyczajne:
   Search bar u góry wygląda standardowo. W V2 Beta rozważyć bardziej
   eleganckie podejście — może niewidoczny na start, pojawia się po tap.

🗑 Można wyrzucić:
   "Odczuwalna X°" pod temperaturą — mało wartości, zajmuje przestrzeń premium.
   Przenieść to do sekcji szczegółów lub AI Advice.

🔧 Do ulepszenia:
   Dodać delikatną linię (separator) lub zmianę tła między Hero a pierwszą sekcją.
   Hero powinien "kończyć się" gracefully, a zawartość "zaczynać" płynnie.
```

---

### SEKCJA S02 — HERO (komponent, nie oddzielny ekran)

*Hero jest częścią S01 — opisany szczegółowo powyżej. Poniżej uzupełnienie.*

#### Stany Hero

```
ŚWIT (05:00–07:00)
  Gradient: ['#c9813a', '#b5470f', '#1a1a3a']
  Dominanta: złoto/pomarańcz — ciepło, nadzieja, początek
  Ikona: 🌅
  Temperatura: zazwyczaj najniższa dnia

PORANEK (07:00–11:00) + słonecznie
  Gradient: ['#1e6fb3', '#1a3a6e', '#0d1f3c']
  Dominanta: błękit — spokój, energia, klarowność

DZIEŃ (11:00–16:00) + słonecznie
  Gradient: ['#1e5799', '#207cca', '#2989d8']
  Dominanta: głęboki błękit — pewność, stabilność

POPOŁUDNIE (16:00–19:00)
  Gradient: ['#d4720a', '#c9502a', '#1a2a5e']
  Dominanta: złoto/pomarańcz — ciepło późnego słońca

ZACHÓD (19:00–21:00)
  Gradient: ['#c94b0a', '#8b1a6b', '#1a0a3a']
  Dominanta: magenta/fiolet — dramatyzm, piękno, przemijanie

NOC (21:00–05:00)
  Gradient: ['#0d1f3c', '#0a1628', '#060e1e']
  Dominanta: głęboki granat — cisza, spokój, nocna atmosfera

BURZA (priorytet nad porą dnia)
  Gradient: ['#1a1a2e', '#2d1b4e', '#0d0d1a']
  Dominanta: grafit/głęboki fiolet — dramatyzm, niepokój, ale kontrolowany

MGŁA
  Gradient: ['#4a5568', '#6b7280', '#374151']
  Dominanta: mleczny szary — spokój, zawieszenie, mistyczność

ŚNIEG
  Gradient: ['#c8d6ff', '#a8bcf0', '#1e3a8a']
  Dominanta: chłodna biel/błękit — czystość, świeżość, spokój

UPAŁ (>33°C)
  Gradient: ['#c0392b', '#e74c3c', '#8b1a0a']
  Dominanta: czerwień/pomarańcz — intensywność, uwaga, ciepło ekstremalne
```

---

### SEKCJA S03 — AI ADVICE ("Dzisiaj AI radzi")

#### 1. Cel biznesowy
Główne differentiatora produktu. Żadna polska aplikacja pogodowa nie robi tego co my: nie tłumaczy pogody językiem codziennym, zorientowanym na decyzję.

#### 2. Cel użytkownika
*"Powiedz mi co mam zrobić, nie co mierzy barometr."*

#### 3. Emocja
**Poczucie bycia zaopiekowanym.** Jakby mądry znajomy sprawdził pogodę i napisał SMS.

#### 4. Hierarchia wizualna

```
1s: Główna rada — jedna linia, największy font w sekcji
3s: Uzasadnienie — dwa zdania (dlaczego ta rada)
10s: Ostrzeżenie (jeśli jest) — zmiana która nadejdzie
```

#### 5. Layout

```
┌─────────────────────────────────────────┐
│                                         │
│  💡  DZISIAJ AI RADZI                   │  ← 9pt uppercase, rgba biały 0.55
│                                         │
│  "To dobry dzień na rower."             │  ← 20pt, #ffffff, weight 700
│                                         │
│  Wiatr słaby (12 km/h), powietrze       │  ← 14pt, rgba biały 0.7, lineHeight 21
│  czyste, UV nie wymaga ochrony.         │
│                                         │
│  ─────────────────────────────────────  │  ← separator rgba biały 0.1
│                                         │
│  ⚠ Wieczorem ochłodzi się o 8°          │  ← żółty #fbbf24, 13pt
│                                         │
└─────────────────────────────────────────┘
Tło: #2e3f52, borderRadius 20, padding 16
```

#### 6. Mikrointerakcje

```
Kliknięcie całej sekcji → bottom sheet z pełną analizą dnia
  (wszystkie wyliczone parametry + skąd pochodzi rada)
Kliknięcie ostrzeżenia → bottom sheet z szczegółami zmiany pogody
```

#### 7. Accessibility
Cała sekcja ma `accessibilityRole="button"` i `accessibilityLabel` czytający pełną radę.

#### PSYCHOLOGY AI ADVICE

```
ZATRZYMUJE WZROK: 
  Ludzki język (nie liczby) = mózg przetwarza szybciej niż dane numeryczne.
  Efekt pierwszeństwa + efekt ostatniego słowa: "rower" zostaje w pamięci.

SCROLLUJE DALEJ:
  Ostrzeżenie "wieczorem ochłodzi się" = cliffhanger. Co się stanie?
  Czy zdąży? → scrolluje po więcej kontekstu.

WRACA JUTRO:
  Jutro rada będzie inna. Codzienne zaskoczenie = nawyk.
```

#### PREMIUM REVIEW AI ADVICE

| Kryterium | Ocena | Uzasadnienie |
|-----------|-------|--------------|
| Elegancja | 9/10 | Ciemna karta, ludzki tekst — nie technicznie |
| Emocja | 9.5/10 | "Zaopiekowanie" — silna emocja użytkowa |
| WOW | 8.5/10 | Nowatorskie w polskich appach pogodowych |
| Minimalizm | 9/10 | Tylko 2-3 zdania — dyscyplina |

#### SELF-REVIEW AI ADVICE
```
✅ Świetnie: ludzki język, konkretna rada do działania
⚠️ Ryzyko: "AI" w nazwie może budować fałszywe oczekiwania — rozważyć nazwę
   "Dzisiaj warto wiedzieć" lub "Komentarz dnia"
❌ Zbyt zwyczajne: ikona 💡 — zbyt generyczna. W V2 Beta: własna ikona SVG
```

---

### SEKCJA S04 — TWÓJ DZIEŃ

#### 1. Cel biznesowy
Drugi kluczowy differentiator. Odpowiada na pytanie "co mogę zrobić" — nie "co będzie".

#### 2. Cel użytkownika
*"Czy mogę dziś wyjść na rower bez żałowania?"*

#### 3. Emocja
**Sprawczość i pewność.** *"Mam plan na dziś."*

#### 4. Layout

```
┌─────────────────────────────────────────┐
│                                         │
│  TWÓJ DZIEŃ                ★★★★☆        │
│                                         │
│  Bardzo dobry dzień                     │  ← 16pt, rgba biały 0.8
│                                         │
│  ┌───────────────┬───────────────────┐  │
│  │ ✔ spacer      │ ✔ fotografię      │  │  ← 13pt
│  │ ✔ rower       │ ✔ mycie auta      │  │
│  │ ✔ bieganie    │ ✗ grill (wiatr)   │  │  ← ✗ czerwone
│  │ ✔ praca w og. │ ✗ plaża (chmury)  │  │
│  └───────────────┴───────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
Tło: #2e3f52, borderRadius 20
```

#### 5. Mikrointerakcje

```
Kliknięcie aktywności (np. "rower") → bottom sheet:
  Tytuł: "Rower"
  Wynik: ✔ lub ✗
  Wyjaśnienie: "Wiatr 12 km/h (poniżej 25), brak opadów, temp 20°.
               Optymalne warunki do jazdy."
  
Kliknięcie oceny ★★★★☆ → bottom sheet z pełnym wyjaśnieniem oceny
```

#### PREMIUM REVIEW TWÓJ DZIEŃ

| Kryterium | Ocena | Uzasadnienie |
|-----------|-------|--------------|
| Praktyczność | 9.5/10 | Bezpośrednia odpowiedź na rzeczywiste pytania użytkownika |
| WOW | 8/10 | Nie jest "wow" ale jest użytecznie angażująca |
| Codzienność | 9.5/10 | Różna odpowiedź każdego dnia = powód powrotu |

---

### EKRAN S05 — PROGNOZA GODZINOWA

#### Layout (sekcja w głównym scrollu)

```
┌─────────────────────────────────────────┐
│  Dziś godzinowo                         │
│                                         │
│  ┌── SCROLL POZIOMY ─────────────────┐  │
│  │ [krzywa SVG — temperatura]        │  │
│  └─────────────────────────────────────┘  │
│                                         │
│  ┌── SCROLL POZIOMY (kafelki) ───────┐  │
│  │  [10:00]  [11:00]  [12:00] ...    │  │
│  │  ⭐ 87   ⭐ 89    ⭐ 85           │  │
│  │  Dobry    Doskon.  Dobry          │  │
│  └────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

#### Mikrointerakcje
Kafelek komfortu → bottom sheet: dlaczego taki wynik o tej godzinie (temperatura, UV, wiatr, wilgotność).

---

### EKRAN S06 — PROGNOZA 7 DNI

#### Layout (srebrne kafelki 2-kolumnowe)

```
┌─────────────────────────────────────────┐
│  Najbliższe dni           Szczegóły →   │
│                                         │
│  ┌──────────┐  ┌──────────┐            │
│  │ DZIŚ     │  │ JUTRO    │            │  ← jaśniejsze (isHighlighted)
│  │  23°  17°│  │  21°  15°│            │
│  │ ☀️       │  │ ⛅       │            │
│  │ Słoneczn.│  │ Zm. zachm│            │
│  └──────────┘  └──────────┘            │
│  ┌──────────┐  ┌──────────┐            │
│  │ ŚR       │  │ CZW      │            │  ← ciemniejsze
│  │  19°  13°│  │  17°  11°│            │
│  │ 🌧       │  │ ⛈       │            │
│  └──────────┘  └──────────┘            │
│  ...                                    │
└─────────────────────────────────────────┘
```

#### Mikrointerakcje
Kliknięcie dnia → full-screen modal Szczegóły dnia (S07).

---

### EKRAN S07 — SZCZEGÓŁY DNIA (modal po kliknięciu dnia)

#### Layout

```
┌─────────────────────────────────────────┐
│  ✕                    Środa, 6 lipca    │
├─────────────────────────────────────────┤
│                                         │
│  🌧  Deszcz                             │  ← ikona + opis
│                                         │
│  ┌──────────────────────────────────┐   │
│  │      21°  /  14°                 │   │  ← duże temperatury
│  │      max  /  min                 │   │
│  └──────────────────────────────────┘   │
│                                         │
│  GODZINY DESZCZU                        │
│  ▓▓▓▓░░░░░░▓▓▓▓▓▓░░░░░░░░░░░░         │  ← timeline bar opadów
│  0  6  10  14  18  22  24              │
│                                         │
│  WIATR     WILGOTN.    UV              │
│  14 km/h   71%         3              │
│  umiark.   wilgotne    nisk.          │
│                                         │
│  💡 "Weź parasol. Deszcz między 8-11   │
│  i po południu od 14. Rano spokojnie." │
└─────────────────────────────────────────┘
```

---

### EKRAN S08 — SZCZEGÓŁY PARAMETRÓW (10 srebrnych kafelków)

#### Layout (istniejący, do dopracowania)

```
┌─────────────────────────────────────────┐
│  piątek, 4 lipca                   ★   │  ← data + favorit
│  Aktualizacja: 14:23                    │
│                                         │
│  ┌──────────┐  ┌──────────┐            │
│  │☀️ UV     │  │🌡 CIŚN.  │            │  ← 10pt label, 22pt value
│  │  3       │  │ 1018 hPa │            │
│  │ Niski    │  │ Normalne │            │  ← 11pt, kolor tematyczny
│  └──────────┘  └──────────┘            │
│  ... (10 kafelków total)               │
│                                         │
└─────────────────────────────────────────┘
```

Każdy kafelek klikalny → bottom sheet z interpretacją zdrowotną.

---

### EKRAN S09 — MENU V2

#### 1. Cel biznesowy
Dostęp do wszystkich funkcji bez zaśmiecania głównego ekranu.

#### 2. Cel użytkownika
*"Chcę szybko przejść do meteogramu/historii/porównania."*

#### 3. Emocja
Poczucie że *"jest tu więcej"* — aplikacja ma głębię.

#### 4. Layout V2

```
┌─────────────────────────────────────────┐
│  ✕  Menu                               │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │  📅          │  │  🌡          │    │  ← duże kafelki 2-col
│  │              │  │              │    │
│  │  Prognoza    │  │  Meteogram   │    │
│  │  7 dni       │  │  ICM         │    │
│  └──────────────┘  └──────────────┘    │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │  🏃          │  │  ⭐          │    │
│  │              │  │              │    │
│  │  Sport       │  │  Ulubione    │    │
│  │  Rower       │  │  miasta      │    │
│  └──────────────┘  └──────────────┘    │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │  📊          │  │  🔗          │    │
│  │              │  │              │    │
│  │  Historia    │  │  Udostępnij  │    │
│  │  pogody      │  │              │    │
│  └──────────────┘  └──────────────┘    │
│                                         │
│  ─── ULUBIONE ────────────────────     │
│  [Warszawa ●] [Kraków] [Gdańsk]        │
│                                         │
└─────────────────────────────────────────┘
Tło: ciemny overlay na głównym ekranie (slide from right)
```

#### 5. Mikrointerakcje
Kafelki menu mają scale animation przy dotknięciu.  
Zamknięcie: swipe left lub ✕.

#### SELF-REVIEW MENU

```
✅ Świetnie: kafelki 2-col są premium, każdy ma miejsce na oddech
⚠️ Ikony: emoji nie wyglądają premium obok tak eleganckich kafelków
   → W V2 Beta: własne ikony SVG
❌ Tło: overlay ciemny jest OK, ale można rozważyć blur efekt na tle
   → backgroundBlur za menu daje głębię (VisionOS style)
```

---

### EKRAN S10 — USTAWIENIA

*V2 Alpha nie zawiera ustawień. Placeholder.*

Minimalna lista V2 Stable:
- Jednostki (°C / °F)
- Lokalizacja GPS
- Powiadomienia poranne
- Motyw (system / jasny / ciemny) — V2 Stable

---

### EKRAN S11 — ULUBIONE LOKALIZACJE

*Istniejące. W V2 — przenieść do eleganckich kafelków w Menu.*

---

### EKRAN S12 — WIDGETY

*V2 Stable scope. Nie implementujemy w Alpha/Beta.*

Koncepcja:
- Widget 2×2: temperatura + gradient hero miniatura
- Widget 4×2: temperatura + AI Advice (jedna linia)

---

### EKRAN S13 — POWIADOMIENIA

*V2 Stable scope.*

Typy powiadomień:
- Poranne (7:00): "Dzień dobry. Dziś 23°, rower możliwy."
- Alert (na żądanie): burza/upał/złe powietrze
- Wieczorne (opcjonalne): "Jutro będzie padać."

Format: krótkie, ludzkie, actionable.

---

## CZĘŚĆ B — STANY SYSTEMOWE

### ST1 — LOADING

#### Problem V1
ActivityIndicator + puste białe tło. Niszczy immersję od pierwszej sekundy.

#### Rozwiązanie V2

```
┌─────────────────────────────────────────┐
│                                         │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░  [gradient hero animowany]        ░│
│  ░░  Shimmer/pulse efekt              ░│
│  ░░                                   ░│
│  ░░         --°                       ░│  ← "--°" zamiast pustki
│  ░░   Sprawdzam pogodę...             ░│  ← 14pt, ludzki tekst
│  ░░                                   ░│
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ████████████████████           │   │  ← skeleton placeholder
│  │  ██████████                     │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

Skeleton: szary prostokąt z shimmer animacją (przejście jasności lewo→prawo, 1.5s loop).

#### PREMIUM REVIEW LOADING

```
Elegancja: 9/10 — gradient + skeleton = produkt, nie prototype
WOW: 8/10 — ładowanie to ładowanie, ale to jest najpiękniejsze możliwe
```

---

### ST2 — ERROR STATE

#### Problem V1
Alert dialog — generyczny Android. Niszczy premium feeling.

#### Rozwiązanie V2

```
┌─────────────────────────────────────────┐
│                                         │
│  ░░  [gradient hero — ciemny wariant] ░│
│  ░░                                   ░│
│  ░░      ⛅                           ░│  ← ikona pogody z iksem
│  ░░                                   ░│
│  ░░   Coś poszło nie tak              ░│  ← 22pt, #fff
│  ░░   z prognozą.                     ░│
│  ░░                                   ░│
│  ░░   Sprawdź połączenie              ░│  ← 14pt, rgba 0.7
│  ░░   z internetem.                   ░│
│  ░░                                   ░│
│  ░░  [Spróbuj ponownie]               ░│  ← przycisk premium
│  ░░  [Ostatnia prognoza z 14:22 →]    ░│  ← link do cache
│  ░░                                   ░│
└─────────────────────────────────────────┘
```

---

### ST3 — OFFLINE

```
┌─────────────────────────────────────────┐
│  [delikatny baner u góry]               │
│  📡 Offline · ostatnia aktualizacja: 14:22  │  ← 12pt, warning color
├─────────────────────────────────────────┤
│  [normalna aplikacja z danymi z cache]  │
└─────────────────────────────────────────┘
Baner: backgroundColor rgba pomarańcz 0.15, znika po 3s gdy wróci internet
```

---

### ST4 — EMPTY STATE (brak ulubionych)

```
Pokazywany tylko gdy użytkownik otworzy listę ulubionych i jest pusta.
Nie blokuje głównego ekranu.

Treść:
  ⭐ (duża ikona)
  "Brak ulubionych miast"
  "Wyszukaj miasto i zapisz, aby szybko sprawdzać pogodę."
  [Wyszukaj miasto] ← CTA
```

---

### ST5 — ONBOARDING (pierwsze uruchomienie)

*V2 Stable scope.*

Minimalna koncepcja — 3 ekrany:
1. Lokalizacja GPS: "Sprawdzam pogodę w Twoim miejscu"
2. Powiadomienia: "Ostrzegam gdy coś ważnego nadejdzie"
3. Start: gradient hero z pierwszą temperaturą

---

## CZĘŚĆ C — BENCHMARK

### Apple Weather

| Co robią lepiej | Co możemy zrobić lepiej |
|-----------------|-------------------------|
| Animacje chmur 3D w hero — immersja | **Nasze:** AI Advice — Apple nie tłumaczy danych po ludzku |
| Krzywa precipitacji — ikona godzinowa | **Nasze:** Twój dzień z oceną aktywności |
| Moduły dopasowane do kontekstu | **Nasze:** Kafelki Przegląd — czytelniejsze niż Apple scrollable cards |
| Precyzja danych (own API) | Remis |

### CARROT Weather

| Co robią lepiej | Co możemy zrobić lepiej |
|-----------------|-------------------------|
| Pełny ekran tła reagujący na pogodę | **Nasze:** będziemy mieć podobnie z gradientem |
| Personalizacja — wybór "cech" | Celowo nie robimy — prostota > personalizacja |
| Humor i osobowość | Nie nasz kierunek — nasz "charakter" to spokój i głębia |

### Today Weather

| Co robią lepiej | Co możemy zrobić lepiej |
|-----------------|-------------------------|
| Wykres dobowy czytelny | **Nasze:** krzywa SVG z etykietami na każdej godzinie |
| Widget systemowy | V2 Stable |

### Weawow

| Co robią lepiej | Co możemy zrobić lepiej |
|-----------------|-------------------------|
| Zdjęcia użytkowników — community | Nie nasz kierunek |
| Czysta prezentacja danych | **Nasze:** interpretacja, nie surowe dane |

### Windy / Ventusky

| Co robią lepiej | Co możemy zrobić lepiej |
|-----------------|-------------------------|
| Mapy pogodowe — interaktywne | Nie nasz kierunek — to pro tools |
| Wiatr i prądy powietrzne | Meteogram ICM już mamy |
| **Dla entuzjastów meteorologii** | **Nasze:** dla zwykłych ludzi + poczucie premium |

### Samsung / Pixel Weather

Nie stanowią benchmarku premium. Są OK jako utility apps, nie jako experience.

### Wniosek z benchmarku

**Nasza unikalna nisza:** Jedyna polska aplikacja pogodowa klasy premium z ludzką interpretacją danych, żywym hero i oceną dnia. Apple ma lepsze animacje. CARROT ma humor. My mamy **spokój, głębię i zaopiekowanie**.

---

## CZĘŚĆ D — DESIGN CONSISTENCY REVIEW

### Paleta tła

✅ Wszystkie sekcje: `#2e3f52`  
✅ Wszystkie srebrne kafelki: `rgba(255,255,255,0.09)`  
✅ Wszystkie kolorowe kafelki: kolory z Design Tokens  
✅ Bottom sheety: `#1a2b3c`  

### Typografia

✅ Etykiety: 9-10pt, uppercase, weight 800, letterSpacing 1.2  
✅ Wartości: 22-32pt, weight 800  
✅ Kontekst: 11pt, weight 500-600  
⚠️ AI Advice: tekst ciała 14pt — sprawdzić czy nie za mały na gorszych ekranach

### Mikrointerakcje

✅ Każdy kafelek: scale 0.96 przy press  
✅ Każdy press: haptic 8ms  
⚠️ Bottom sheet dismiss: brak animacji zniknięcia backdrop — do dodania w V2 Alpha

### Spójna zasada bottom sheet

✅ Handle bar zawsze: 40×4, rgba biały 0.2  
✅ Akcent pionowy zawsze: 6×24, kolor tematyczny  
✅ Duża wartość: 40pt, kolor tematyczny  
✅ Przycisk zamknij: rgba biały 0.1 background  

**Ocena spójności:** 9.2/10 — fundamenty spójne, detale do dopracowania w V2 Beta.

---

## CZĘŚĆ E — QUALITY GATE ASSESSMENT

### Skala ocen (1-10, gdzie 9.5+ = gotowość do implementacji)

| Kryterium | Obecna ocena | Wymagana | Delta | Działanie |
|-----------|-------------|----------|-------|-----------|
| **UX** | 9.0/10 | 9.5 | -0.5 | V2 Alpha: AI Advice + Twój dzień |
| **UI** | 8.5/10 | 9.5 | -1.0 | V2 Alpha: żywy gradient hero |
| **Premium Feeling** | 8.0/10 | 9.5 | -1.5 | V2 Beta: własne ikony + animacje reveal |
| **WOW** | 8.5/10 | 9.5 | -1.0 | V2 Alpha: żywy gradient jest głównym WOW |
| **Spójność** | 9.2/10 | 10.0 | -0.8 | Wymaga dyscypliny podczas impl. |

### Wniosek Quality Gate

**Projekt nie osiągnął jeszcze wymaganych wartości. To jest uczciwa ocena.**

Jednak nie oznacza to powrotu do tablicy. Oznacza to, że:
- V2 Alpha podniesie UI i WOW do 9.5+ (żywy gradient, AI Advice)
- V2 Beta podniesie Premium Feeling do 9.5+ (własne ikony, animacje)
- V2 RC podniesie Spójność do 10/10

**Rekomendacja:** Możemy zacząć implementację V2 Alpha, bo dokumentacja jest wystarczająco dojrzała. Implementacja V2 Alpha sama w sobie jest etapem "projektowania przez prototypowanie" — tylko z działającym kodem na telefonie.

---

## CZĘŚĆ F — RAPORT KOŃCOWY PHASE 0.5

### Największe mocne strony projektu

**1. Unikalna propozycja wartości**  
AI Advice + Twój dzień = różnicowanie których nie ma żadna polska aplikacja pogodowa. Nie kopiujemy. Wprowadzamy nowy standard.

**2. Hierarchia wizualna**  
Temperatura 96pt jako absolutny bohater. Reszta milczy i uzupełnia. To jest właściwe i rzadkie — większość aplikacji ma zbyt dużo elementów walczących o uwagę.

**3. Dynamiczny hero**  
Jedyna aplikacja w Polsce gdzie hero zmienia się z warunkami i porą dnia. Burza wygląda jak burza. Świt wygląda jak świt. To jest tożsamość produktu.

**4. Interpretacja danych**  
"Komfortowa wilgotność" zamiast "61%". "SPF nie jest dziś potrzebny" zamiast "UV: 1". To jest naprawdę trudne do skopiowania — wymaga przemyślanej logiki dla każdego parametru.

**5. Backup i dyscyplina projektu**  
Restore point `v1-stable-pre-v2`, Ideas Backlog, Definition of Done — to są cechy dojrzałego projektu, nie hobbystycznej apki.

### Największe ryzyka

**Ryzyko 1: Gradient hero na Android**  
React Native LinearGradient działa inaczej niż iOS. Animacja gradientu może być choppy na starszych Androidach. Mitygacja: testować na rzeczywistym urządzeniu w V2 Alpha.

**Ryzyko 2: AI Advice — jakość rad**  
Logika lokalna może generować rady które brzmią niespójnie przy edge case'ach (np. upał + deszcz jednocześnie). Mitygacja: pokryć 20 najczęstszych kombinacji warunków i testować każdą.

**Ryzyko 3: Rozmiar App.tsx**  
Plik ma ~2800+ linii. Każda nowa sekcja (AI Advice, Twój dzień) doda ~100 linii. W V2 Alpha App.tsx może przekroczyć 3200 linii — zacznie spowalniać IDE i kompilację. Mitygacja: wyekstrahować AI Advice i Twój dzień jako osobne komponenty od razu.

**Ryzyko 4: "Feature creep" podczas implementacji**  
Każda sesja generuje nowe pomysły. Bez dyscypliny IDEAS_BACKLOG.md projekt będzie się rozszerzać zamiast pogłębiać. Mitygacja: zasada "jeden moduł na raz" + akceptacja MA po każdym.

### Lista ostatnich poprawek przed implementacją

```
□ Zdecydować czy zachować "Odczuwalna X°" w hero czy przenieść do Szczegółów
□ Przemyśleć nazwę "AI radzi" → może "Komentarz dnia" (mniej techniczne)
□ Ustalić dokładną listę aktywności w "Twój dzień" (max 8, co odrzucić)
□ Gradient Hero: ustalić progi godzinowe dla każdego stanu
  (czy świt to 05:00-07:00 czy zależy od sunrise?)
□ Zdecydować: gradient hero używa sunrise/sunset z API czy stałych godzin?
  (użycie sunrise/sunset = bardziej autentyczne, ale wymaga danych przy pierwszym ładowaniu)
```

### Gotowość do implementacji V2 Alpha

**TAK, z zastrzeżeniami.**

Dokumentacja jest na poziomie który pozwala na implementację V2 Alpha bez podejmowania decyzji UX podczas kodowania. Trzy otwarte pytania z listy powyżej wymagają decyzji Master Admin przed startem.

Gdy te decyzje zapadną — implementacja V2 Alpha może się rozpocząć. Szacuję 3 sesje do ukończenia Alpha.

---

## QUESTIONS FOR MASTER ADMIN

Przed rozpoczęciem implementacji V2 Alpha potrzebuję decyzji w czterech kwestiach:

**Q1: "AI radzi" czy "Komentarz dnia"?**  
"AI" buduje oczekiwanie zewnętrznego modelu językowego. "Komentarz dnia" jest bardziej uczciwe (to logika lokalna) i bardziej ludzkie.

**Q2: Gradient hero — sunrise/sunset z API czy stałe godziny?**  
Z API: autentyczniejsze (świt o 4:30 latem, 7:30 zimą). Ze stałymi: stabilniejsze.

**Q3: "Odczuwalna temperatura" w hero — zostaje czy do Szczegółów?**  
Za: daje kontekst do głównej liczby. Przeciw: zaśmieca najważniejszy element.

**Q4: Które 8 aktywności w "Twój dzień"?**  
Propozycja: spacer, rower, bieganie, praca w ogrodzie, fotografię, mycie auta, grill, plaża.  
Zatwierdzasz tę listę?

---

*Ścieżka: `C:\AI_PROJECTS\WeatherApp\docs\PHASE_0_5_VISUAL_REVIEW.md`*  
*Link: [PHASE_0_5_VISUAL_REVIEW.md](WeatherApp/docs/PHASE_0_5_VISUAL_REVIEW.md)*
