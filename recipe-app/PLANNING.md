# Planning Document — Pantry & Plan

## Component Hierarchy Breakdown

```
App (BrowserRouter, global state owner)
├── Navbar ──────────────── reads favoritesCount, useLocation
├── main / Routes
│   ├── Home
│   │   ├── Card × 4 (statistics)
│   │   ├── RecipeCard × 3 ──> Card ──> Button
│   │   └── AudioPlayer
│   ├── RecipesPage
│   │   ├── Header
│   │   ├── SearchBar
│   │   ├── RecipeFilter ──> Button
│   │   └── RecipeList
│   │       └── RecipeCard ──> Card ──> Button      [depth 5]
│   ├── RecipeDetail
│   │   ├── VideoPlayer
│   │   ├── AudioPlayer
│   │   └── Button
│   ├── MealPlannerPage
│   │   ├── MealPlanner
│   │   │   └── DayCard × 7 ──> Card                [depth 5]
│   │   └── Modal ──> SearchBar
│   ├── FavoritesPage ──> RecipeList ──> RecipeCard
│   └── NotFound ──> Button
└── Footer
```

## Data Flow Summary

Data moves **down** as props and **up** as callbacks. `App` holds `recipes`,
`favorites` and `mealPlan` and passes slices downward: `Navbar` gets a number,
`RecipeList` gets an array, `DayCard` gets one day's object. No child reaches
sideways for data.

Children signal **up** by invoking functions they were handed. `RecipeCard`
calls `onToggleFavorite(id)`; `RecipeList` forwards that callback untouched;
`DayCard` calls `onSelectSlot(day, slot)`. Only `App` writes to shared state, so
every screen sees one consistent value.

## Key Components

- **App** — routing, global state, localStorage synchronisation.
- **Navbar** — sticky navigation, active-route highlighting, favourites badge.
- **RecipeList** — maps arrays to cards; owns the loading and empty branches.
- **RecipeCard** — stateless presentation of one recipe plus two actions.
- **RecipeDetail** — URL-driven single recipe with video, audio and checklist.
- **MealPlanner / DayCard** — the seven-column week grid and its three slots.
- **Card / Modal** — structural wrappers composed entirely via `children`.

## Props and State Management Strategy

State is lifted only when shared. `favorites` and `mealPlan` live in `App`
because four and two screens read them respectively. Everything used by one
screen stays local: search text and filters in `RecipesPage`, modal target in
`MealPlannerPage`, checklist in `RecipeDetail`, menu toggle in `Navbar`.

Nested plan updates rebuild the changed day rather than mutating it, since React
compares by reference. Three `useEffect` contexts handle the lifecycle: mount
the recipe data, read storage once on first mount, then write on every mutation.
A `isHydrated` flag gates the write effects so empty defaults can never
overwrite good stored data on the first render.
