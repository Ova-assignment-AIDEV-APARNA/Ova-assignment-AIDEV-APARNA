const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const del =require('del');
gulp.task('clean', () => del(['dist']));

gulp.task('clean', () => del(['dist']));

// Compile styles
gulp.task('style', () => {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'));
});

// Copy HTML
gulp.task('html', () => {
  return gulp.src('src/html/**/*.html')
    .pipe(gulp.dest('dist'));
});

// Build task for Netlify
gulp.task('build', gulp.series('clean', 'style', 'html'));

gulp.task('default', gulp.series('style', 'serve'));

// Compile SCSS into CSS
function style() {
  return gulp.src('src/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

// Serve and watch
function serve() {
  browserSync.init({
    server: {
      baseDir: './src/html'
    }
  });

  gulp.watch('src/scss/**/*.scss', style);
  gulp.watch('src/html/**/*.html').on('change', browserSync.reload);
}

exports.style = style;
exports.serve = gulp.series(style, serve);
exports.default = exports.serve;

