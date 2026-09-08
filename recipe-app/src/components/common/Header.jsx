import PropTypes from 'prop-types';
import styles from './common.module.css';

/**
 * Header
 * ---------------------------------------------------------------------------
 * The page-level heading block that sits under the navigation bar. It is kept
 * separate from Navbar so that pages can set their own title and standfirst
 * without touching global navigation.
 */
const Header = ({ title, subtitle = '', eyebrow = '' }) => (
  <header className={styles.pageHeader}>
    {/* Logical && boundary: the eyebrow line is omitted when not supplied. */}
    {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
    <h1 className={styles.pageTitle}>{title}</h1>
    {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
  </header>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  eyebrow: PropTypes.string,
};

export default Header;
