import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

/**
 * Modal
 * ---------------------------------------------------------------------------
 * The second children-composition point. The modal owns the overlay, the focus
 * trap affordances and the close affordance; the caller owns whatever appears
 * inside it.
 *
 * The useEffect below wires an Escape listener and locks body scroll, then
 * returns a cleanup function. Without that cleanup the listener would stack on
 * every open and the page would stay unscrollable after the modal unmounts.
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Early return keeps the overlay out of the DOM entirely when closed, which is
  // cheaper than hiding it with CSS and keeps it out of the accessibility tree.
  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        /* Stopping propagation here means a click inside the panel never reaches
           the overlay handler above, so only clicks on the backdrop dismiss it. */
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
