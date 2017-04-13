var gulp = require('gulp'),
sass = require('gulp-sass'),
concat = require('gulp-concat'),
rename = require('gulp-rename'),
livereload = require('gulp-livereload');


var paths = {
    js: {
        src:['./www/app/**/*.js'],
        dest:'./www/assets/js'
    },
    scss: {
        src: './www/app/app.scss',
        watch:['./www/app/**/*.scss'],
        dest:'./www/assets/css'
    },
    html: {
        src:['./www/index.html', './www/app/**/*.html']
    }
}

gulp.task('default', ['watch'], function() {});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(paths.scss.watch, ['sass']);
    gulp.watch(paths.js.src, ['scripts']);
    gulp.watch(paths.html.src, ['html']);
});


gulp.task('sass', function () {
    return gulp.src(paths.scss.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('index.css'))
        .pipe(gulp.dest(paths.scss.dest))
        .pipe(livereload());
});

gulp.task('html', function () {
  return gulp.src(paths.html.src)
    .pipe(livereload());

});

gulp.task('scripts', function() {  
    return gulp.src(paths.js.src)
        .pipe(concat('index.js'))
        .pipe(gulp.dest(paths.js.dest))
        
        .pipe(gulp.dest(paths.js.dest))
        .pipe(livereload());
});

