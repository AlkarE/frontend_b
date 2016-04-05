'use strict';

const gulp         = require('gulp');
const	sass         = require('gulp-sass');
const	autoprefixer = require('gulp-autoprefixer');
const	minifycss    = require('gulp-minify-css');
const	rename       = require('gulp-rename');
const	bs           = require('browser-sync').create();
const	concat       = require('gulp-concat');
const	rigger 			 = require('gulp-rigger');
const	notify 			 = require('gulp-notify');
const	sourcemaps 	 = require('gulp-sourcemaps');
const	imagemin   	 = require('gulp-imagemin');
const	newer 	     = require('gulp-newer');
const	uglify       = require('gulp-uglifyjs');
const pngquant 		 = require('imagemin-pngquant');

gulp.task('browser-sync', ['styles', 'html'], function() {
		bs.init({
				server: {
						baseDir: "./app"
				},
				notify: false
		});
});

gulp.task('styles', function () {
	return gulp.src('src/sass/*.sass')
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	})
	.on('error', notify.onError())
	.pipe(autoprefixer({browsers: ['last 5 versions'], cascade: false}))
	.pipe(minifycss())
	.pipe(gulp.dest('app/css/'))
	.pipe(bs.stream());
});

// gulp.task('styles', function () {
// 	return gulp.src('src/sass/*.sass')
// 	.pipe(sourcemaps.init())
// 	.pipe(sass({
// 		includePaths: require('node-bourbon').includePaths
// 	}).on('error', sass.logError))
// 	.pipe(rename({suffix: '.min', prefix : ''}))
// 	.pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
// 	.pipe(minifycss())
// 	.pipe(sourcemaps.write()) // write({'.'})
// 	.pipe(gulp.dest('app/css'))
// 	.pipe(bs.stream());
// });


 gulp.task('image', function () {
			var imgSrc = "src/img/**/*.*",
					imgDst = "app/img/";
		gulp.src(imgSrc, {since: gulp.lastRun('image')})
				.pipe(newer(imgDst))
				.pipe(imagemin({
					progressive: true,
					svgoPlugins: [{removeViewBox: false}],
					use: [pngquant()],
					interlaced: true
				}))
				.pipe(gulp.dest(imgDst)); //И бросим в build
				
 });

gulp.task('html', function () {
		gulp.src('src/index.html') 
				.pipe(rigger())
				.pipe(gulp.dest('app/'));
});


gulp.task('script', function(){
	var src = 'src/js/main.js',
			dest = 'app/js/';
	return gulp.src(src)
				.pipe(rigger())
				.pipe(gulp.dest(dest));
	});


gulp.task('watch', function () {
	gulp.watch('src/sass/**/*.{sass,scss}', ['styles']);
	gulp.watch('src/**/*.html', ['html']);
	// gulp.watch('app/libs/**/*.js', ['scripts']);
	gulp.watch('app/js/*.js').on("change", bs.reload);
	gulp.watch('app/*.html').on('change', bs.reload);
});

gulp.task('default', ['browser-sync', 'watch']);
