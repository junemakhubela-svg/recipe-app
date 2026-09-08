import PropTypes from 'prop-types';
import styles from './VideoPlayer.module.css';

/**
 * VideoPlayer
 * ---------------------------------------------------------------------------
 * A thin structural wrapper around the native <video> element. The browser's own
 * controls are used deliberately: they are keyboard accessible, translated and
 * hardware-integrated for free, which a hand-rolled control bar would not be.
 *
 * The fallback children inside <video> render only in browsers that cannot play
 * the source at all, giving those users a direct download link instead.
 */
const VideoPlayer = ({ src, poster = '', title, onPlay = () => {} }) => (
  <figure className={styles.figure}>
    <video
      className={styles.video}
      controls
      preload="metadata"
      poster={poster}
      onPlay={onPlay}
      aria-label={`Technique video for ${title}`}
    >
      <source src={src} type="video/mp4" />
      <track kind="captions" srcLang="en" label="English captions" />
      Your browser cannot play embedded video.{' '}
      <a href={src} download>
        Download the clip instead
      </a>
      .
    </video>
    <figcaption className={styles.caption}>Watch the method: {title}</figcaption>
  </figure>
);

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  poster: PropTypes.string,
  title: PropTypes.string.isRequired,
  onPlay: PropTypes.func,
};

export default VideoPlayer;
