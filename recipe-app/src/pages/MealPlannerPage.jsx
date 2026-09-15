import { useState } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/common/Header';
import MealPlanner from '../components/MealPlanner/MealPlanner';
import Modal from '../components/UI/Modal';
import Button from '../components/UI/Button';
import SearchBar from '../components/UI/SearchBar';
import { capitalizeText, formatCookTime, getTotalTime, filterRecipes } from '../utils/helpers';
import plannerStyles from '../components/MealPlanner/MealPlanner.module.css';
import styles from './Pages.module.css';

/**
 * MealPlannerPage
 * ---------------------------------------------------------------------------
 * Owns the interaction around the weekly plan; the plan object itself lives in
 * App.jsx because the navbar and dashboard also read from it.
 *
 * The `activeSlot` state holds a small { day, slot } pair rather than two
 * separate variables. Keeping them together makes it impossible to end up with
 * a day and no slot — the two values are only ever meaningful as a pair.
 */
const MealPlannerPage = ({ recipes, mealPlan, onAssignMeal, onClearMeal, onResetPlan }) => {
  const [activeSlot, setActiveSlot] = useState(null);
  const [pickerSearch, setPickerSearch] = useState('');

  const isModalOpen = activeSlot !== null;

  const handleSelectSlot = (day, slot) => {
    setActiveSlot({ day, slot });
    setPickerSearch('');
  };

  const handleCloseModal = () => {
    setActiveSlot(null);
    setPickerSearch('');
  };

  /**
   * Assigning closes the dialog in the same tick as the update. Doing both here
   * rather than inside App keeps the parent's reducer-style handler free of any
   * knowledge that a modal exists at all.
   */
  const handleChooseRecipe = (recipe) => {
    onAssignMeal(activeSlot.day, activeSlot.slot, recipe);
    handleCloseModal();
  };

  // The picker reuses the shared filtering algorithm, biased toward recipes that
  // suit the slot being filled: breakfast slots surface breakfast recipes first.
  const pickerResults = filterRecipes(recipes, { searchTerm: pickerSearch });
  const sortedPickerResults = isModalOpen
    ? [...pickerResults].sort((a, b) => {
      const slotName = capitalizeText(activeSlot.slot);
      const aMatch = a.category === slotName ? 0 : 1;
      const bMatch = b.category === slotName ? 0 : 1;
      return aMatch - bMatch;
    })
    : [];

  return (
    <div className={styles.page}>
      <Header
        eyebrow="Plan"
        title="Your week"
        subtitle="Go ahead and fill any slot to your week with the meal of your choosing. Happy planning and Happy cooking."
      />

      <div className={styles.plannerToolbar}>
        <Button variant="danger" onClick={onResetPlan}>
          Clear the whole week
        </Button>
      </div>

      <MealPlanner
        mealPlan={mealPlan}
        onSelectSlot={handleSelectSlot}
        onClearSlot={onClearMeal}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          isModalOpen
            ? `Choose ${activeSlot.slot} for ${activeSlot.day}`
            : 'Choose a recipe'
        }
      >
        {/* Children of Modal: the picker is composed in, not built into Modal. */}
        <div className={styles.pickerSearch}>
          <SearchBar
            value={pickerSearch}
            onSearchChange={setPickerSearch}
            onSearchSubmit={() => { }}
            placeholder="Filter this list…"
          />
        </div>

        {sortedPickerResults.length === 0 ? (
          <p className={styles.pickerEmpty}>
            No recipe matches that. Clear the box to see the full list again.
          </p>
        ) : (
          <ul className={plannerStyles.pickerList}>
            {sortedPickerResults.map((recipe) => (
              <li key={recipe.id}>
                <button
                  type="button"
                  className={plannerStyles.pickerRow}
                  onClick={() => handleChooseRecipe(recipe)}
                >
                  <img src={recipe.image} alt="" className={plannerStyles.pickerThumb} />
                  <span>
                    <span className={plannerStyles.pickerTitle}>{recipe.title}</span>
                    <span className={plannerStyles.pickerMeta}>
                      {recipe.category} ·{' '}
                      {formatCookTime(getTotalTime(recipe.prepTime, recipe.cookTime))}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
};

MealPlannerPage.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.object).isRequired,
  mealPlan: PropTypes.objectOf(PropTypes.object).isRequired,
  onAssignMeal: PropTypes.func.isRequired,
  onClearMeal: PropTypes.func.isRequired,
  onResetPlan: PropTypes.func.isRequired,
};

export default MealPlannerPage;
