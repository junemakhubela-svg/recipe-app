import PropTypes from 'prop-types';
import { Volume2 } from 'lucide-react';
import styles from './AudioPlayer.module.css';

/**
 * AudioPlayer
 * ---------------------------------------------------------------------------
 * Inline narration player used for the cooking-tips guide on the dashboard and
 * for per-recipe audio walkthroughs. Like the video component it leans on the
 * native element and supplies a text fallback for unsupported browsers.
 */
const AudioPlayer = ({ src, label = 'Audio guide', compact = false }) => (
  <div className={`${styles.wrapper} ${compact ? styles.compact : ''}`}>
    <span className={styles.icon} aria-hidden="true">
      <Volume2 size={compact ? 16 : 18} />
    </span>
    <div className={styles.content}>
      <p className={styles.label}>{label}</p>
      <audio className={styles.audio} controls preload="none" aria-label={label}>
        <source src={src} type="audio/mpeg" />
        Audio playback is not supported here.{' '}
        <a href={src} download>
          Download the file
        </a>
        .
      </audio>
    </div>
  </div>
);

AudioPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  label: PropTypes.string,
  compact: PropTypes.bool,
};

export default AudioPlayer;
