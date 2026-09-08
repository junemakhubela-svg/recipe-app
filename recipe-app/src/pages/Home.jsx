import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Utensils, Clock, Heart, CalendarCheck } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import RecipeCard from '../components/Recipe/RecipeCard';
import AudioPlayer from '../components/Media/AudioPlayer';
import Loading from '../components/UI/Loading';
import {
  getGreeting,
  calculateAverageTime,
  formatCookTime,
  getUniqueValues,
} from '../utils/helpers';
import styles from './Pages.module.css';

/**
 * Home
 * ---------------------------------------------------------------------------
 * The landing dashboard. It summarises the collection, offers three quick
 * recommendations and hosts the global cooking-tips audio guide.
 *
 * The greeting is stored in state and set once on mount rather than recomputed
 * on every render, so the wording cannot flip mid-session if the user happens to
 * be cooking across midday.
 */
const Home = ({ recipes, favorites, plannedCount, onToggleFavorite }) => {
  const [greeting, setGreeting] = useState('');
  const [isPreparing, setIsPreparing] = useState(true);
  const navigate = useNavigate();

  // useEffect context 1: run-once mount work, with a timer that is cleared on
  // unmount so a fast navigation away cannot call setState on a dead component.
  useEffect(() => {
    setGreeting(getGreeting());
    const timer = setTimeout(() => setIsPreparing(false), 350);
    return () => clearTimeout(timer);
  }, []);

  // Three recommendations, chosen as the quickest recipes so the panel stays
  // useful rather than random. Sorting a copy leaves the source array intact.
  const quickPicks = [...recipes]
    .sort((a, b) => a.prepTime + a.cookTime - (b.prepTime + b.cookTime))
    .slice(0, 3);

  const stats = [
    {
      key: 'total',
      label: 'Recipes in the index',
      value: recipes.length,
      icon: <Utensils size={18} />,
    },
    {
      key: 'average',
      label: 'Average time per recipe',
      value: formatCookTime(calculateAverageTime(recipes)),
      icon: <Clock size={18} />,
    },
    {
      key: 'favorites',
      label: 'Saved to favourites',
      value: favorites.length,
      icon: <Heart size={18} />,
    },
    {
      key: 'planned',
      label: 'Meals planned this week',
      value: plannedCount,
      icon: <CalendarCheck size={18} />,
    },
  ];

  if (isPreparing) {
    return <Loading message="Setting the table…" size={48} />;
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.heroGreeting}>{greeting}</p>
        <h1 className={styles.heroTitle}>
          Cook something you already have the time for.
        </h1>
        <p className={styles.heroBody}>
          Browse {recipes.length} recipes across {getUniqueValues(recipes, 'cuisine').length}{' '}
          cuisines, watch the method before you start, and drop what you choose straight into a
          seven-day plan.
        </p>
        <div className={styles.heroActions}>
          <Button onClick={() => navigate('/recipes')}>Browse recipes</Button>
          <Button variant="secondary" onClick={() => navigate('/planner')}>
            Plan the week
          </Button>
        </div>
      </section>

      <section className={styles.statGrid} aria-label="Collection summary">
        {/* map() routine: each statistic reuses the shared Card wrapper. */}
        {stats.map((stat) => (
          <Card key={stat.key} as="div" className={styles.statCard}>
            <span className={styles.statIcon}>{stat.icon}</span>
            <p className={styles.statValue}>{stat.value}</p>
            <p className={styles.statLabel}>{stat.label}</p>
          </Card>
        ))}
      </section>

      <section className={styles.homeSection} aria-label="Quick recommendations">
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionHeading}>Fastest on the list</h2>
          <Button variant="secondary" onClick={() => navigate('/recipes')}>
            See all
          </Button>
        </div>

        <div className={styles.pickGrid}>
          {quickPicks.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={favorites.includes(recipe.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      <section className={styles.homeSection} aria-label="Cooking tips guide">
        <h2 className={styles.sectionHeading}>Before you start</h2>
        <p className={styles.sectionBody}>
          A four-minute guide to reading a recipe properly: what to weigh out first, when to trust
          the timing and when to trust the pan.
        </p>
        <AudioPlayer src="/audio/cooking-tips.mp3" label="Kitchen basics, in four minutes" />
      </section>
    </div>
  );
};

Home.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.object).isRequired,
  favorites: PropTypes.arrayOf(PropTypes.number).isRequired,
  plannedCount: PropTypes.number.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
};

export default Home;
