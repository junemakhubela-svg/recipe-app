import autoprefixer from 'autoprefixer';

// Autoprefixer runs over every CSS Module so vendor prefixes for grid,
// backdrop-filter and sticky positioning are generated at build time.
export default {
  plugins: [autoprefixer()],
};
