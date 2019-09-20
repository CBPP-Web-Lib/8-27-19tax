/*globals require, Promise, process*/

var gulp = require("gulp");
var gl = require("cbpp_shared_gulp/gulplib.js")(gulp);
gulp.task('data', function(cb) {
  gulp.src('./*.csv').pipe(gulp.dest('./build')).on("end", cb);
});
gl.serverPort = 8001;
var download = require("download");
gulp.task("get_font", function(cb) {
  download("https://github.com/steinbergmedia/bravura/raw/master/redist/woff/Bravura.woff2", "./").then(cb);
});