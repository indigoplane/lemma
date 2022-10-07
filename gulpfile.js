var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');


var paths = {
    scripts: ["parse.js","pmain.js","utils.js","observable.js","components.js","rules.js","validateRules.js","conditions.js","actions.js","rule.js"],
    dist: 'dist/'

};
//Clean task
gulp.task('clean', function () {
    return del(['dist/**/*', '!dist']);
});
gulp.task('scripts', function () {
    return gulp.src(paths.scripts)
        .pipe(concat('ruleslib.js'))
        .pipe(gulp.dest(paths.dist))
        .pipe(rename('ruleslib.min.js'))
        .pipe(gulp.dest(paths.dist));
});
