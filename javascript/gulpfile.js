

var js  = [
    '/var/www/html/client-laravel-api/javascript/ajax.js'
    ,'/var/www/html/client-laravel-api/javascript/valida_login.js'
    ,'/var/www/html/client-laravel-api/javascript/categoria.js'
    ,'/var/www/html/client-laravel-api/javascript/divisao.js'
    ,'/var/www/html/client-laravel-api/javascript/time.js'
    ,'/var/www/html/client-laravel-api/javascript/tecnico.js'		
];

// Núcleo do Gulp
var gulp = require('gulp');
var concat = require('gulp-concat');

// Transforma o javascript em formato ilegível para humanos
var uglify = require('gulp-uglify');
var minifyJS = require('gulp-minify');

gulp.task('concat', function() {
    return gulp.src(js) // Arquivos que serão carregados, veja variável 'js' no início
        .pipe(minifyJS())
        .pipe(concat('bundle.min.js'))  // Arquivo único de saída
        .pipe(uglify({ mangle: false })) // Transforma para formato ilegível
        .pipe(gulp.dest('/var/www/html/client-laravel-api/javascript/')); // pasta de destino do arquivo(s)
});

// Tarefa de monitoração caso algum arquivo seja modificado, deve ser executado e deixado aberto, comando "gulp watch".
gulp.task('watch', function() {
    gulp.watch(js, ['concat']);
});