var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
var url = require('url'); // https://www.npmjs.org/package/url
var proxy = require('proxy-middleware'); // https://www.npmjs.org/package/proxy-middleware
var browserSync = require('browser-sync'); // https://www.npmjs.org/package/browser-sync

var paths =  {
    filetypes: ['./**/*.js',
						    './**/*.xml',
						    './**/*.css',
					 	    '!./node_modules/**/*']
};



// gulp.task('lint', function() {
// 	return gulp.src('.**/*.js')
// 		.pipe(plugins.jshint())
// 		.pipe(plugins.jshint.reporter('default'));
// 	});
//
// gulp.task('watch', function() {
// 	gulp.watch('./**/*.js', ['lint']);
// });



// browser-sync task for starting the server.
gulp.task('browser-sync', function() {
    var proxyOptions = url.parse('http://services.odata.org');
    proxyOptions.route = '/odata_org';

    var proxyOptions2 = url.parse('https://sapes1.sapdevcenter.com');
    proxyOptions2.route = '/sapes1';

    browserSync({
        open: true,
        port: 3000,
        server: {
            baseDir: "./",
            // middleware: [proxy(proxyOptions)]
            middleware: [ proxy(proxyOptions),
                          proxy(proxyOptions2)]
        },
				// add file paths directly to browsersync
				files: paths.filetypes
    });
});

// Stream the style changes to the page
gulp.task('reload-paths', function() {
    gulp.src(paths.filetypes)
        .pipe(browserSync.reload({stream: true}));
});

// watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(paths.filetypes, ['reload-paths']);
});

gulp.task('default', ['browser-sync']);
// gulp.task('default', ['browser-sync', 'lint', 'watch']);
