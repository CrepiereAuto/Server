var gulp = require('gulp');
  copy = require('gulp-copy');
  replace = require('gulp-replace');
  install = require('gulp-install');
  sequence = require('gulp-sequence');
  concat = require('gulp-concat');
  coffee = require('gulp-coffee');
  electronPckg = require('gulp-atom-electron');
  zip = require('gulp-zip');
  git = require('gulp-git');
  del = require('delete');
  changed = require('gulp-changed');
  stylus = require('gulp-stylus');
  flatten = require('gulp-flatten');
var folder =  '../temp/SoftPI/';
var folder2 = '../temp/AppPI/';
var output = '../file/';

gulp.task('default', ['soft']);

gulp.task('soft', function(cb) {
  sequence('git:soft', ['modules', 'assets', 'app:coffee', 'app:styl', 'app:html', 'main'], 'compile', 'delete:soft', cb);
});

gulp.task('git:soft', function (cb) {
  git.clone('https://github.com/Hougo13/SoftPI.git', {args: './'+folder}, function(err) {
    if (err) throw err;
    cb();
  });
});

gulp.task('assets', function() {
  return gulp.src(folder+'src/assets/**/*.*')
    .pipe(copy(folder+'build', {
      prefix: 5
    }));
});

gulp.task('app:coffee', function() {
  return gulp.src(folder+'src/app/**/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(concat('app.js'))
    .pipe(gulp.dest(folder+'build/js/'));
});

gulp.task('app:styl', function() {
  return gulp.src(folder+'src/app/**/*.styl')
    .pipe(stylus())
    .pipe(concat('app.css'))
    .pipe(gulp.dest(folder+'build/css/'));
});

gulp.task('app:html', function() {
  return gulp.src(folder+'src/app/**/*.html')
    .pipe(flatten())
    .pipe(gulp.dest(folder+'build/views/'));
});

gulp.task('main', function() {
  return gulp.src(folder+'src/main.coffee')
    .pipe(coffee({
      bare: true
    }))
    .pipe(gulp.dest(folder+'build'));
});

gulp.task('package', function() {
  return gulp.src(folder+'package.json')
    .pipe(replace('build/js/main.js', 'js/main.js'))
    .pipe(gulp.dest(folder+'build'));
});

gulp.task('modules', ['package'], function() {
  return gulp.src(folder+'build/package.json')
    .pipe(install({
      production: true
    }));
});

gulp.task('compile', function() {
  return gulp.src(folder+'build/**')
    .pipe(electronPckg({
      version: '0.36.10',
      platform: 'linux',
      arch: 'arm'
    }))
    .pipe(zip('SoftPI.zip'))
    .pipe(gulp.dest(output));
});

gulp.task('delete:soft', function () {
  return del.promise([folder], {force: true});
});

gulp.task('server', function (cb) {
  sequence('git:server', 'install', cb);
});

gulp.task('git:server', function (cb) {
  git.pull('origin', 'master', {args: '--rebase'}, function (err) {
    if (err) {
      console.log(err);
    }
    cb();
  });
});

gulp.task('install', function () {
  return gulp.src('../package.json')
    .pipe(changed('../temp/'))
    .pipe(install())
    .pipe(gulp.dest('../temp'));
});

module.exports = gulp;
