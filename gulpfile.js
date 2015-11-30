var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('build', function(){
    return gulp.src('./src/**/*.js')
        .pipe(babel({optional:'runtime', stage: 0, loose: 'all'}))
        .pipe(gulp.dest('./lib/'));
});

gulp.task('default', ['build'], function () {
    gulp.watch('./src/**', ['build']);
});