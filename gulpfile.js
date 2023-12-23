const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const htmlMinify = require('html-minifier');
const gulpPug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const webpack = require("webpack");
const webp_stream = require("webpack-stream");
const webpack_config = require("./webpack.config.js");
const include = require("gulp-include");
const sourcemaps = require("gulp-sourcemaps");


function scripts() {
  return gulp
    .src('src/**/index.js')
    .pipe(plumber())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(webp_stream(webpack_config, webpack))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.stream());
};

function layoutsScss() {
  const plugins = [
    autoprefixer(),
    mediaquery(),
    cssnano()
];
  return gulp.src('src/layouts/**/*.scss')
        .pipe(sass())
        .pipe(concat('bundle.css'))
        .pipe(postcss(plugins))        
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function pagesScss() {
  const plugins = [
    autoprefixer(),
    mediaquery(),
    cssnano()
];
  return gulp.src('src/pages/**./*.scss')
        .pipe(sass())
        .pipe(postcss(plugins))        
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function scss() {
  const plugins = [
    autoprefixer(),
    mediaquery(),
    cssnano()
];
  return gulp.src('src/layouts/default.scss')
             .pipe(sass())
             .pipe(concat('bundle.css'))
             .pipe(postcss(plugins))
             .pipe(gulp.dest('dist/'))
             .pipe(browserSync.reload({stream: true}));
}

exports.layoutsScss = layoutsScss;
exports.pagesScss = pagesScss;

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}

function pug() {
  return gulp.src('src/pages/**/*.pug')
        .pipe(gulpPug({
          pretty: true
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function scripts2() {
  return gulp.src('src/**/*.js')
         .pipe(plumber())
         .pipe(concat('bundle.js'))
         .pipe(gulp.dest('dist/'))
         .pipe(browserSync.reload({stream: true}));

}

function html() {
  const options = {
	  removeComments: true,
	  removeRedundantAttributes: true,
	  removeScriptTypeAttributes: true,
	  removeStyleLinkTypeAttributes: true,
	  sortClassName: true,
	  useShortDoctype: true,
	  collapseWhitespace: true,
		minifyCSS: true,
		keepClosingSlash: true
	};
  return gulp.src('src/**/*.html')
        .pipe(plumber())
        .on('data', function(file) {
		      const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), options))
		      return file.contents = buferFile
		    })
				.pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function css() {
  const plugins = [
      autoprefixer(),
      mediaquery(),
      cssnano()
  ];
  return gulp.src('src/**/*.css')
        .pipe(plumber())
        .pipe(concat('bundle.css'))
        .pipe(postcss(plugins))
				.pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function images() {
  return gulp.src('src/**/*.{jpg,png,svg,gif,ico,webp,avif}')
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}));
}

function fonts() {
  return gulp.src('src/**/*.{woff2,woff}')
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}));
}

function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch(['src/**/*.pug'], pug);
  
  gulp.watch(['src/layouts/**/*.scss'], layoutsScss);  
  gulp.watch(['src/pages/**/*.scss'], pagesScss);
  gulp.watch(['src/**/*.scss'], scss);
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/**/*.css'], css);
  gulp.watch(['src/**/*.js'], scripts);
  gulp.watch(['src/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
  gulp.watch(['src/**/*.{woff2, woff}'], fonts);
}

const build = gulp.series(clean, gulp.parallel(pug, layoutsScss, pagesScss, scripts, images, fonts));
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.html = html;
exports.pug = pug;
exports.css = css;
exports.images = images;
exports.clean = clean;
exports.fonts = fonts;
exports.scripts = scripts;
exports.uglify = uglify;

exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;
exports.scss = scss;