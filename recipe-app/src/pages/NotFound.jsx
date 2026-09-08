import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CookingPot } from 'lucide-react';
import Button from '../components/UI/Button';
import styles from './Pages.module.css';

/**
 * NotFound
 * ---------------------------------------------------------------------------
 * The catch-all route. It offers two different escapes because the two failure
 * modes differ: navigate(-1) helps someone who mistyped from inside the app,
 * while the Home link helps someone who arrived on a dead external link and has
 * no history to go back to.
 */
const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <main className={styles.notFound}>
      <span className={styles.notFoundIcon} aria-hidden="true">
        <CookingPot size={56} />
      </span>

      <p className={styles.notFoundCode}>404</p>
      <h1 className={styles.notFoundTitle}>Nothing is cooking at this address</h1>
      <p className={styles.notFoundBody}>
        There is no page at <code className={styles.pathCode}>{location.pathname}</code>. Check the
        link, or start again from the recipe index.
      </p>

      <div className={styles.notFoundActions}>
        <Button onClick={() => navigate('/recipes')}>Go to recipes</Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back one step
        </Button>
      </div>

      <Link to="/" className={styles.notFoundLink}>
        Return to the dashboard
      </Link>
    </main>
  );
};

export default NotFound;
