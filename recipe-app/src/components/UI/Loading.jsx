import PropTypes from 'prop-types';
import styles from './Loading.module.css';

/**
 * Loading
 * ---------------------------------------------------------------------------
 * One spinner reused by every asynchronous boundary in the app. The size prop is
 * applied through an inline style object rather than a set of CSS size classes,
 * because the value is a free number the caller chooses at runtime.
 */
const Loading = ({ message = 'Loading recipes…', size = 40 }) => (
  <div className={styles.wrapper} role="status" aria-live="polite">
    {/* Dynamic inline declarations 1 and 2: width and height are computed props. */}
    <span
      className={styles.spinner}
      style={{ width: `${size}px`, height: `${size}px`, borderWidth: `${size / 12}px` }}
    />
    <p className={styles.message}>{message}</p>
  </div>
);

Loading.propTypes = {
  message: PropTypes.string,
  size: PropTypes.number,
};

export default Loading;
