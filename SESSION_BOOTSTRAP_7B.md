# SESSION BOOTSTRAP — PHASE 7B (stan po sesji 2026-07-02)

**Skopiuj poniższy prompt jako PIERWSZĄ wiadomość do nowej sesji Claude.**

---

## PROMPT INIT — WKLEJ DO NOWEJ SESJI

```
MASTER ADMIN → CLAUDE | PHASE 7B BOOTSTRAP | 2026-07-02

Projekt: Weather App (React Native 0.86.0 + TypeScript)
Folder roboczy: C:\AI_PROJECTS\WeatherApp\ — nie wychodź poza ten folder bez zgody
Urządzenie: Motorola Edge 50 Fusion (ZY22M6H35M, Android 15, adb)
Model: użyj Opus dla redesignu/trudnych zadań

## REGUŁY SESJI (NON-NEGOTIABLE)
1. NIE edytuj kodu bez podania planu i uzyskania "ok" ode mnie
2. NIE buduj APK bez słów: "utrwalić na stałe" lub "zbuduj APK"
3. NIE zmieniaj design systemu (kolory, typografia, spacing — LOCKED)
4. Zawsze podaj pełną ścieżkę absolutną do każdego tworzonego/zmienionego pliku
5. Design locked: #1E90FF, rgba(255,255,255,0.93), #1F2937, #9CA3AF, 96pt/32pt/14pt, borderRadius 13-14pt, brak emoji

## STAN PROJEKTU (co zrobione, co pending)

### ✅ ZROBIONE w poprzedniej sesji
- Zadanie 1: minTemp przywrócone w kartach "Najbliższe dni"
  Lokalizacja: App.tsx ~1600-1607 (maxTemp 32pt niebieski + minTemp 16pt szary w wierszu baseline)
- Zadanie 2: redesign "Dziś godzinowo" — POTWIERDZONE NA URZĄDZENIU
  App.tsx 1522-1573: slot 68px, scrollowalność 00:00-23:00, TempCurve padX=34
  src/components/TempCurve.tsx: H=150, innerH=104px, etykiety co 3h, prop padX

### ❌ DO ZROBIENIA (następne zadanie)
- Zadanie 3: redesign "Szczegóły" (App.tsx ~1622+)
  Obecny stan: grid 2×2, generyczny wygląd
  Cel: premium mini-widgety (ikona + wartość + label), spójne z resztą designu
  Szacowany czas: 1-2 godziny

### ⏳ OPCJONALNE
- Powietrze badge w Hero: ikona+tekst w row → bardziej premium (~30 min)

## BLOKADA APK (ważne!)
Build `app:installDebug` pada 3x z AccessDeniedException — Windows Defender blokuje pliki w android\app\build.
FIX (wymaga admina): Zabezpieczenia Windows → Ochrona przed wirusami → Zarządzaj ustawieniami → Wyjątki → Dodaj folder → C:\AI_PROJECTS\WeatherApp\android
Do czasu naprawy: zmiany działają TYLKO przez Metro (npx react-native start + adb reverse tcp:8081 tcp:8081).

## ARCHITEKTURA (kluczowe)
- Cały UI w jednym pliku: App.tsx (~2800 linii)
- API: Open-Meteo (bez klucza), WMO codes → polskie opisy
- Context API + AsyncStorage (bez Redux/SQLite)
- Design docs: docs/DESIGN_SYSTEM.md (400+ linii — przed zmianą wizualną ZAWSZE sprawdź tu)
- Decyzje: docs/DECISION_REGISTRY.md (nie wracaj do odrzuconych pomysłów)

## CO ROBIĆ NA STARCIE
1. Przeczytaj docs/NEVER_FORGET.md (reguły absolutne)
2. Zapytaj mnie co chcę robić (Zadanie 3? Fix Defender? Coś innego?)
3. Zaproponuj plan PRZED edycją

Gotowy do pracy.
```

---

## KONTEKST TECHNICZNY (dla Claude — nie kopiuj)

### Kluczowe pliki sesji 2026-07-02

**App.tsx — sekcja "Dziś godzinowo" (linie 1522-1573):**
```tsx
<ScrollView horizontal showsHorizontalScrollIndicator={false}>
  <View style={{ width: weather.hourly.length * 68 + 16, paddingRight: 16 }}>
    {(() => {
      const nowH = new Date().getHours();
      const pts = weather.hourly.map(h => {
        const hH = parseInt(h.time.split(':')[0]);
        return { label: h.time.split(':')[0], temp: parseInt(h.temp.replace('°', '')) || 0, isNow: hH === nowH };
      });
      return <TempCurve points={pts} width={weather.hourly.length * 68} padX={34} />;
    })()}
    <View style={{ flexDirection: 'row' }}>
      {weather.hourly.map((h, i) => {
        // ...kafle z width: 68, alignItems: 'center' (slot/pitch system)
      })}
    </View>
  </View>
</ScrollView>
```

**TempCurve.tsx — kluczowe parametry:**
- H = 150 (wysokość SVG)
- innerH = 104px (H - padTop 28 - padBottom 18)
- padX prop = 34 (połowa slotu 68px, wyrównuje punkt nad środek kafla)
- Etykiety co 3 godziny (i % 3 === 0)

**App.tsx — minTemp w kartach forecast (~1600-1607):**
```tsx
<View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 }}>
  <Text style={{ fontSize: 32, fontWeight: '700', color: '#1e90ff', letterSpacing: -1 }}>
    {day.maxTemp.replace('°C', '°')}
  </Text>
  <Text style={{ fontSize: 16, fontWeight: '600', color: '#9ca3af', marginLeft: 6 }}>
    {day.minTemp.replace('°C', '°')}
  </Text>
</View>
```

### Napotykane problemy (żeby nie powtarzać)
- isNow: używaj `hH === nowH` (nie 3-godzinnego okna — relikt wttr.in)
- gap: 8 w row tile'ów = rozjeżdżanie względem krzywej — NIE dodawaj gap
- AccessDeniedException w Gradle = Windows Defender (nie błąd kodu)
- Metro zdechłe = kafle wracają do 19:00 (stary bundle) → sprawdź localhost:8081

---

Ścieżka: `C:\AI_PROJECTS\WeatherApp\SESSION_BOOTSTRAP_7B.md`
