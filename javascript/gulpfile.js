var gulp         = require('gulp');
var concat       = require('gulp-concat');
var streamqueue  = require('streamqueue');
var gutil        = require('gulp-util');

gulp.task('concatena', function() {
    return streamqueue({ objectMode: true },
        gulp.src('/var/www/client-laravel-api/javascript/util.js'),
        gulp.src('/var/www/client-laravel-api/javascript/login.js'),
        gulp.src('/var/www/client-laravel-api/javascript/categoria.js'),
        gulp.src('/var/www/client-laravel-api/javascript/divisao.js'),
        gulp.src('/var/www/client-laravel-api/javascript/time.js'),
        gulp.src('/var/www/client-laravel-api/javascript/tecnico.js')
    )
    .pipe(concat('scripts.js'))
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest('/var/www/client-laravel-api/javascript'));
});