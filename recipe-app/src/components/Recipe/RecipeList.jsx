import PropTypes from 'prop-types';
import RecipeCard from './RecipeCard';
import Loading from '../UI/Loading';
import styles from './Recipe.module.css';

/**
 * RecipeList
 * ---------------------------------------------------------------------------
 * A pure layout processor: it maps an array into cards and handles the two
 * boundary states (loading and empty) so no page has to repeat that logic.
 *
 * Keys are the recipe id, never the array index — index keys would make React
 * reuse the wrong DOM nodes as soon as a filter reorders the list.
 */
const RecipeList = ({
  recipes,
  favorites = [],
  onToggleFavorite,
  onQuickAdd = null,
  isLoading = false,
  emptyMessage = 'No recipes match those filters yet.',
}) => {
  // Boundary state 1: the loading screen replaces the grid entirely.
  if (isLoading) {
    return <Loading message="Fetching the recipe index…" size={44} />;
  }

  // Boundary state 2: an empty collection gets an instruction, not a blank page.
  if (recipes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>Nothing here</p>
        <p className={styles.emptyBody}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <section className={styles.grid} aria-label="Recipe results">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={favorites.includes(recipe.id)}
          onToggleFavorite={onToggleFavorite}
          onQuickAdd={onQuickAdd}
        />
      ))}
    </section>
  );
};

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.object).isRequired,
  favorites: PropTypes.arrayOf(PropTypes.number),
  onToggleFavorite: PropTypes.func.isRequired,
  onQuickAdd: PropTypes.func,
  isLoading: PropTypes.bool,
  emptyMessage: PropTypes.string,
};

export default RecipeList;
