var gulp 		= require('gulp');
var gutil 		= require('gulp-util');
var runSequence = require('run-sequence');

var nodemon 	= require('gulp-nodemon');
var express 	= require('express');
var app 		= express();

var eslint      = require('gulp-eslint');
var mocha       = require('gulp-spawn-mocha');


var SCRIPTS = 'server/**/*.js';
var TESTS   = 'tests/**/*.js';

var onError = function(err) {  
	gutil.beep();
	console.log(err);
};



gulp.task('watch', function() {
    gulp.watch([SCRIPTS, TESTS], ['eslint']);
});



gulp.task('eslint', function() {
    return gulp
   		.src([SCRIPTS, TESTS])
        .pipe(eslint())
        .pipe(eslint.format());
});



gulp.task('tests', function() {
	return gulp
	    .src(TESTS, { read: false })
	    .pipe(mocha({

			env: {
		   		'NODE_ENV': 'test'
			}
	    }));
});



gulp.task('serve', function() {
	nodemon({
		script: 'server.js'
	});

	gutil.log('Listening.');
});



gulp.task('default', function() {
	runSequence(
		'eslint',
		'watch',
		'serve'
	);
});
