const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const runSequence = require('run-sequence');
const del = require('del');
const Hexo = require('hexo');

// 清除public文件夹
gulp.task('clean', function() {
  return del(['public']);
});

// 利用Hexo API 来生成博客内容， 效果和在命令行运行： hexo g 一样
// generate html with 'hexo generate'
const hexo = new Hexo(process.cwd(), {});
gulp.task('generate', function(cb) {
  hexo.init().then(function() {
    return hexo.call('generate', {
        watch: false
    });
  }).then(function() {
    return hexo.exit();
  }).then(function() {
    return cb()
  }).catch(function(err) {
    console.log(err);
    hexo.exit(err);
    return cb(err);
  })
});

gulp.task('minify-css', () => {
  return gulp.src('./public/**/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./public'));
});

// For more info, visit https://github.com/kangax/html-minifier
gulp.task('minify-html', function () {
  return gulp.src('./public/**/*.html')
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
      removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
      removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(gulp.dest('./public'))
});

gulp.task('minify-js', function () {
  return gulp.src(['./public/**/*.js', '!./public/**/*.min.js'])
  .pipe(uglify())
  .pipe(gulp.dest('./public'));
});

gulp.task('minify-images', function() {
  return gulp.src('./public/images/*.*')
    .pipe(imagemin({
        progressive: false
    }))
    .pipe(gulp.dest('./public/images/'));
});

// 用run-sequence并发执行，同时处理html，css，js，image
gulp.task('compress', function() {
  runSequence(['minify-html', 'minify-css', 'minify-js', 'minify-images']);
});

// 执行顺序：清除public目录 -> 生成原始博客文件 -> 并发执行压缩
gulp.task('build', function(cb) {
  runSequence('clean', 'generate', 'compress', cb)
});

gulp.task('default', ['build']);
