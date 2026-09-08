import PropTypes from 'prop-types';
import styles from './Card.module.css';

/**
 * Card
 * ---------------------------------------------------------------------------
 * A structural wrapper that knows nothing about its contents. Everything inside
 * arrives through the `children` prop, which is what lets one component serve
 * recipe tiles, statistics widgets and planner slots without branching.
 *
 * This is the first of the two required children-composition points; Modal.jsx
 * is the second.
 */
const Card = ({ children, elevated = false, as = 'article', className = '', onClick = null }) => {
  // Rendering to a variable capitalised tag lets the caller choose the correct
  // semantic element (article, section, li) while keeping one styling surface.
  const Element = as;

  // Conditional styling variation #2: elevation and any caller-supplied class
  // are merged onto the base class without overwriting it.
  const composed = `${styles.card} ${elevated ? styles.elevated : ''} ${className}`;

  return (
    <Element
      className={composed}
      onClick={onClick || undefined}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </Element>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  elevated: PropTypes.bool,
  as: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Card;
