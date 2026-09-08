import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar';
import Footer from './components/common/Footer';
import Loading from './components/UI/Loading';
import Button from './components/UI/Button';
import Home from './pages/Home';
import RecipesPage from './pages/RecipesPage';
import MealPlannerPage from './pages/MealPlannerPage';
import FavoritesPage from './pages/FavoritesPage';
import NotFound from './pages/NotFound';
import RecipeDetail from './components/Recipe/RecipeDetail';
import recipesData from './data/recipesData';
import { createEmptyMealPlan, WEEK_DAYS, MEAL_SLOTS } from './utils/helpers';
import './App.css';

// Storage keys are declared once as constants. A typo in a literal string used
// in two places would silently split reads from writes, which is the single most
// common localStorage bug.
const FAVORITES_KEY = 'pantry-plan:favorites';
const MEAL_PLAN_KEY = 'pantry-plan:meal-plan';

/**
 * App
 * ---------------------------------------------------------------------------
 * The application's only stateful owner of shared data. Two pieces of state are
 * lifted here because more than one branch of the tree reads them:
 *
 *   favorites — read by Navbar (badge), Home (statistic), RecipesPage (card
 *               state), FavoritesPage (the list itself) and RecipeDetail.
 *   mealPlan  — read by Home (planned count) and MealPlannerPage.
 *
 * Anything used by exactly one screen (search text, modal state, the ingredient
 * checklist) is deliberately left local to that screen. Lifting it here would
 * force unrelated re-renders and make App the dumping ground it is trying not
 * to be.
 */
const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [mealPlan, setMealPlan] = useState(createEmptyMealPlan);
  const [isHydrated, setIsHydrated] = useState(false);

  /**
   * useEffect context 1 — initial data mount.
   * The timeout stands in for a network request. Wrapping it in try/catch and
   * writing to loadError gives the UI a real error branch to render rather than
   * an assumption that data always arrives.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (!Array.isArray(recipesData) || recipesData.length === 0) {
          throw new Error('The recipe index came back empty.');
        }
        setRecipes(recipesData);
      } catch (error) {
        setLoadError(error.message);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  /**
   * useEffect context 2 — read persisted state from localStorage on first mount.
   * Every parse is guarded: a user with corrupted storage should get a working
   * empty app, not a white screen. The plan is merged onto a freshly generated
   * empty shape so a stored object from an older version that lacks a day or a
   * slot still produces a complete structure.
   */
  useEffect(() => {
    try {
      const storedFavorites = window.localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites);
        if (Array.isArray(parsed)) setFavorites(parsed);
      }

      const storedPlan = window.localStorage.getItem(MEAL_PLAN_KEY);
      if (storedPlan) {
        const parsed = JSON.parse(storedPlan);
        const rebuilt = createEmptyMealPlan();
        WEEK_DAYS.forEach((day) => {
          MEAL_SLOTS.forEach((slot) => {
            rebuilt[day][slot] = parsed?.[day]?.[slot] ?? null;
          });
        });
        setMealPlan(rebuilt);
      }
    } catch (error) {
      // Bad JSON is recoverable: fall through with the default empty state.
      window.localStorage.removeItem(FAVORITES_KEY);
      window.localStorage.removeItem(MEAL_PLAN_KEY);
    } finally {
      // The write effects below check this flag so they cannot fire before the
      // read has finished and overwrite good storage with empty defaults.
      setIsHydrated(true);
    }
  }, []);

  /**
   * useEffect context 3 — write state changes back to storage.
   * Two separate effects rather than one, so saving a favourite does not
   * needlessly rewrite the entire meal plan.
   */
  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(mealPlan));
  }, [mealPlan, isHydrated]);

  /* ----------------------------- Favourites API ---------------------------- */

  // Functional updates are used throughout so rapid successive clicks queue
  // correctly instead of all reading the same stale snapshot.
  const handleToggleFavorite = (recipeId) => {
    setFavorites((previous) =>
      previous.includes(recipeId)
        ? previous.filter((id) => id !== recipeId)
        : [...previous, recipeId],
    );
  };

  const handleClearFavorites = () => setFavorites([]);

  /* ----------------------------- Meal plan API ----------------------------- */

  /**
   * Assignment rebuilds the day rather than mutating it. React compares by
   * reference, so writing `mealPlan[day][slot] = recipe` would change the data
   * without ever triggering a re-render — the classic nested-state trap.
   */
  const handleAssignMeal = (day, slot, recipe) => {
    setMealPlan((previous) => ({
      ...previous,
      [day]: { ...previous[day], [slot]: recipe },
    }));
  };

  const handleClearMeal = (day, slot) => {
    setMealPlan((previous) => ({
      ...previous,
      [day]: { ...previous[day], [slot]: null },
    }));
  };

  const handleResetPlan = () => setMealPlan(createEmptyMealPlan());

  /**
   * Quick-add from a recipe card: drops the recipe into the first free slot of
   * the week so browsing can feed the planner without leaving the page.
   */
  const handleQuickAdd = (recipe) => {
    setMealPlan((previous) => {
      for (const day of WEEK_DAYS) {
        for (const slot of MEAL_SLOTS) {
          if (!previous[day][slot]) {
            return { ...previous, [day]: { ...previous[day], [slot]: recipe } };
          }
        }
      }
      return previous;
    });
  };

  // Derived value passed to the dashboard, computed once per render here so the
  // two consumers cannot disagree about the count.
  const plannedCount = WEEK_DAYS.reduce(
    (total, day) => total + MEAL_SLOTS.filter((slot) => mealPlan[day][slot]).length,
    0,
  );

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar favoritesCount={favorites.length} />

        <main className="app-main">
          {/* Three-way conditional: error takes priority over loading, and both
              take priority over the routed content. */}
          {loadError ? (
            <section className="app-error" role="alert">
              <h1 className="app-error-title">The recipe index did not load</h1>
              <p className="app-error-body">{loadError}</p>
              <Button onClick={() => window.location.reload()}>Try again</Button>
            </section>
          ) : isLoading ? (
            <Loading message="Loading the recipe index…" size={52} />
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    recipes={recipes}
                    favorites={favorites}
                    plannedCount={plannedCount}
                    onToggleFavorite={handleToggleFavorite}
                  />
                }
              />
              <Route
                path="/recipes"
                element={
                  <RecipesPage
                    recipes={recipes}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onQuickAdd={handleQuickAdd}
                  />
                }
              />
              <Route
                path="/recipes/:id"
                element={
                  <RecipeDetail
                    recipes={recipes}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                }
              />
              <Route
                path="/planner"
                element={
                  <MealPlannerPage
                    recipes={recipes}
                    mealPlan={mealPlan}
                    onAssignMeal={handleAssignMeal}
                    onClearMeal={handleClearMeal}
                    onResetPlan={handleResetPlan}
                  />
                }
              />
              <Route
                path="/favorites"
                element={
                  <FavoritesPage
                    recipes={recipes}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onClearFavorites={handleClearFavorites}
                  />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
