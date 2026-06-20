# ✅ USER ACCEPTANCE TEST (UAT) CHECKLIST
## WEATHER APP - ETAP 2

**Czas testowania:** ~10 minut  
**Bez terminologii technicznej**  
**Język:** Polski

---

## 📋 TEST 1: AKTUALNA POGODA

### Co zrobić?
1. Otwórz aplikację "Pogoda"
2. Czekaj aż się załaduje (~3 sekundy)
3. Popatrz na główny ekran

### Co powinno się pokazać?
- ✓ Nazwa miasta: "Czestochowa, Poland"
- ✓ Temperatura: liczba z °C (np. 21°C)
- ✓ Ikonka pogody: chmurki lub słońce
- ✓ Opis pogody: po polsku (np. "Przelotne lekkie deszczu")
- ✓ Odczuwa się: temperatura (np. 21°C)
- ✓ Wilgotność: liczba z % (np. 83%)
- ✓ Wiatr: liczba z km/h (np. 8 km/h)
- ✓ Godzina aktualizacji: wyświetlana (np. "Aktualizacja: 03:55")

### Jak rozpoznać problem?
- ❌ Ekran ładuje się dłużej niż 5 sekund
- ❌ Brakuje któregokolwiek z powyższych elementów
- ❌ Liczby pokazują "N/A" lub "undefined"
- ❌ Tekst jest nieczytelny (zbyt mały, niewidoczny)
- ❌ Aplikacja się zawiesza lub wysypuje się

---

## 📋 TEST 2: PROGNOZA WIELODNIOWA

### Co zrobić?
1. Przejdź na dół ekranu (scroll w dół)
2. Szukaj sekcji "📅 Prognoza na 3 dni"
3. Popatrz na karty dni

### Co powinno się pokazać?
- ✓ Dokładnie 3 dni w przyszłości (np. 21-06, 22-06, 23-06)
- ✓ NIE dzisiejsza data (nie 20-06)
- ✓ Dla każdego dnia:
  - Data (np. 2026-06-21)
  - Ikonka pogody (chmurki lub słońce)
  - Opis (np. "Przelotne lekkie deszczu")
  - Max temperatura (np. "27°C")
  - Min temperatura (np. "19°C")

### Jak rozpoznać problem?
- ❌ Pokazuje dzisiejszy dzień zamiast przyszłości
- ❌ Pokazuje mniej niż 3 dni
- ❌ Brakuje któregokolwiek elementu (data, temp, opis)
- ❌ Temperatury pokazują "N/A"
- ❌ Daty są w złym formacie

---

## 📋 TEST 3: KLIKALNE DNI PROGNOZY

### Co zrobić?
1. Wciąż w sekcji "Prognoza na 3 dni"
2. Kliknij na pierwszy dzień (kartę)

### Co powinno się pokazać?
- ✓ Okno (modal) się otwiera z szczegółami dnia
- ✓ Pokazuje datę
- ✓ Pokazuje godzinę wschodu słońca
- ✓ Pokazuje godzinę zachodu słońca
- ✓ Pokazuje opis pogody
- ✓ Można zamknąć okno (X w górnym rogu)

### Jak rozpoznać problem?
- ❌ Kliknięcie nic nie robi
- ❌ Okno się nie otwiera
- ❌ Okno otwiera się zbyt długo (>2 sekundy)
- ❌ Szczegóły są puste (pokazują "N/A" zamiast danych)
- ❌ Nie da się zamknąć okna

---

## 📋 TEST 4: JAKOŚĆ POWIETRZA (AQI) - GŁÓWNY EKRAN

### Co zrobić?
1. Wróć do głównego ekranu (scroll w górę)
2. Szukaj zielonego pola z napisem "Jakość powietrza"
3. Sprawdź co tam jest napisane

### Co powinno się pokazać?
- ✓ Zielone pole (kolor)
- ✓ Emoji 🟢 (zielony krąg) lub podobne
- ✓ Tekst "Dobra" (po polsku)
- ✓ Dodatkowo mogą być liczby: PM2.5 i PM10

### Jak rozpoznać problem?
- ❌ Pole nie ma koloru (szare lub nieokreślone)
- ❌ Pokazuje "Brak danych"
- ❌ Nie widać tekstu
- ❌ Tekst jest w angielskim (nie polskim)

---

## 📋 TEST 5: MODAL JAKOŚCI POWIETRZA (KLIKNIĘCIE)

### Co zrobić?
1. Wciąż na głównym ekranie
2. Kliknij na zielone pole "Jakość powietrza"

### Co powinno się pokazać?
- ✓ Okno się otwiera
- ✓ Pokazuje:
  - Emoji 🟢 Dobra
  - PM2.5: liczba z μg/m³ (np. 13 μg/m³)
  - PM10: liczba z μg/m³ (np. 16 μg/m³)
- ✓ Przycisk X do zamknięcia okna

### Jak rozpoznać problem?
- ❌ Kliknięcie nic nie robi
- ❌ Okno się nie otwiera
- ❌ Okno otwiera się ale jest puste
- ❌ Nie widać danych PM2.5 i PM10
- ❌ Nie ma przycisku zamknięcia

---

## 📋 TEST 6: SUN CARD (WSCHÓD, ZACHÓD, DŁUGOŚĆ DNIA)

### Co zrobić?
1. Główny ekran, sekcja "📊 Szczegóły"
2. Szukaj żółtego pola z napisem "☀️ Długość dnia"

### Co powinno się pokazać?
- ✓ Żółte pole (kolor)
- ✓ Emoji ☀️ (słoneczko)
- ✓ Tekst "Długość dnia"
- ✓ Liczba w formacie: "16h 31m" (godziny + minuty)
- ✓ To NIE powinno być "NaN" lub "undefined"

### Jak rozpoznać problem?
- ❌ Pole pokazuje "NaN" zamiast liczby
- ❌ Pole pokazuje "undefined"
- ❌ Nie widać długości dnia
- ❌ Format jest dziwny (nie godziny:minuty)

---

## 📋 TEST 7: WEATHER INSIGHT (PODSUMOWANIE POGODY)

### Co zrobić?
1. Główny ekran, pod opisem pogody
2. Szukaj tekstu (najlepiej w kursywie/szarej czcionce)

### Co powinno się pokazać?
- ✓ Dodatkowy tekst, np: "Dzień będzie przyjemny z opadami. Weź parasol. Wilgoć wysoka."
- ✓ Tekst jest po polsku
- ✓ Tekst się zmienia w zależności od pogody (jeśli ciepło = "ciepły")

### Jak rozpoznać problem?
- ❌ Brak tekstu (albo go nie widać)
- ❌ Tekst jest w angielskim
- ❌ Tekst zawsze ten sam (nie reaguje na pogodę)
- ❌ Tekst jest nieczytelny (zbyt mały)

---

## 📋 TEST 8: ULUBIONE MIASTA

### Co zrobić?
1. Główny ekran, górna część
2. Szukaj sekcji "⭐ Ulubione miasta"
3. Powinny być przyciski z nazwami miast

### Co powinno się pokazać?
- ✓ Przycisk "Częstochowa" (aktywny/wybrany - niebieski)
- ✓ Przycisk "Warszawa" (niebieski obwód)
- ✓ Przycisk "Kraków" (niebieski obwód)
- ✓ Kliknięcie na miasto zmienia pogodę na ekranie

### Jak rozpoznać problem?
- ❌ Brak sekcji "Ulubione miasta"
- ❌ Brakuje któregokolwiek miasta
- ❌ Przyciski są niewidoczne
- ❌ Kliknięcie na miasto nic nie robi
- ❌ Zmienia się miasto ale pogoda się nie zmienia

---

## 📋 TEST 9: RESTART APLIKACJI (ASYNCSTORAGE)

### Co zrobić?
1. Aplikacja musi być otwarta (Pogoda)
2. Zamknij aplikację (Recent Apps → swipe/zamknięcie)
3. Czekaj 2 sekundy
4. Otwórz aplikację ponownie

### Co powinno się pokazać?
- ✓ Aplikacja otwiera się do miasta gdzie byłeś ostatnio
- ✓ Ulubione miasta są takie SAME (Częstochowa, Warszawa, Kraków)
- ✓ Pogoda pokazuje dane dla poprzedniego miasta
- ✓ Nic się nie straciło

### Jak rozpoznać problem?
- ❌ Aplikacja restartuje do innego miasta
- ❌ Ulubione miasta zniknęły
- ❌ Lista ulubionych jest pusta
- ❌ Pogoda się nie załadowała

---

## 📋 TEST 10: TRYB OFFLINE (BEZ INTERNETU)

### Co zrobić?
1. Aplikacja jest otwarta
2. Przejdź do Ustawień Motoroli
3. WiFi: Wyłącz WiFi
4. Wróć do aplikacji
5. Pull-to-refresh: Przesuń ekran w dół

### Co powinno się pokazać?
- ✓ Po wyłączeniu WiFi, po refresh
- ✓ Spinner (kółko ładowania) przez 2 sekundy
- ✓ Aplikacja wyświetla ostatnie dane
- ✓ MOŻE pojawić się komunikat: "📡 Bez internetu"
- ✓ Pogoda pokazywana MIMO braku internetu

### Jak rozpoznać problem?
- ❌ Po wyłączeniu WiFi aplikacja pokazuje błąd
- ❌ Pogoda nie pojawia się w trybie offline
- ❌ Aplikacja się zawiesza
- ❌ Brak komunikatu o trybie offline

---

## 🎨 DODATKOWE TESTY UX (Wrażenie ogólne)

### 1. CZCIONKI - Czy są czytelne?
- [ ] Temperatura: TAK / NIE
- [ ] Opis pogody: TAK / NIE
- [ ] Szczegóły (wilgotność, wiatr): TAK / NIE
- [ ] Daty prognozy: TAK / NIE

### 2. KOLORY - Czy są przyjemne i intuicyjne?
- [ ] Niebieskie tło nagłówka: TAK / NIE
- [ ] Zielone pole AQI: TAK / NIE
- [ ] Żółte pole Sun Card: TAK / NIE
- [ ] Białe tło szczegółów: TAK / NIE

### 3. ROZMIARY ELEMENTÓW - Czy są wygodne?
- [ ] Przyciski miast: za małe / OK / za duże
- [ ] Temperatura główna: za mała / OK / za duża
- [ ] Ikony pogody: za małe / OK / za duża
- [ ] Sekcje szczegółów: za mała / OK / za duża

### 4. INTUICYJNOŚĆ - Czy od razu wiesz co robić?
- [ ] Czy rozumiesz główny ekran bez instrukcji? TAK / NIE
- [ ] Czy wiesz że można klikać na dni prognozy? TAK / NIE
- [ ] Czy wiesz że można klikać na AQI? TAK / NIE
- [ ] Czy znalazłeś ulubione miasta od razu? TAK / NIE

### 5. WRAŻENIE OGÓLNE - Czy aplikacja wygląda na gotową?
- [ ] Wygląda profesjonalnie? TAK / NIE
- [ ] Masz wrażenie że coś brakuje? TAK / NIE / Tak, coś konkretnie: ____
- [ ] Czy chciałbyś to używać codziennie? TAK / NIE
- [ ] Czy rekomendowałbyś to znajomemu? TAK / NIE

---

## 📝 INSTRUKCJE DLA MASTER ADMINA

Paweł - przeprowadź testy w następującą kolejność:

1. **TEST 1-10:** Zrób każdy test, zaznacz rezultaty
2. **UX TESTY:** Oceń wrażenia ogólne
3. **Problemy:** Jeśli napotkasz problem - napisz dokładnie co się stało
4. **Screenshoty:** Opcjonalnie - zrób screenshoty problemów
5. **Rezultaty:** Po testach - wyślij wyniki do Claude'a

⏱️ **CAŁKOWITY CZAS:** ~10 minut

---

## 🎯 CO TERAZ?

Paweł - po wykonaniu UAT wyślij wyniki:
- [ ] Które testy przeszły?
- [ ] Które testy nie przeszły?
- [ ] Jakie problemy napotkałeś?
- [ ] Ogólne wrażenie (0-100%)?

Claude przygotuje **Raport UAT** z:
1. Listą błędów (Krytyczne / Ważne / Drobne)
2. Listą uwag UX
3. Listą rekomendowanych poprawek
4. Oceną gotowości produktu (0-100%)
