var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('default', ['build'], function () {
    gulp.watch('./src/**', ['build']);
});

gulp.task('build', function(){
    return gulp.src('./src/**/*.js')
        .pipe(babel({optional:'runtime', stage: 1, loose: 'all'}))
        .pipe(gulp.dest('./lib/'));
});