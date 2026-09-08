import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Clock, Users, Heart, CalendarPlus } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { formatCookTime, capitalizeText, getTotalTime, getDifficultyColor } from '../../utils/helpers';
import styles from './Recipe.module.css';

/**
 * RecipeCard
 * ---------------------------------------------------------------------------
 * The presentation layer for a single recipe. It receives the whole recipe
 * object plus two callbacks and renders nesting depth four:
 *   RecipeList -> RecipeCard -> Card -> Button
 *
 * The component is deliberately stateless. Whether a recipe is favourited is
 * passed in as a boolean rather than computed here, so a hundred cards on screen
 * all read from the same array in App and can never disagree with each other.
 */
const RecipeCard = ({
  recipe,
  isFavorite = false,
  onToggleFavorite,
  onQuickAdd = null,
  showActions = true,
}) => {
  // Explicit nested destructuring keeps the JSX below free of `recipe.` noise.
  const { id, title, category, cuisine, difficulty, cookTime, prepTime, servings, image } = recipe;

  const totalTime = getTotalTime(prepTime, cookTime);

  /**
   * The favourite button lives inside a <Link>, so the click must be stopped
   * before the router picks it up — otherwise every favourite toggle would also
   * navigate to the detail page.
   */
  const handleFavoriteClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onToggleFavorite(id);
  };

  const handleQuickAdd = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (onQuickAdd) onQuickAdd(recipe);
  };

  return (
    <Card elevated className={styles.card}>
      <Link to={`/recipes/${id}`} className={styles.cardLink}>
        <div className={styles.thumb}>
          <img src={image} alt={title} className={styles.thumbImage} loading="lazy" />
          {/* Dynamic inline declaration 3: the badge colour is derived from data. */}
          <span
            className={styles.difficultyBadge}
            style={{ backgroundColor: getDifficultyColor(difficulty) }}
          >
            {capitalizeText(difficulty)}
          </span>
        </div>

        <div className={styles.cardBody}>
          <p className={styles.cardMeta}>
            {category} · {cuisine}
          </p>
          <h3 className={styles.cardTitle}>{title}</h3>

          <ul className={styles.statRow}>
            <li>
              <Clock size={14} aria-hidden="true" />
              {/* Helper invoked directly inside the JSX tree. */}
              {formatCookTime(totalTime)}
            </li>
            <li>
              <Users size={14} aria-hidden="true" />
              {servings} {servings === 1 ? 'serving' : 'servings'}
            </li>
          </ul>
        </div>
      </Link>

      {/* Actions are optional so the same card can be reused inside the planner. */}
      {showActions && (
        <div className={styles.cardActions}>
          <Button
            variant={isFavorite ? 'danger' : 'secondary'}
            onClick={handleFavoriteClick}
            icon={<Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />}
          >
            {isFavorite ? 'Saved' : 'Save'}
          </Button>

          {onQuickAdd && (
            <Button variant="secondary" onClick={handleQuickAdd} icon={<CalendarPlus size={15} />}>
              Plan
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    cuisine: PropTypes.string.isRequired,
    difficulty: PropTypes.oneOf(['easy', 'medium', 'hard']).isRequired,
    cookTime: PropTypes.number.isRequired,
    prepTime: PropTypes.number.isRequired,
    servings: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  isFavorite: PropTypes.bool,
  onToggleFavorite: PropTypes.func.isRequired,
  onQuickAdd: PropTypes.func,
  showActions: PropTypes.bool,
};

export default RecipeCard;
