import PropTypes from 'prop-types';
import styles from './Button.module.css';

/**
 * Button
 * ---------------------------------------------------------------------------
 * A single presentational button used everywhere in the app. Variants are
 * resolved with a template literal against the CSS Module object rather than a
 * chain of conditionals, so adding a fourth variant means adding one CSS class
 * and nothing else.
 *
 * Default parameter values are declared in the destructuring pattern itself,
 * which means the component still renders correctly when a caller passes only
 * `children`.
 */
const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  onClick = () => {},
  disabled = false,
  fullWidth = false,
  icon = null,
}) => {
  // Conditional styling variation #1: the width modifier is appended only when
  // requested, leaving the base class list untouched otherwise.
  const classNames = `${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''}`;

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {/* Logical && boundary: the icon slot collapses entirely when unused. */}
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
};

export default Button;
