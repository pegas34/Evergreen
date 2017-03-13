(function() {
    var gulp      = require('gulp');
    var sass      = require('gulp-sass');
    var rimraf    = require('gulp-rimraf');
    var watch     = require('gulp-watch');
    var rename    = require('gulp-rename');
    var minify    = require('gulp-minify');
    var minifyCss = require('gulp-minify-css');

    var src = {
        styles : ['../scss/*.scss', '../scss/**/*.scss']
    };

    var dest = {
        styles: '../css'
    };

    gulp.task('clear-styles', function() {
        gulp.src(dest.styles + '../*', {read: false})
            .pipe(rimraf());
    });

    gulp.task('styles', ['clear-styles'], function() {
        gulp.src(src.styles)
            .pipe(sass())
            .pipe(minifyCss())
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest(dest.styles));
    });

    gulp.task('watch', ['styles'], function() {
        gulp.watch(src.styles, ['styles']);
    });

    gulp.task('default', ['styles', 'watch']);
})();
