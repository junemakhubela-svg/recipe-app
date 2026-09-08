import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/common/Header';
import SearchBar from '../components/UI/SearchBar';
import RecipeFilter from '../components/Recipe/RecipeFilter';
import RecipeList from '../components/Recipe/RecipeList';
import Button from '../components/UI/Button';
import { filterRecipes, getUniqueValues } from '../utils/helpers';
import styles from './Pages.module.css';

/**
 * RecipesPage
 * ---------------------------------------------------------------------------
 * The browsing hub, and the clearest example of sibling-to-sibling data flow in
 * the app: SearchBar and RecipeFilter are siblings that never speak to each
 * other. Both report upward to this page, which owns `searchTerm` and `filters`
 * and hands the combined result down to RecipeList — their third sibling.
 *
 * The filtered array is derived during render rather than stored in state. A
 * second copy in state would need its own effect to stay in sync and would be
 * one render behind the inputs that produced it.
 */
const RecipesPage = ({ recipes, favorites, onToggleFavorite, onQuickAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: '', cuisine: '', difficulty: '' });
  const [isFiltering, setIsFiltering] = useState(false);
  const [notice, setNotice] = useState('');

  // Option lists are derived from live data so the dropdowns never drift from
  // what is actually in the database.
  const categories = getUniqueValues(recipes, 'category');
  const cuisines = getUniqueValues(recipes, 'cuisine');
  const difficulties = getUniqueValues(recipes, 'difficulty');

  const visibleRecipes = filterRecipes(recipes, { searchTerm, ...filters });

  /**
   * useEffect context 2: a reactive effect keyed to the query inputs. It shows a
   * brief spinner so a large result change reads as a deliberate update rather
   * than a flicker. The cleanup cancels the timer if the user keeps typing,
   * which is what stops the spinner from stuttering on every keystroke.
   */
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 220);
    return () => clearTimeout(timer);
  }, [searchTerm, filters]);

  /**
   * One handler for all three dropdowns. The computed property name is what lets
   * a single function update whichever field reported the change.
   */
  const handleFilterChange = (field, value) => {
    setFilters((previous) => ({ ...previous, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ category: '', cuisine: '', difficulty: '' });
    setNotice('');
  };

  const handleSearchSubmit = (term) => {
    // The list is already live-filtered, so submitting only confirms the action.
    setNotice(term.trim().length === 0 ? '' : `Showing matches for “${term.trim()}”.`);
  };

  const handleResetAll = () => {
    setSearchTerm('');
    handleClearFilters();
  };

  const hasQuery = searchTerm.trim().length > 0;

  return (
    <div className={styles.page}>
      <Header
        eyebrow="Browse"
        title="All recipes"
        subtitle="Search by name, cuisine or a single ingredient you need to use up."
      />

      <div className={styles.searchRow}>
        <SearchBar
          value={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
          placeholder="Try “lamb”, “Thai” or “feta”…"
        />
      </div>

      {/* Logical && boundary: the confirmation line exists only after a submit. */}
      {notice && <p className={styles.notice}>{notice}</p>}

      <RecipeFilter
        filters={filters}
        categories={categories}
        cuisines={cuisines}
        difficulties={difficulties}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        resultCount={visibleRecipes.length}
      />

      <RecipeList
        recipes={visibleRecipes}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onQuickAdd={onQuickAdd}
        isLoading={isFiltering}
        emptyMessage={
          hasQuery
            ? `Nothing matches “${searchTerm.trim()}”. Try a shorter word or clear the filters.`
            : 'Those filters exclude everything. Loosen one to see results.'
        }
      />

      {/* The reset shortcut appears only when there is genuinely nothing to show. */}
      {visibleRecipes.length === 0 && !isFiltering && (
        <div className={styles.resetRow}>
          <Button variant="secondary" onClick={handleResetAll}>
            Reset search and filters
          </Button>
        </div>
      )}
    </div>
  );
};

RecipesPage.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.object).isRequired,
  favorites: PropTypes.arrayOf(PropTypes.number).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onQuickAdd: PropTypes.func.isRequired,
};

export default RecipesPage;
