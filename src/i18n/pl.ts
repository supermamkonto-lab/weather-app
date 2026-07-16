// WeatherApp V2 — Polish strings
// i18n-ready: all user-visible text lives here.
// To add a language: create src/i18n/en.ts with the same shape,
// then switch the export in src/i18n/index.ts.

export const pl = {
  app: {
    searchPlaceholder: 'Wyszukaj miasto...',
    menu: 'Menu',
    close: 'Zamknij',
    loading: 'Sprawdzam pogodę...',
    errorTitle: 'Coś poszło nie tak',
    errorBody: 'Nie możemy pobrać prognozy. Sprawdź połączenie z internetem.',
    retry: 'Spróbuj ponownie',
    lastForecast: (time: string) => `Ostatnia prognoza z ${time} →`,
    offline: (time: string) => `📡 Offline · ostatnia aktualizacja: ${time}`,
  },

  hero: {
    feelsLike: (t: string) => `Odczuwalna ${t}°`,
    airQuality: (q: string) => `Powietrze: ${q}`,
  },

  dayComment: {
    sectionLabel: 'Komentarz dnia',

    // Ostrzeżenia krytyczne
    heatAlert:     (t: number) => `Uwaga na upał (${t}°). Dużo wody, unikaj słońca 11–15.`,
    frostAlert:    (t: number) => `Mróz (${t}°). Zakryj twarz i dłonie. Nie zostawiaj zwierząt na dworze.`,
    stormAlert:    'Burza w prognozie. Nie planuj długich wyjść na zewnątrz.',
    badAirAlert:   'Jakość powietrza zła. Astmatycy i dzieci — zostańcie w domu.',

    // Aktywności
    perfectBike:   'Idealny dzień na rower. Wiatr słaby, UV bez ochrony, 0% opadów.',
    goodRun:       'Świetne warunki do biegania — temperatura idealna, powietrze czyste.',
    rainDay:       'Deszcz. Weź parasol lub zostań w domu z dobrą kawą.',
    windyDay:      'Silny wiatr. Ostrożnie na rowerze i przy wychodzeniu z domu.',
    washCar:       'Dziś warto umyć auto — brak opadów przez najbliższe 8 godzin.',
    photoDay:      'Doskonałe warunki do fotografii. Widoczność ponad 20 km.',
    ventilate:     'Warto przewietrzyć mieszkanie. Powietrze zewnętrzne wyjątkowo czyste.',
    snowDay:       'Śnieg. Ubierz się ciepło i uważaj na oblodzone chodniki.',
    fogDay:        'Mgła. Ostrożnie przy prowadzeniu — ograniczona widoczność.',

    // Zmiany w ciągu dnia
    rainComing:    (h: number) => `Rano spokojnie, ale od godziny ${h}:00 spodziewaj się opadów.`,
    coolEvening:   (delta: number) => `Wieczorem temperatura spadnie o ${delta}°. Weź coś ciepłego.`,
    longDay:       (hours: string) => `Dziś wyjątkowo długi dzień — ${hours} słońca.`,

    // Ciekawostki
    lowPressure:   'Niskie ciśnienie — niektórzy mogą czuć zmęczenie lub bóle głowy.',
    highPressure:  'Wysokie ciśnienie — dobre samopoczucie, możesz czuć więcej energii.',
    dryAir:        'Suche powietrze. Pamiętaj o nawilżeniu i dużej ilości wody.',
    goodDefault:   'Przyjemny dzień. Bez ekstremalnych warunków, idealne do codziennych aktywności.',
  },

  yourDay: {
    sectionLabel: 'Twój dzień',
    ratingLabels: ['', 'Trudny dzień', 'Ograniczony dzień', 'Dobry dzień', 'Bardzo dobry dzień', 'Idealny dzień'],
    activitiesLabel: 'Aktywności',
    whyLabel: (stars: number) => `Dlaczego ${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}?`,
    tapHint: 'Dotknij aktywność — wyjaśnienie dlaczego ✔/✗',
    ok: '✔',
    notOk: '✗',
    activities: {
      walk:    'spacer',
      bike:    'rower',
      run:     'bieganie',
      garden:  'ogród',
      photo:   'fotografia',
      washCar: 'mycie auta',
      bbq:     'grill',
      beach:   'plaża',
    },
    reasons: {
      walk: {
        ok:  'Temperatura i warunki odpowiednie. Brak ekstremalnych zjawisk.',
        storm: 'Burza — nie wychodź na zewnątrz.',
        frost: (t: number) => `Mróz (${t}°) — ubierz się ciepło lub zostań w domu.`,
      },
      bike: {
        ok:       'Wiatr słaby, brak opadów, temperatura optymalna.',
        wind:     (v: number) => `Wiatr za silny (${v} km/h) — utrudniona jazda.`,
        rain:     'Opady — śliska nawierzchnia.',
        cold:     (t: number) => `Zbyt zimno (${t}°) do komfortowej jazdy.`,
      },
      run: {
        ok:    'Temperatura i jakość powietrza — idealne do biegania.',
        heat:  (t: number) => `Zbyt gorąco (${t}°) — ryzyko przegrzania.`,
        air:   'Zła jakość powietrza — ogranicz wysiłek na zewnątrz.',
        rain:  'Deszcz — ślisko, mokro.',
      },
      garden: {
        ok:   'Dobre warunki do pracy w ogrodzie.',
        rain: 'Opady — ogród poczeka.',
        wind: (v: number) => `Silny wiatr (${v} km/h) — praca w ogrodzie utrudniona.`,
        frost: 'Mróz — rośliny wymagają ochrony, nie teraz.',
      },
      photo: {
        ok:   'Doskonała widoczność i dobre światło.',
        fog:  'Mgła — widoczność ograniczona, dramatyczne ujęcia.',
        rain: 'Deszcz — trudne warunki, chyba że masz ochraniacz.',
        night: 'Noc — fotografia nocna, wymaga statywu.',
      },
      washCar: {
        ok:   'Brak opadów przez najbliższe godziny — auto wyschnie.',
        rain: 'Opady w prognozie — szkoda zachodu.',
        wind: (v: number) => `Silny wiatr (${v} km/h) — kurz i pył natychmiast po myciu.`,
      },
      bbq: {
        ok:   'Idealne warunki — wiatr słaby, brak opadów, ciepło.',
        wind: (v: number) => `Wiatr (${v} km/h) — grill trudny do utrzymania.`,
        rain: 'Deszcz — grill w planie B.',
        cold: (t: number) => `Za zimno (${t}°) — piknik przy kominku?`,
      },
      beach: {
        ok:   'Ciepło, słońce, brak opadów — idealny dzień na plażę.',
        cold: (t: number) => `Za zimno (${t}°) — może w sezonie.`,
        rain: 'Opady — plaża odpadła.',
        cloud: 'Zachmurzenie — bez słońca, ale bez opadów.',
      },
    },
  },

  details: {
    pressure:    'Ciśnienie',
    visibility:  'Widoczność',
    uvIndex:     'Indeks UV',
    dayLength:   'Długość dnia',
    sunrise:     'Wschód',
    sunset:      'Zachód',
    pm25:        'PM2.5',
    pm10:        'PM10',
    pollen:      'Pyłki',
    airQuality:  'Powietrze',
    tapHint:     'dotknij →',
  },

  menu: {
    forecast:    'Prognoza',
    forecast7d:  '7 dni',
    meteogram:   'Meteogram',
    icm:         'ICM',
    sport:       'Sport',
    sportSub:    'Rower',
    favorites:   'Ulubione',
    favoritesSub: 'miasta',
    history:     'Historia',
    historySub:  'pogody',
    share:       'Udostępnij',
    favoritesSection: 'ULUBIONE MIASTA',
  },

  forecast: {
    today:    'Dziś',
    tomorrow: 'Jutro',
    details:  'Szczegóły →',
    sections: 'Najbliższe dni',
  },

  comfort: {
    excellent: 'doskonały',
    good:      'dobry',
    moderate:  'umiarkowany',
    low:       'niska',
  },
} as const;

export type Strings = typeof pl;
