'use strict';

/*================================
=            Preamble            =
================================*/

// Common deps
var gulp =   require('gulp'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify');

// Lets get the sass specific modules
var sass =    require('gulp-sass'),
    prefix =  require('autoprefixer-core'),
    postcss = require('gulp-postcss'),
    cssmin =  require('gulp-minify-css');

// Everything else
var del = require('del');

// Paths object gives compilation information
var paths = {
    styles: {
        files: './src/styles/*.scss',
        dir: './src/styles',
        dest: './build/css',
        watch: './src/styles/**/*.scss'
    }
};

// Meta info
var meta    = {};
meta.today  = new Date(),
meta.pkg    = require('./package.json');
meta.banner = '/*\n' +
              ' * Mosaic v' + meta.pkg.version + ' by ' + meta.pkg.author + '\n' +
              ' * ======================================================\n' +
              ' * Copyright: 2014 - ' + meta.today.getFullYear() + '\n' +
              ' * Licensed : ' + meta.pkg.license + '\n' +
              ' * Compiled : ' + meta.today + '\n' +
              '*/\n';

/*-----  End of Preamble  ------*/

/*==============================
=            Styles            =
==============================*/

gulp.task('styles', function(done) {

    // Middleware processors
    var processors = [
        prefix({ browsers: ['last 2 version'] })
    ];

    // Lets get our sass on
    var src = gulp.src(paths.styles.files);

    // Convert sass to css
    src.pipe(sass({
        style: 'expanded'
    })).

        // Log any errors
        on('error', notify.onError(function(err) {
            return '{' + err.plugin + '}: ' + err.message +
                    "\n\t\"" + err.fileName + "\": " + err.lineNumber;
        })).

        // Postcss batch process
        pipe(postcss(processors, { map: false })).

        // Add header
        pipe(header(meta.banner)).

        // Export file
        pipe(gulp.dest(paths.styles.dest)).

        // Start minification by adding suffix
        pipe(rename({ suffix: '.min' })).

        // Minify iy
        pipe(cssmin()).

        // Add header
        pipe(header(meta.banner)).

        // Export minified file
        pipe(gulp.dest(paths.styles.dest));

    return src;
});

gulp.task('styles:watch', function() {

    gulp.

        // Watch the style files and compile when they change
        watch(paths.styles.watch, ['styles']);
});

/*-----  End of Styles  ------*/

/*==================================
=            Main Tasks            =
==================================*/

gulp.task('clean', function(done) {
    del([paths.styles.dest], done);
});

gulp.task('build', ['styles']);

gulp.task('watch', ['styles:watch']);

gulp.task('default', ['build', 'watch']);

/*-----  End of Main Tasks  ------*/
