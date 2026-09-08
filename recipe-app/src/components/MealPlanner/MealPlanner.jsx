import PropTypes from 'prop-types';
import DayCard from './DayCard';
import { WEEK_DAYS, MEAL_SLOTS } from '../../utils/helpers';
import styles from './MealPlanner.module.css';

/**
 * MealPlanner
 * ---------------------------------------------------------------------------
 * The calendar grid container. It holds no state of its own: it maps WEEK_DAYS
 * into seven DayCards and forwards the two callbacks straight through. Keeping
 * it stateless is what allows the same grid to be rendered read-only elsewhere
 * later on by simply passing no-op handlers.
 */
const MealPlanner = ({ mealPlan, onSelectSlot, onClearSlot }) => {
  // Derived counts, computed rather than stored — storing them would introduce a
  // second source of truth that could fall out of sync with the plan object.
  const plannedCount = WEEK_DAYS.reduce(
    (total, day) => total + MEAL_SLOTS.filter((slot) => mealPlan[day][slot]).length,
    0,
  );
  const totalSlots = WEEK_DAYS.length * MEAL_SLOTS.length;
  const todayName = new Date().toLocaleDateString('en-GB', { weekday: 'long' });

  return (
    <div className={styles.planner}>
      <div className={styles.plannerSummary}>
        <p className={styles.summaryCount}>
          {plannedCount} of {totalSlots} meals planned
        </p>
        <div className={styles.summaryTrack}>
          {/* Dynamic inline declaration: completion width from computed state. */}
          <span
            className={styles.summaryFill}
            style={{ width: `${(plannedCount / totalSlots) * 100}%` }}
          />
        </div>
      </div>

      <div className={styles.weekGrid}>
        {WEEK_DAYS.map((day) => (
          <DayCard
            key={day}
            day={day}
            meals={mealPlan[day]}
            onSelectSlot={onSelectSlot}
            onClearSlot={onClearSlot}
            isToday={day === todayName}
          />
        ))}
      </div>
    </div>
  );
};

MealPlanner.propTypes = {
  mealPlan: PropTypes.objectOf(PropTypes.object).isRequired,
  onSelectSlot: PropTypes.func.isRequired,
  onClearSlot: PropTypes.func.isRequired,
};

export default MealPlanner;
