import PropTypes from 'prop-types';
import { SlidersHorizontal } from 'lucide-react';
import Button from '../UI/Button';
import { capitalizeText } from '../../utils/helpers';
import styles from './Recipe.module.css';

/**
 * RecipeFilter
 * ---------------------------------------------------------------------------
 * Three controlled <select> elements driven by one generic change handler. Each
 * select carries its own `name` attribute, so the handler reads the field name
 * off the event target instead of needing three near-identical callbacks.
 *
 * The option lists are passed in as arrays derived from the live data, which is
 * why a new cuisine in recipesData.js appears here with no edit to this file.
 */
const RecipeFilter = ({
  filters,
  categories,
  cuisines,
  difficulties,
  onFilterChange,
  onClearFilters,
  resultCount = 0,
}) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onFilterChange(name, value);
  };

  // A single boolean drives both the clear button's disabled state and the
  // summary line below, so the two can never contradict each other.
  const hasActiveFilters =
    filters.category !== '' || filters.cuisine !== '' || filters.difficulty !== '';

  return (
    <section className={styles.filterBar} aria-label="Filter recipes">
      <div className={styles.filterHead}>
        <SlidersHorizontal size={17} aria-hidden="true" />
        <span>Refine</span>
      </div>

      <div className={styles.filterFields}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Category</span>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Cuisine</span>
          <select
            name="cuisine"
            value={filters.cuisine}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">All cuisines</option>
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Difficulty</span>
          <select
            name="difficulty"
            value={filters.difficulty}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">Any difficulty</option>
            {difficulties.map((level) => (
              <option key={level} value={level}>
                {/* Second in-JSX helper invocation: raw data, formatted at the edge. */}
                {capitalizeText(level)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.filterFoot}>
        <p className={styles.resultCount}>
          {resultCount} {resultCount === 1 ? 'recipe' : 'recipes'}
        </p>
        <Button variant="secondary" onClick={onClearFilters} disabled={!hasActiveFilters}>
          Clear all
        </Button>
      </div>
    </section>
  );
};

RecipeFilter.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.string.isRequired,
    cuisine: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
  }).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  cuisines: PropTypes.arrayOf(PropTypes.string).isRequired,
  difficulties: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  resultCount: PropTypes.number,
};

export default RecipeFilter;
