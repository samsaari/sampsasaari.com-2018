const gulp = require('gulp'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	concat = require('gulp-concat'),
	plumber = require('gulp-plumber'),
	browserSync = require('browser-sync').create();

gulp.task('browserSync', function () {
	browserSync.init({
		server: {
			baseDir: 'src'
		},
		browser: 'google chrome'
	})
});

gulp.task('sass', function () {
	return gulp.src('./src/**/*.scss')
		.pipe(plumber())
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(concat('main.css'))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('uglify', function () {
	gulp.src('./src/js/**/*.js')
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'))
})

gulp.task('images', function () {
	return gulp.src('./src/img/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(cache(imagemin({
			interlaced: true
		})))
		.pipe(gulp.dest('dist/img'))
});

gulp.task('watch', ['browserSync'], function () {
	gulp.watch('./src/**/*.scss', ['sass']);
	gulp.watch('./src/*.html', browserSync.reload);
	gulp.watch('./src/js/**/*.js', browserSync.reload);
});