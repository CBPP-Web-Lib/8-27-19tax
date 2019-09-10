/*globals require, Promise, process*/

var gulp = require("gulp");
var gl = require("cbpp_shared_gulp/gulplib.js")(gulp);
gulp.task('data', function(cb) {
  gulp.src('./*.csv').pipe(gulp.dest('./build')).on("end", cb);
});
gl.serverPort = 8001;