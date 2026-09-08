import { useState } from 'react';
import PropTypes from 'prop-types';
import { Search, X } from 'lucide-react';
import styles from './SearchBar.module.css';

/**
 * SearchBar
 * ---------------------------------------------------------------------------
 * Fully controlled input. The text itself lives in the parent page so that the
 * filtering pipeline has a single owner; this component owns only the transient
 * focus flag, which nothing outside it needs to read.
 *
 * onSubmit is handled at the form level so that pressing Enter and clicking the
 * button run identical code paths.
 */
const SearchBar = ({ value, onSearchChange, onSearchSubmit, placeholder = 'Search recipes…' }) => {
  const [isFocused, setIsFocused] = useState(false);

  // Upward signalling: the child never filters anything, it just reports the
  // new string to whoever owns the state.
  const handleChange = (event) => onSearchChange(event.target.value);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearchSubmit(value);
  };

  return (
    <form
      className={`${styles.wrapper} ${isFocused ? styles.focused : ''}`}
      onSubmit={handleSubmit}
      role="search"
    >
      <Search size={18} className={styles.leadIcon} aria-hidden="true" />
      <input
        type="search"
        className={styles.input}
        value={value}
        placeholder={placeholder}
        aria-label="Search recipes by name, cuisine or ingredient"
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {/* The clear control only exists while there is something to clear. */}
      {value.length > 0 && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => onSearchChange('')}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onSearchSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchBar;
