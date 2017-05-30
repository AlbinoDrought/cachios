const gulp = require('gulp');
const browserify = require('gulp-browserify');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const karma = require('karma');
const mocha = require('gulp-mocha');

const paths = {
  imdex: './src/index.js',
  tests: './test/**/.js',
};

gulp.task('test', () => {
  return gulp.src(paths.tests)
    .pipe(mocha());
});

