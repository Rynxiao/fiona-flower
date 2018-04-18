var gulp = require('gulp');
var cleanCss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var uglifyjs = require('uglify-js');
var composer = require('gulp-uglify/composer');
var pump = require('pump');
var minify = composer(uglifyjs, console);
var minifyHTML = require('gulp-minify-html');
var rev = require('gulp-rev');
var revcollector = require('gulp-rev-collector');
var del = require('del');

gulp.task('clean:dist', function() {
    del([
        './index.html',
        'dist/**/*'
    ]);
});

gulp.task('auto-prefixer', function() {
    return gulp.src('styles/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('minify-css', function() {
    return gulp.src('dist/css/style.css')
        .pipe(cleanCss({ compatibility: 'ie8' }))
        // .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        // .pipe(rev.manifest('css-manifest.json'))
        // .pipe(gulp.dest('dist/rev'));
});

gulp.task('compress', function(cb) {
    var options = {};
    pump(
        [
            gulp.src('script/*.js'),
            minify(options),
            // rev(),
            gulp.dest('dist'),
            // rev.manifest('js-manifest.json'),
            // gulp.dest('dist/rev')
        ],
        cb
    );
});

gulp.task('minify-html', function() {
    var opts = { comments: false, spare:true };
    gulp.src(['./dist/rev/*.json', './dev/index.html'])
        // .pipe(revcollector({
        //     replaceReved: true,
        //     dirReplacements: {
        //         './css': 'dist/css',
        //         './js': 'dist'
        //     }
        // }))
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('./'));
});

gulp.task('build', ['clean:dist', 'auto-prefixer', 'minify-css', 'compress', 'minify-html'], function() {
    console.log('build success');
}); 