'use strict';

var gulp = require('gulp');
var karma = require('karma').server;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var eslint = require('gulp-eslint');
var jscs = require('gulp-jscs');

var packageName = require('./package.json').name;

/**
 * File patterns
 **/

// Root directory
var rootDirectory = path.resolve('./');

var sourceDirectory = path.join(rootDirectory, './src');
var testDirectory = path.join(rootDirectory, './test');
var distDirectory = path.join(rootDirectory, './dist');

var sourceFiles = [
    path.join(sourceDirectory, '/**/*.js'),
];

var sourceAndTestFiles = [].concat(sourceFiles).concat([
    path.join(testDirectory, '/**/*.js'),
]);

var lintFiles = [
    'gulpfile.js',
    // Karma configuration
    'karma-*.conf.js',
].concat(sourceAndTestFiles);

gulp.task('build', function () {
    gulp.src(sourceFiles)
        .pipe(plumber())
        .pipe(concat(`${ packageName }.js`))
        .pipe(gulp.dest(distDirectory))
        .pipe(uglify())
        .pipe(rename(`${ packageName }.min.js`))
        .pipe(gulp.dest(distDirectory));
});

/**
 * Process
 */
gulp.task('process-all', function (done) {
    runSequence('lint', 'test-src', 'build', done);
});

/**
 * Watch task
 */
gulp.task('watch', function () {
    gulp.watch(sourceAndTestFiles, ['process-all']);
});

/**
 * Validate source JavaScript
 */
gulp.task('lint', function () {
    return gulp.src(lintFiles)
        .pipe(plumber())
        .pipe(eslint())
        .pipe(jscs());
});

/**
 * Run test once and exit
 */
gulp.task('test-src', function (done) {
    karma.start({
        configFile: path.join(__dirname, 'karma-src.conf.js'),
        singleRun: true,
    }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-concatenated', function (done) {
    karma.start({
        configFile: path.join(__dirname, 'karma-dist-concatenated.conf.js'),
        singleRun: true,
    }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-minified', function (done) {
    karma.start({
        configFile: path.join(__dirname, 'karma-dist-minified.conf.js'),
        singleRun: true,
    }, done);
});

gulp.task('default', function () {
    runSequence('process-all', 'watch');
});
