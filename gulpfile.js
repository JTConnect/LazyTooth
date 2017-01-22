/// <binding ProjectOpened='watch' />
//Include gulp
var gulp = require('gulp');

//Include plugins 
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var sourcemaps = require('gulp-sourcemaps');
var Server = require('karma').Server;
var rev = require('gulp-rev');


var scripts = ['app/*js',
      'app/core/directives/*js',
      'app/core/services/authentication/*js',
      'app/core/services/date/*js',
      'app/core/services/httpRequest/*js',
      'app/core/services/lookup/*js',
      'app/core/services/utilities/*js',
      'app/core/services/log/*js',
      'app/core/startup/*js',
      'app/core/templates/modal/*js',
      'app/main/*js',
      'app/main/application/*js',
      'app/main/dashboard/*js',
      'app/main/flightBoard/*js',
      'app/main/index/*js',
      'app/main/login/*js',
      'app/main/simpleLogin/*js',
      'app/main/rootLayout/*js',
      'app/main/report/*js',
      'app/main/report/reservations/*js'];

var allMinified = 'dist/js/allminified.min.js';
var jsLocation = 'dist/js';



//Default Task 
gulp.task('default', ['lint', 'minify']);

//production task
gulp.task('signetProductionTransformation', ['lint', 'production', 'minify', 'resetProdToDev'], function () {
});

//production task
gulp.task('signetStageTransformation', ['lint', 'stage', 'minify', 'resetStageToDev'], function () {
});

//Watch files for changes 
gulp.task('watch', function () {
    gulp.watch(scripts, ['lint', 'minify']);

});



//Lint task (Linting javascript code)
gulp.task('lint', function () {
    return gulp.src(scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//Concatenate & minify js 
gulp.task('minify', function () {
    return gulp.src(scripts)
        .pipe(sourcemaps.init())
        .pipe(concat('allfiles.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('allminified.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('sourcemap'))
        .pipe(gulp.dest('dist/js'))
});


/* Run Test */
gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});




//Concatenate & minify js & version the final minified file. 
//gulp.task('minifyRev', function () {
//    return gulp.src(scripts)
//        .pipe(sourcemaps.init())
//        .pipe(concat('allfiles.js'))
//        .pipe(gulp.dest('dist/js'))
//        .pipe(rename('allminified.min.js'))
//        .pipe(rev())
//        .pipe(uglify())
//        .pipe(sourcemaps.write('sourcemap'))
//        .pipe(gulp.dest('dist/js'))
//        .pipe(rev.manifest({ merge: true }))
//        .pipe(gulp.dest('dist/js'))
//});



/*gulp.task('watch', function () {
    gulp.watch(scripts, ['lint', 'minifyRev']);

}); */



