
const gulp = require('gulp');
const eslint = require('gulp-eslint');

const glob = ['src/**/*.js','!node_modules/**'];

gulp.task('watch', () => {
  gulp.start('lint');
  gulp.watch(glob, ['lint']);
});

gulp.task('lint', () => {
  return gulp.src(glob)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['watch']);
