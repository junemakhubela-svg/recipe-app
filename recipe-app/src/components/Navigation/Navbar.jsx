import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Menu, X, Heart } from 'lucide-react';
import styles from './Navbar.module.css';

/**
 * Navbar
 * ---------------------------------------------------------------------------
 * Sticky global navigation. Two things are worth calling out:
 *
 * 1. The active link is derived from useLocation() rather than tracked in state.
 *    Route position is already application state owned by the router, so
 *    mirroring it locally would create two sources of truth that can drift.
 *
 * 2. favoritesCount is passed down from App. The navbar never reads the
 *    favourites array itself, which keeps it usable in isolation and testable
 *    with a single number.
 */
const Navbar = ({ favoritesCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Recipes', path: '/recipes' },
    { label: 'Meal Planner', path: '/planner' },
    { label: 'Favorites', path: '/favorites' },
  ];

  const toggleMenu = () => setIsMenuOpen((previous) => !previous);
  const closeMenu = () => setIsMenuOpen(false);

  /**
   * Exact match for the index route, prefix match for everything else, so that
   * /recipes/8 still highlights the Recipes tab.
   */
  const isLinkActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className={styles.navbar} aria-label="Primary">
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={closeMenu}>
          Pantry <span className={styles.brandMark}>&amp;</span> Plan
        </Link>

        <button
          type="button"
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {/* Ternary #1: the toggle icon reflects the open state. */}
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <ul
          id="primary-navigation"
          className={`${styles.links} ${isMenuOpen ? styles.linksOpen : ''}`}
        >
          {/* map() rendering routine over the link definitions. */}
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                onClick={closeMenu}
                className={`${styles.link} ${isLinkActive(link.path) ? styles.active : ''}`}
                aria-current={isLinkActive(link.path) ? 'page' : undefined}
              >
                {link.label}
                {/* The badge is rendered only when there is something to count. */}
                {link.path === '/favorites' && favoritesCount > 0 && (
                  <span className={styles.badge}>
                    <Heart size={11} fill="currentColor" />
                    {favoritesCount}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  favoritesCount: PropTypes.number,
};

export default Navbar;
