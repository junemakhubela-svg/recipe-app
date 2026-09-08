import PropTypes from 'prop-types';
import { Plus, Trash2 } from 'lucide-react';
import Card from '../UI/Card';
import { formatCookTime, getTotalTime, capitalizeText, MEAL_SLOTS } from '../../utils/helpers';
import styles from './MealPlanner.module.css';

/**
 * DayCard
 * ---------------------------------------------------------------------------
 * One column of the weekly grid, instantiated seven times by MealPlanner. It
 * receives only its own day's slice of the plan object, which means a change to
 * Tuesday re-renders Tuesday and leaves the other six columns untouched.
 *
 * Both handlers are callbacks from the page above: the card can request an
 * assignment or a removal, but it never mutates the plan itself.
 */
const DayCard = ({ day, meals, onSelectSlot, onClearSlot, isToday = false }) => (
  <Card as="section" className={`${styles.dayCard} ${isToday ? styles.today : ''}`}>
    <header className={styles.dayHeader}>
      <h3 className={styles.dayName}>{day}</h3>
      {/* Ternary: today's column is labelled rather than merely coloured, so the
          distinction survives for colour-blind and screen-reader users. */}
      {isToday ? <span className={styles.todayTag}>Today</span> : null}
    </header>

    <ul className={styles.slotList}>
      {MEAL_SLOTS.map((slot) => {
        const assigned = meals[slot];

        return (
          <li key={slot} className={styles.slot}>
            <p className={styles.slotLabel}>{capitalizeText(slot)}</p>

            {assigned ? (
              <div className={styles.assigned}>
                <img src={assigned.image} alt="" className={styles.assignedThumb} />
                <div className={styles.assignedText}>
                  <p className={styles.assignedTitle}>{assigned.title}</p>
                  <p className={styles.assignedTime}>
                    {formatCookTime(getTotalTime(assigned.prepTime, assigned.cookTime))}
                  </p>
                </div>
                <button
                  type="button"
                  className={styles.clearSlot}
                  onClick={() => onClearSlot(day, slot)}
                  aria-label={`Remove ${assigned.title} from ${day} ${slot}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={styles.emptySlot}
                onClick={() => onSelectSlot(day, slot)}
              >
                <Plus size={14} aria-hidden="true" />
                Add {slot}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  </Card>
);

DayCard.propTypes = {
  day: PropTypes.string.isRequired,
  meals: PropTypes.shape({
    breakfast: PropTypes.object,
    lunch: PropTypes.object,
    dinner: PropTypes.object,
  }).isRequired,
  onSelectSlot: PropTypes.func.isRequired,
  onClearSlot: PropTypes.func.isRequired,
  isToday: PropTypes.bool,
};

export default DayCard;
