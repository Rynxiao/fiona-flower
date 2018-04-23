var gulp = require('gulp');
var cleanCss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');

var uglify = require('gulp-uglify');
var uglifyjs = require('uglify-js');
var composer = require('gulp-uglify/composer');
var pump = require('pump');
var minify = composer(uglifyjs, console);

var minifyHTML = require('gulp-minify-html');
var rev = require('gulp-rev');
var revcollector = require('gulp-rev-collector');
var del = require('del');
var imagemin = require('gulp-imagemin');
var tap = require('gulp-tap');

gulp.task('clean:dist', function() {
    del([
        './index.html',
        'dist/**/*'
    ]);
});

gulp.task('minify-css', ['clean:dist'], function() {
    return gulp.src('styles/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(cleanCss({ compatibility: 'ie8' }))
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest('css-manifest.json'))
        .pipe(gulp.dest('dist/rev'));
});

gulp.task('compress', function(cb) {
    return gulp.src('script/*.js')
        .pipe(uglify({ mangle: true }))
        .pipe(rev())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest('js-manifest.json'))
        .pipe(gulp.dest('dist/rev'));
});

gulp.task('imagemin', function() {  
  return gulp.src('images/**/*.{png,jpg,gif,jpeg}')  
    .pipe(imagemin({  
        optimizationLevel: 5,   //类型：Number  默认：3  取值范围：0-7（优化等级）  
        progressive: true,      //类型：Boolean 默认：false 无损压缩jpg图片  
        interlaced: true,       //类型：Boolean 默认：false 隔行扫描gif进行渲染  
        multipass: true         //类型：Boolean 默认：false 多次优化svg直到完全优化  
    }))  
    .pipe(gulp.dest('dist/images/'));  
}); 

gulp.task('format-json', ['minify-css', 'compress'], function() {
    return gulp.src('./dist/rev/*.json')
        .pipe(tap(function(file) {
            var manifestJSON = JSON.parse(file.contents.toString());
            var newJson = {};
            for(var maniKey in manifestJSON) {
                if (maniKey.indexOf('.css') !== -1) {
                    newJson['css/' + maniKey] = 'dist/css/' + manifestJSON[maniKey];
                } else {
                    newJson['js/' + maniKey] = 'dist/' + manifestJSON[maniKey];
                }
            }
            file.contents = new Buffer(JSON.stringify(newJson, null, 4));

        }))
        .pipe(gulp.dest('./dist/rev/'));
});

gulp.task('minify-html', ['format-json'], function() {
    var opts = { comments: false, spare:true };
    gulp.src(['./dist/rev/*.json', './dev/index.html'])
        .pipe(minifyHTML(opts))
        .pipe(revcollector({ replaceReved: true }))
        .pipe(gulp.dest('./'));
});


gulp.task('build', ['format-json', 'minify-html'], function() {
    console.log('build success!!!');
}); 

gulp.task('default', ['build']);