var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('build', function(){
    return gulp.src('./src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./lib/'));
});

gulp.task('default', ['build'], function () {
    gulp.watch('./src/**', ['build']);
});