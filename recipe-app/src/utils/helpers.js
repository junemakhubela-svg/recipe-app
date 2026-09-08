/**
 * helpers.js
 * ---------------------------------------------------------------------------
 * Pure transformation functions. "Pure" here is a hard rule, not a style note:
 * none of these touch component state, the DOM or localStorage, which is what
 * makes them safe to call directly inside a JSX tree during render.
 */

/**
 * Converts a raw minute count into a human-readable duration.
 * Rendering "1h 45m" instead of "105" is a presentation concern, so it lives
 * here rather than being baked into the data layer.
 */
export const formatCookTime = (minutes) => {
  if (typeof minutes !== 'number' || Number.isNaN(minutes) || minutes <= 0) {
    return 'No cooking';
  }
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours === 0) return `${remainder} min`;
  if (remainder === 0) return `${hours} hr`;
  return `${hours} hr ${remainder} min`;
};

/**
 * Title-cases a single word or short phrase. Used for difficulty labels, which
 * are stored lowercase in the database so that comparisons stay case-stable.
 */
export const capitalizeText = (text = '') => {
  if (typeof text !== 'string' || text.length === 0) return '';
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Total kitchen time for a recipe. Kept separate from formatCookTime so the raw
 * number remains available for sorting while the formatted string is display-only.
 */
export const getTotalTime = (prepTime = 0, cookTime = 0) => prepTime + cookTime;

/**
 * Derives the unique, alphabetically sorted values of one key across a recipe
 * array. The filter dropdowns are built from this rather than hard-coded lists,
 * so adding a new cuisine to the database updates the UI with no code change.
 */
export const getUniqueValues = (collection = [], key) => {
  const values = collection.map((item) => item[key]).filter(Boolean);
  return [...new Set(values)].sort();
};

/**
 * The single filtering algorithm for the whole application. Search and the three
 * dropdowns are combined here rather than chained through separate passes, which
 * keeps the behaviour identical everywhere it is used and avoids duplicating
 * comparison logic across pages.
 */
export const filterRecipes = (collection = [], { searchTerm = '', category = '', cuisine = '', difficulty = '' }) => {
  const query = searchTerm.trim().toLowerCase();

  return collection.filter((recipe) => {
    const matchesSearch =
      query.length === 0 ||
      recipe.title.toLowerCase().includes(query) ||
      recipe.cuisine.toLowerCase().includes(query) ||
      recipe.ingredients.some((line) => line.toLowerCase().includes(query));

    const matchesCategory = category === '' || recipe.category === category;
    const matchesCuisine = cuisine === '' || recipe.cuisine === cuisine;
    const matchesDifficulty = difficulty === '' || recipe.difficulty === difficulty;

    return matchesSearch && matchesCategory && matchesCuisine && matchesDifficulty;
  });
};

/**
 * Rounded mean of total cooking time. Returns 0 for an empty collection so the
 * statistics widgets never have to guard against NaN.
 */
export const calculateAverageTime = (collection = []) => {
  if (collection.length === 0) return 0;
  const total = collection.reduce(
    (sum, recipe) => sum + getTotalTime(recipe.prepTime, recipe.cookTime),
    0,
  );
  return Math.round(total / collection.length);
};

/**
 * Maps a difficulty string onto a palette token. Returned as a hex string so it
 * can be dropped straight into an inline style object for dynamic colouring.
 */
export const getDifficultyColor = (difficulty = 'easy') => {
  const palette = {
    easy: '#2E6B4F',
    medium: '#B8761F',
    hard: '#B33A22',
  };
  return palette[difficulty] || '#6B7169';
};

/**
 * Time-of-day greeting for the dashboard. Reads the clock at call time, which is
 * acceptable in render because the value is cosmetic and never persisted.
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

/** The seven planner columns, declared once and reused by every planner component. */
export const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/** The three meal slots each day exposes. */
export const MEAL_SLOTS = ['breakfast', 'lunch', 'dinner'];

/**
 * Builds the empty nested shape the weekly planner starts from:
 * { Monday: { breakfast: null, lunch: null, dinner: null }, ... }
 * Generated rather than written out so the two constants above stay the single
 * source of truth for the planner's dimensions.
 */
export const createEmptyMealPlan = () =>
  WEEK_DAYS.reduce((plan, day) => {
    plan[day] = MEAL_SLOTS.reduce((slots, slot) => {
      slots[slot] = null;
      return slots;
    }, {});
    return plan;
  }, {});
