const gulp = require('gulp'),
      sass = require('sass'),
      browsersync = require('browser-sync').create();

gulp.task('sass', function() {
  return gulp.src('./src/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'src'
    },
  })
});

gulp.task('watch', function(){
  gulp.watch('./src/**/*.scss', ['sass']);
});