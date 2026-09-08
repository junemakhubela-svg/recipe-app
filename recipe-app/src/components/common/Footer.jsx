import { Link } from 'react-router-dom';
import styles from './common.module.css';

/**
 * Footer
 * ---------------------------------------------------------------------------
 * The copyright year is evaluated at render time rather than hard-coded, so the
 * build never goes stale on 1 January.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Recipes', path: '/recipes' },
    { label: 'Meal planner', path: '/planner' },
    { label: 'Favourites', path: '/favorites' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p className={styles.footerMark}>Pantry &amp; Plan</p>

        {/* map() rendering routine: the footer link row is data-driven. */}
        <nav className={styles.footerNav} aria-label="Footer">
          {footerLinks.map((link) => (
            <Link key={link.path} to={link.path} className={styles.footerLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        <p className={styles.footerNote}>
          &copy; {currentYear} Pantry &amp; Plan. Built as a React capstone project.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
