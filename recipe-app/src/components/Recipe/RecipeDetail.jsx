import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Clock, Users, ChefHat, Heart, ArrowLeft } from 'lucide-react';
import Button from '../UI/Button';
import VideoPlayer from '../Media/VideoPlayer';
import AudioPlayer from '../Media/AudioPlayer';
import {
  formatCookTime,
  capitalizeText,
  getTotalTime,
  getDifficultyColor,
} from '../../utils/helpers';
import styles from './Recipe.module.css';

/**
 * RecipeDetail
 * ---------------------------------------------------------------------------
 * The single-recipe view. It reads the id from the URL rather than from a prop,
 * which is what makes a detail page shareable and reloadable: the URL alone is
 * enough to reconstruct the screen.
 *
 * Local state here is deliberately narrow — a Set of ticked ingredients. That is
 * throwaway UI state with no meaning outside this screen, so lifting it to App
 * would be over-engineering.
 */
const RecipeDetail = ({ recipes, favorites, onToggleFavorite }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checkedIngredients, setCheckedIngredients] = useState([]);

  // Route params arrive as strings, so the id is coerced before comparison.
  const recipe = recipes.find((item) => item.id === Number(id));

  // Boundary state 3: a bad id is an application-level error, not an empty list.
  if (!recipe) {
    return (
      <div className={styles.errorState}>
        <h2 className={styles.errorTitle}>That recipe is not in the index</h2>
        <p className={styles.errorBody}>
          Recipe #{id} does not exist. It may have been removed, or the link may be mistyped.
        </p>
        <Button onClick={() => navigate('/recipes')}>Back to all recipes</Button>
      </div>
    );
  }

  const { title, category, cuisine, difficulty, cookTime, prepTime, servings } = recipe;
  const isFavorite = favorites.includes(recipe.id);
  const totalTime = getTotalTime(prepTime, cookTime);

  /**
   * Toggling by value rather than index keeps the checklist correct even though
   * the ingredient array itself is never reordered — and it makes the state
   * readable when logged.
   */
  const toggleIngredient = (line) => {
    setCheckedIngredients((previous) =>
      previous.includes(line)
        ? previous.filter((entry) => entry !== line)
        : [...previous, line],
    );
  };

  const progress = Math.round((checkedIngredients.length / recipe.ingredients.length) * 100);

  return (
    <article className={styles.detail}>
      <Link to="/recipes" className={styles.backLink}>
        <ArrowLeft size={16} aria-hidden="true" /> All recipes
      </Link>

      <header className={styles.detailHead}>
        <p className={styles.detailMeta}>
          {category} · {cuisine}
        </p>
        <h1 className={styles.detailTitle}>{title}</h1>

        <ul className={styles.detailStats}>
          <li>
            <Clock size={16} aria-hidden="true" />
            <span>
              <strong>{formatCookTime(totalTime)}</strong> total
            </span>
          </li>
          <li>
            <Users size={16} aria-hidden="true" />
            <span>
              <strong>{servings}</strong> servings
            </span>
          </li>
          <li>
            <ChefHat size={16} aria-hidden="true" />
            {/* Difficulty text is coloured inline from the same helper the cards use. */}
            <span style={{ color: getDifficultyColor(difficulty), fontWeight: 600 }}>
              {capitalizeText(difficulty)}
            </span>
          </li>
        </ul>

        <div className={styles.detailActions}>
          <Button
            variant={isFavorite ? 'danger' : 'primary'}
            onClick={() => onToggleFavorite(recipe.id)}
            icon={<Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />}
          >
            {isFavorite ? 'Remove from favourites' : 'Save to favourites'}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/planner')}>
            Open meal planner
          </Button>
        </div>
      </header>

      <div className={styles.detailGrid}>
        <section className={styles.detailMedia} aria-label="Technique video">
          <VideoPlayer src={recipe.videoUrl} poster={recipe.image} title={title} />
          <AudioPlayer src={recipe.audioUrl} label={`Spoken walkthrough for ${title}`} compact />
        </section>

        <section className={styles.ingredientPanel} aria-label="Ingredients">
          <h2 className={styles.sectionTitle}>Ingredients</h2>

          <div className={styles.progressTrack}>
            {/* Dynamic inline declaration: the fill width tracks checklist state. */}
            <span className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <p className={styles.progressLabel}>
            {checkedIngredients.length} of {recipe.ingredients.length} gathered
          </p>

          <ul className={styles.ingredientList}>
            {recipe.ingredients.map((line) => {
              const isChecked = checkedIngredients.includes(line);
              return (
                <li key={line}>
                  <label className={styles.ingredientRow}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleIngredient(line)}
                    />
                    {/* Conditional inline style: ticked lines fade and strike through. */}
                    <span
                      style={{
                        textDecoration: isChecked ? 'line-through' : 'none',
                        opacity: isChecked ? 0.5 : 1,
                      }}
                    >
                      {line}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>

        <section className={styles.methodPanel} aria-label="Method">
          <h2 className={styles.sectionTitle}>Method</h2>
          {/* An ordered list is genuinely a sequence, so numbering is semantic here. */}
          <ol className={styles.methodList}>
            {recipe.instructions.map((step, index) => (
              <li key={step} className={styles.methodStep}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
};

RecipeDetail.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.object).isRequired,
  favorites: PropTypes.arrayOf(PropTypes.number).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
};

export default RecipeDetail;
