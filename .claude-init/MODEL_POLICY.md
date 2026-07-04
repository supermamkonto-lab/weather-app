# 🧠 MODEL POLICY — Rekomendacja Modelu wg Zadania

**Cel:** Kompromis między zużyciem tokenów a jakością — bez przepalania Opusa i bez fałszywej oszczędności na Haiku.

**Ważne:** Claude NIE przełącza modelu sam. Sesja tylko **rekomenduje** — przełączasz Ty komendą `/model <id>`.

---

## 🎯 DOMYŚLNY MODEL: Sonnet

**Sonnet** (`claude-sonnet-5` lub `claude-sonnet-4-6`) = codzienny driver tego projektu.

Powód: praca to głównie regułowe edycje `App.tsx`, dokumentacja i buildy. Design system jest spisany, więc model nie musi „domyślać się" reguł — premia z Opusa maleje.

---

## 📋 MAPA: ZADANIE → MODEL

| Typ zadania | Rekomendowany model | Komenda |
|-------------|--------------------|---------| 
| Edycje kodu TS/RN, rutynowy debug | **Sonnet** | `/model claude-sonnet-5` |
| Dokumentacja, status, bootstrap | **Sonnet** | `/model claude-sonnet-5` |
| Odpalanie `adb` / `gradlew` / grep | **Haiku** | `/model claude-haiku-4-5-20251001` |
| Redesign UI (osąd wizualny, Apple HIG) | **Opus** | `/model claude-opus-4-8` |
| Trudny debug / decyzje architektoniczne | **Opus** | `/model claude-opus-4-8` |

---

## 🔴 TRIGGERY ESKALACJI DO OPUS

Rekomenduj przełączenie na **Opus**, gdy zadanie zawiera:
- redesign / przeprojektowanie sekcji UI
- zmiany w design systemie (za zgodą MASTER ADMINA)
- debug błędu, którego przyczyna nie jest oczywista po 1 próbie
- decyzja architektoniczna lub kompromis techniczny

## 🟢 ZEJŚCIE Z OPUS NA SONNET

Po zakończeniu trudnego zadania rekomenduj powrót na **Sonnet**
(np. „Redesign gotowy — możesz wrócić na Sonnet do dalszych edycji").

## ⚠️ HAIKU — TYLKO MECHANICZNE

Nie używaj Haiku do logiki w `App.tsx` (2800 linii, jednoplikowa architektura —
ryzyko subtelnych błędów). Haiku wyłącznie do komend i prostych operacji tekstowych.

---

## 📌 KONKRETNIE — PHASE 7B

| Zadanie | Model |
|---------|-------|
| 🔴 minTemp (jednolinijkowa poprawka) | Sonnet |
| 🟠 redesign „Dziś godzinowo" | **Opus** |
| 🟠 redesign siatki „Szczegóły" | **Opus** |

---

## 🔗 JAK TO DZIAŁA

`AI_BOOT.md` → sekcja **MODEL RECOMMENDATION RULE** nakazuje sesji sprawdzić ten plik
przed każdym zadaniem i zarekomendować model, jeśli aktualny nie pasuje.

**Ostatnia aktualizacja:** 2026-06-22
