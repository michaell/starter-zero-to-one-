const { src, dest, watch, parallel, series } = require("gulp");

const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
// const imagemin = require("gulp-imagemin");
const del = require("del");

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
}

function scripts() {
  return src(["node_modules/jquery/dist/jquery.js", "app/js/main.js"])
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

function styles() {
  return src("app/scss/style.scss")
    .pipe(sourcemaps.init())
    .pipe(
      scss({
        outputStyle: "compressed",
      })
    )
    .pipe(concat("style.min.css"))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 10 versions"],
        grid: true,
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

function watching() {
  watch(["app/scss/**/*.scss"], styles);
  watch(["app/js/**/*.js", "!app/js/main.min.js"], scripts);
  watch(["app/*.html"]).on("change", browserSync.reload);
}

// function images() {
//   return src("app/images/**/*")
//     .pipe(
//       imagemin([
//         imagemin.gifsicle({
//           interlaced: true,
//         }),
//         imagemin.mozjpeg({
//           quality: 75,
//           progressive: true,
//         }),
//         imagemin.optipng({
//           optimizationLevel: 5,
//         }),
//         imagemin.svgo({
//           plugins: [
//             {
//               removeViewBox: true,
//             },
//             {
//               cleanupIDs: false,
//             },
//           ],
//         }),
//       ])
//     )
//     .pipe(dest("dist/images"));
// }

function cleanDist() {
  return del("dist");
}

function build() {
  return src(
    [
      "app/css/style.min.css",
      "app/fonts/**/*",
      "app/js/main.min.js",
      "app/*.html",
    ],
    {
      base: "app",
    }
  ).pipe(dest("dist"));
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
// exports.images = images;
exports.cleanDist = cleanDist;

exports.default = parallel(styles, scripts, browsersync, watching);

// exports.build = series(cleanDist, images, build);
exports.build = series(cleanDist, build);
