import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../components/common/Header';
import RecipeList from '../components/Recipe/RecipeList';
import Button from '../components/UI/Button';
import { getTotalTime } from '../utils/helpers';
import styles from './Pages.module.css';

/**
 * FavoritesPage
 * ---------------------------------------------------------------------------
 * Resolves the favourites array of ids into full recipe objects. Storing only
 * ids in App is what makes this necessary, and it is the right trade: if a
 * recipe's title or time changes in the database, the favourite reflects it
 * immediately because nothing was copied.
 */
const FavoritesPage = ({ recipes, favorites, onToggleFavorite, onClearFavorites }) => {
  const [sortOrder, setSortOrder] = useState('recent');
  const navigate = useNavigate();

  // Preserve the order ids were saved in, then apply the chosen sort to a copy.
  const favoriteRecipes = favorites
    .map((favoriteId) => recipes.find((recipe) => recipe.id === favoriteId))
    .filter(Boolean);

  const sortedFavorites = [...favoriteRecipes].sort((a, b) => {
    if (sortOrder === 'title') return a.title.localeCompare(b.title);
    if (sortOrder === 'time') {
      return getTotalTime(a.prepTime, a.cookTime) - getTotalTime(b.prepTime, b.cookTime);
    }
    return 0;
  });

  const handleSortChange = (event) => setSortOrder(event.target.value);

  return (
    <div className={styles.page}>
      <Header
        eyebrow="Saved"
        title="Favourites"
        subtitle="Everything you have saved, kept in this browser between visits."
      />

      {/* Ternary: an empty collection gets an invitation to act, not a bare grid. */}
      {favoriteRecipes.length === 0 ? (
        <div className={styles.emptyPanel}>
          <h2 className={styles.emptyHeading}>No favourites yet</h2>
          <p className={styles.emptyText}>
            Save a recipe from any card or detail page and it will wait for you here.
          </p>
          <Button onClick={() => navigate('/recipes')}>Find something to cook</Button>
        </div>
      ) : (
        <>
          <div className={styles.favoritesToolbar}>
            <label className={styles.sortField}>
              <span className={styles.sortLabel}>Sort by</span>
              <select value={sortOrder} onChange={handleSortChange} className={styles.sortSelect}>
                <option value="recent">Recently saved</option>
                <option value="title">Title, A to Z</option>
                <option value="time">Shortest first</option>
              </select>
            </label>

            <Button variant="danger" onClick={onClearFavorites}>
              Remove all
            </Button>
          </div>

          <RecipeList
            recipes={sortedFavorites}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        </>
      )}
    </div>
  );
};

FavoritesPage.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.object).isRequired,
  favorites: PropTypes.arrayOf(PropTypes.number).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onClearFavorites: PropTypes.func.isRequired,
};

export default FavoritesPage;
