## A co my tu mamy?

W pliku **task.ts** mamy funkcje która pobiera drzewo kategorii pewnych produktów z zewnętrznego źródła, odpowiednio je mapuje i zwraca.
Dodatkowo funkcja **categoryTree** zawiera błąd, polegający na niewłaściwym sortowaniu kategorii drugiego poziomu (szczegóły w wymaganiach do zadania).

W pliku **mockedApi.ts** znajduje się fejkowe źródło danych i tam nie ma potrzeby nic zmieniać.

## Co należy zrobić?

1. Refactor funkcji categoryTree. Wszystkie chwyty dozwolone. Dzielenie funkcji, wynoszenie zależności, zmiana parametrów wejściowych, etc...
2. Źródło danych (funkcja getCategories) powinna być przekazywana jako zależność. W idealnym scenariuszu categoryTree opiera się na abstrakcji i nie jest świadoma co konretnie zostanie jej przekazane
3. Poprawiony zostanie bug opisany poniżej.
4. W osobnym pliku przeprowadzony zostanie dowód (w postaci kodu) który jednoznacznie pokaże poprawność działania funkcji categoryTree.

> Wszystkie potrzebne paczki są już w tym repozytorium, aczkolwiek można użyć dowolnych.

## Na czym polega bug?

Dla każdej pobieranej kategorii, w parametrze **Title** moze być zawarta opcjonalna numeracja która powinna definiować kolejność zwracaną przez funkcje (w polu **order**).
Na ten moment sortowanie działa nieprawidłowo, należy to poprawić.

> Dla wejścia znajdującego się w pliku **input.ts**, w tym momencie funkcja zwraca takie wyjście jak w pliku **currentResult.ts**. Oczekiwane wyjście zawarte jest w pliku **correctResult.ts**

## Jak używać tego repo

Najważniejsza komenda dla tego zadania to **npm run test** - buduje ona TSa i odpala testy. Ta komenda się wywali jeśli kod nie przejdzie eslinta i prettiera. Zatem żeby sprawdzić swoje zadanie należy najpierw pozbyć się błędów z eslinta i odpalić **fix:prettier**.

---

## Rozwiązanie

### 1. Refaktoryzacja funkcji categoryTree

Funkcja została podzielona na mniejsze, jednozadaniowe komponenty:

- `extractOrder`: Odpowiada za wydobycie numeru porządkowego z tytułu
- `mapCategory`: Transformuje surowe dane w oczekiwaną strukturę
- `determineHomeVisibility`: Zarządza regułami wyświetlania na stronie głównej

Główna funkcja `categoryTree` jest teraz czytelna i łatwa w utrzymaniu.

### 2. Przekazywanie źródła danych jako zależności

Utworzono abstrakcję w postaci interfejsu:

```typescript
interface CategoryProvider {
  getCategories(): Promise<{ data: CategorySource[] }>;
}
```

Funkcja `categoryTree` przyjmuje teraz obiekt implementujący ten interfejs jako argument.

Dzięki temu:

- Funkcja `categoryTree` nie jest związana z konkretną implementacją
- Łatwo można podmienić źródło danych (np. na potrzeby testów)
- Zachowujemy zasadę odwrócenia zależności (DIP)

### 3. Naprawa błędu sortowania

Problem został rozwiązany poprzez:

- Poprawne wydobywanie numerów porządkowych z tytułów
- Implementację sortowania na każdym poziomie drzewa kategorii

### 4. Dowód poprawności

Utworzono testy jednostkowe sprawdzające:

- Sortowanie kategorii pierwszego poziomu
- Sortowanie kategorii drugiego poziomu
- Zgodność z oczekiwanym wynikiem
- Obsługę przypadków brzegowych
