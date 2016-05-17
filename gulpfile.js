var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var htmlmin = require('gulp-htmlmin');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var embedTemplates = require('gulp-angular-embed-templates');
var del = require('del');
var Q = require('q');

var source = __dirname + '/src/';
var output = __dirname +'/dist/';

// removes all files from 'dist'
gulp.task('clean', function() {
    var deferred = Q.defer();
    del(output + '**/*', {dot: true}, function() {
        deferred.resolve();
    });
    return deferred.promise;
});

// minify HTML templates
gulp.task('templates', function() {
    return gulp.src([source + 'js/templates/**/*.html'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(output + 'templates/'));
});

// minify javascript
gulp.task('js', function() {
    return gulp.src([source + 'js/angular-toolbar.js'])
        .pipe(embedTemplates())
        .pipe(uglify({mangle:false}))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(output));
});

// minify css
gulp.task('css', function() {
    return gulp.src([source + 'css/angular-toolbar.css'])
        .pipe(cssnano({discardComments: {removeAll: true}}))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(output));
});

// group all build tasks
gulp.task('build', gulpsync.sync([
    //'clean',
//    'templates', 
    'js', 
    'css'
]));