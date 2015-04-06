var gulp = require('gulp'),
    path = require('path'),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
    compass = require('gulp-compass');

gulp.task('connect', function () {
    connect.server({
        root: './markup/',
        port: 8000,
        livereload: true
    });
});

gulp.task('watch', function () {
    gulp.watch(['./markup/index.html'], ['html']);
    gulp.watch(['./markup/scss/main.scss'], ['scssStyle', 'html']);
});

gulp.task('html', function () {
    return gulp.src('./markup/index.html')
        .pipe(connect.reload());
});

gulp.task('scssStyle', function () {
    gulp.src('./markup/scss/main.scss')
        .pipe(compass({
            project: path.join(__dirname, './markup/'),
            css: 'css',
            sass: 'scss'
        }))
        .pipe(gulp.dest('./markup/css/'))
        .pipe(connect.reload())

});

gulp.task('url', function(){
    var options = {
        url: 'http://localhost:8000/',
        app: 'chrome'
    };
    gulp.src('./markup/index.html')
        .pipe(open('', options));
});

gulp.task('default', ['scssStyle', 'html', 'url', 'connect', 'watch']);