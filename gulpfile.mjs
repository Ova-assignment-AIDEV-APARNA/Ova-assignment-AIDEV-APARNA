import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cleanCSS from 'gulp-clean-css';
import browserSyncLib from 'browser-sync';
import * as del from 'del';


const sass = gulpSass(dartSass);
const browserSync = browserSyncLib.create();

// Clean task
export const clean = () => del.deleteAsync(['dist']);


// Style task
export function style() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

// HTML copy task
export function html() {
  return gulp.src('src/html/**/*.html')
    .pipe(gulp.dest('dist'));
}

// Build task
export const build = gulp.series(clean, gulp.parallel(style, html));

// Serve task
export function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });

  gulp.watch('src/scss/**/*.scss', style);
  gulp.watch('src/html/**/*.html', gulp.series(html, (done) => {
    browserSync.reload();
    done();
  }));
}

// Default task
export default gulp.series(build, serve);
