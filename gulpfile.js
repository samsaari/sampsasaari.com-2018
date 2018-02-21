const gulp = require('gulp');
	del = require('del'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	gulpsync = require('gulp-sync')(gulp),
	gutil = require('gulp-util'),
	flatten = require('gulp-flatten'),
	browserSync = require('browser-sync').create(),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	sourcemaps = require('gulp-sourcemaps'),
	notifier = require('node-notifier');


gulp.task('browserSync', function () {
	browserSync.init({
		server: {
			baseDir: 'src'
		},
		browser: 'google chrome'
	})
});

// CSS
gulp.task('sass', function () {
	return gulp.src('./src/**/*.scss')
		.pipe(sass.sync({
			includePaths: ['node_modules/']
		}).on('error', function (err) {
			notifier.notify({
				'title': 'Compile Error',
				'message': err.message,
				'sound': true
			});
			gutil.log(gutil.colors.red('ERROR:', err.message));
			this.emit('end');
		}))
		.pipe(autoprefixer({
			browsers: ['last 30 versions']
		}))
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(concat('main.css'))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// JavaScript
gulp.task('browserify', function() {
	return browserify('./src/js/main.js')
	  .transform("babelify", {presets: ["es2015"]})
	  .bundle()
	  .on('error', function(err) {
		gutil.log(gutil.colors.red('ERROR:', err.message));
		notifier.notify({
		  'title': 'Compile Error',
		  'message': err.message,
		  'sound': true
		});
		this.emit('end');
	  })
	  .pipe(source('main.js'))
	  .pipe(buffer())
	  .pipe(uglify())
	  .pipe(gulp.dest('./dist/js/'))
	  .pipe(browserSync.stream());
  });

  gulp.task('images', function() {
	return gulp.src('./src/img/**/*.+(jpg|jpeg|svg|png|gif)')
	  .pipe(imagemin({
		  progressive: true,
		  svgoPlugins: [{removeViewBox: false}],
		  use: [pngquant()]
	  }))
	  .pipe(flatten())
	  .pipe(gulp.dest('./dist/img/'))
  });

gulp.task('watch', ['browserSync', 'sass', 'browserify'], function () {
	gulp.watch('src/**/*.scss', ['sass']);
	gulp.watch('src/*.html', browserSync.reload);
	gulp.watch('src/js/**/*.js', browserSync.reload);
});