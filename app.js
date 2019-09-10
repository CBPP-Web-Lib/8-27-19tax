/*globals require, document, console, window, Typekit*/
"use strict";
import "@babel/polyfill";
import "./app.scss";
var $ = require("jquery");
var csv_parse = require("csv-parse");
var d3 = require("d3");
var id = "tanf8-20-19";
var script = $("#script_" + id);
var url_base = script[0].src.replace("js/app.js","").replace("js/app.min.js","");
var sel = "#" + id;
require('./app.scss');
var g = {};
g.DOM = require("./DOM.html");
g.domLoaded = false; 
g.data = [
  [23.7,0.6,0.5,1.5,27.2],
  [8.9,2.2,1.5,0.9,13.8]
];
g.sums = [
  g.data[0][4],
  g.data[1][4]
];
Promise.all([
  new Promise(function(resolve, reject) {
    $(document).ready(resolve);
  })
]).then(ready);

function ready() {
  var wrap = $(document.createElement("div"))
    .attr("id",id);
  script.before(wrap); 
  wrap.html(g.DOM);
  g.svg = d3.select(".animation-inner").append("svg")
    .attr("viewBox","0 0 10000 5000");
  waitFor(200)()
    .then(drawOneBillion(500))
    .then(drawInitialLabel(500))
    .then(waitFor(1000))
    .then(fadeOutInitialLabel(500))
    .then(doMultiple([
      drawOther64Billion(500),
      describe65Billion(500)
    ]))
    .then(annualIncome(2500))
    .then(doMultiple([
      zoomIn(2500),
      divBlocks(2495, 5),
      moveGroups(2500)
    ]))
    .then(highlightAGI(2500))
    .then(zoomInMore(2500));
   // .then(drawInitialLine(500))
    //.then(drawFirstBar(500))
   // .then(writeFirstLabel(500))
    //.then(waitFor(2000))
    //.then(drawSecondBar(1500))
    //.then(writeSecondLabel(500))
   // .then(waitFor(9000))
   // .then(fadeOut(500));
    /*.then(doMultiple([
      sliceRect1(1000),
      drawTopOneLabel(1000)
    ]))*/
    
}

var colors = { 
  blue100: "#0C61A4", 
  blue70: "#5590BF",
  blue17: "#D6E4F0",
  blue8: "#ECF2F8",
  share100: "#0A5087"
};

var doMultiple = function(arr) {
  return function() {
    var promises = [];
    var makePromise = function(el) {
      return new Promise(function(resolve, reject) {
        el().then(resolve);
      });
    };
    for (var i = 0, ii = arr.length; i<ii; i++) {
      promises.push(makePromise(arr[i]));
    }
    return Promise.all(promises);
  };
};

var PromiseMaker = function(asyncFunction) {
  return function(duration, delay) {
    return function() {
      return new Promise(function(resolve, reject) {
        try {
          if (delay) {
            setTimeout(function() {
              asyncFunction(resolve, duration/g.speedFactor);
            }, delay/g.speedFactor);
          } else {
            asyncFunction(resolve, duration/g.speedFactor);
          }
        } catch (ex) {
          reject(ex);
        }
      });
    };
  };
};
g.speedFactor = 1;
g.subgroupFontSize = 2.5;
g.objects = {};
g.shapes = {};
g.formatters = {};
g.formatters.percent = function(x, m, round) {
  return (Math.round(x*m*round)/round) + "%";
};

/*repeated events*/
var waitFor = PromiseMaker(function(cb, duration) {
  setTimeout(cb, duration);
});

/*one-off events*/
var drawOneBillion = PromiseMaker(function(cb, duration) {
  g.shapes = g.svg.append("g")
    .attr("class","shapes");
  var rect = g.objects.firstRect = g.shapes.append("rect")
    .attr("x", 1000)
    .attr("y", 4200)
    .attr("height",240)
    .attr("width",240)
    .attr("fill","#ECF2F8")
    .attr("opacity",0)
    .attr("stroke-width",0);
  rect.transition()
      .duration(duration)
      .attr("opacity",1)
      .on("end",cb);
});

var drawGrid = function(xblocks, yblocks, startx, starty, margin, xsize, ysize) {
  var data = [];
  if (typeof(margin)==="undefined") {
    margin = 60;
  }
  if (typeof(xsize)==="undefined") {
    xsize = 240;
  }
  if (typeof(ysize)==="undefined") {
    ysize = 240;
  }
  var className = "grid" + xblocks + "-" + yblocks + "-" + startx + "-" + starty;
  for (var x = 0; x<xblocks; x++) {
    for (var y = 0; y<yblocks; y++) {
      data.push([x,y]);
    }
  }
  className = className.replace(/\./g,"p");
  var rects = g.shapes.selectAll("rect." + className)
    .data(data)
    .enter()
    .append("rect")
      .attr("class",className)
      .attr("x", function(d) {return startx + d[0]*(xsize + margin);})
      .attr("y", function(d) {return starty + d[1]*(ysize + margin);})
      .attr("width", xsize)
      .attr("height", ysize);
  return rects;
};

var drawInitialLabel = PromiseMaker(function(cb, duration) {
  var label = g.objects.initialLabel = g.svg.append("text");
  label.text("← This block represents one billion dollars.")
    .attr("alignment-baseline","hanging")
    .attr("x",1300)
    .attr("y",4200)
    .attr("font-size",280)
    .attr("fill","#ECf2F8")
    .attr("opacity",0);
  label.transition()
      .duration(duration)
      .attr("opacity",1)
      .on("end", cb);
});

var fadeOutInitialLabel = PromiseMaker(function(cb, duration) {
  var label = g.objects.initialLabel;
  label.attr("opacity",1)
    .transition()
    .duration(duration)
    .attr("opacity",0)
    .on("end", function() {
      label.remove();
      cb();
    });
});

var drawOther64Billion = PromiseMaker(function(cb, duration) {
  var finishedRow = drawGrid(4, 1, 1300, 4200);
  var restOfGrid = drawGrid(5,12,1000,600);
  var boxes = g.objects.other64Boxes = d3.selectAll(finishedRow.nodes().concat(restOfGrid.nodes()))
    .attr("opacity",0)
    .attr("fill","#ECF2F8")
    .attr("class", function() {
      return (d3.select(this).attr("class") + " billionBox").trim();
    });
  boxes.transition()
      .duration(duration)
      .attr("opacity",1)
      .on("end",cb);
});

var describe65Billion = PromiseMaker(function(cb, duration) {
  var label = g.objects.describe65 = g.svg.append("text");
  label.text("Warren Buffet's net worth is $65 billion.")
    .attr("alignment-baseline","hanging")
    .attr("x",3500)
    .attr("y",2100)
    .attr("font-size",280)
    .attr("fill","#ECf2F8")
    .attr("opacity",0);
  label.transition()
      .duration(duration)
      .attr("opacity",1)
      .on("end", cb);
});

var annualIncome = PromiseMaker(function(cb, duration) {
  var w = 3;
  var h = 2;
  var n = w*h;
  var newBoxes = g.objects.annualIncome = drawGrid(w,h,2500,3900);
  var nodes = [];
  newBoxes.attr("opacity",0);
  newBoxes.attr("fill","#ECF2F8");
  newBoxes.each(function(d) {
    nodes.push([d, this]);
  });
  nodes.sort(function(a, b) {
    var d1 = a[0];
    var d2 = b[0];
    return -d1[1]*1000 + d1[0] - (-d2[1]*1000 + d2[0]);
  });
  nodes.forEach(function(el, i) {
    el = el[1];
    d3.select(el).attr("class", (d3.select(el).attr("class") + " income-block billionBox").trim());
    setTimeout(function() {
      d3.select(el).transition()
      .duration(duration/n)
      .attr("opacity",1)
      .on("end", function() {
        if (i===n-1) {
          cb();
        }
      });
    }, i/n * duration);
  });
});

var zoomIn = PromiseMaker(function(cb, duration) {
  g.svg.transition()
    .duration(duration)
    .attr("viewBox","2440 3945 1250 450")
    .on("end", cb);
});

var divBlocks = PromiseMaker(function(cb, duration) {
  g.millionLines = g.svg.append("g")
    .attr("class", "millionLines");
  
    var xchange = 55;
    var ychange = 55;
  g.svg.selectAll(".income-block").each(function(d, i) {
    var el = d3.select(this);
    var width = el.attr("data-orgwidth")*1+xchange;
    var height = el.attr("data-orgheight")*1+ychange;
    var xc = el.attr("data-orgx");
    var yc = el.attr("data-orgy");
    var group = g.millionLines.append("g")
      .attr("class", el.attr("class").replace("income-block","income-block-group"))
      .attr("transform","translate(" + (xc-xchange/2) + "," + (yc-ychange/2) + ")");
    var xlines = 40;
    var ylines = 25;
    for (var x = 1; x<xlines;x++) {
      var xpos = x/xlines*width;
      group.append("line")
        .attr("stroke-width",2)
        .attr("stroke","#0A5087")
        .attr("x1",xpos)
        .attr("y1",0)
        .attr("x2",xpos)
        .attr("y2",height)
        .attr("opacity",0)
        .attr("class","millionLine millionLineHoz");
    }
    for (var y = 1; y<=ylines;y++) {
      var ypos = y/ylines*height;
      group.append("line")
        .attr("stroke-width",2)
        .attr("stroke","#0A5087")
        .attr("x1",0)
        .attr("y1",ypos)
        .attr("x2",width)
        .attr("y2",ypos)
        .attr("opacity",0)
        .attr("class","millionLine millionLineVert");
    }
    group.selectAll(".millionLine")
      .transition()
      .duration(duration)
      .attr("opacity",1)
      .on("end",cb);
  });
});

var moveGroups = PromiseMaker(function(cb, duration) {
  g.svg.selectAll(".billionBox").each(function() {
    var self = d3.select(this);
    var startx = self.attr("x");
    var starty = self.attr("y");
    self.attr("data-orgx",startx);
    self.attr("data-orgy",starty);
    self.attr("data-orgwidth",self.attr("width"));
    self.attr("data-orgheight",self.attr("height"));
    self.transition()
      .duration(duration)
      .attr("width",295)
      .attr("height",295)
      .attr("x",startx - 55/2)
      .attr("y", starty - 55/2)
      .on("end", cb);
  });
});

var highlightAGI = PromiseMaker(function(cb, duration) {
  var ysize = 11.6;
  var xsize = 7.175;
  var margin = 0.2;
  var xbottom = 3367.5;
  var yright = 4467.5; 
  var rects = drawGrid(3,3,xbottom-3*(xsize+margin)+margin/2, yright - 3*(ysize+margin)+margin/2, margin, xsize, ysize);
  var rects2 = drawGrid(2,1,xbottom-2*(xsize+margin)+margin/2, yright - 4*(ysize+margin)+margin/2, margin, xsize, ysize);
  var halfRect = drawGrid(1,1,xbottom-3*(xsize+margin)+margin/2, yright - 4*(ysize+margin)+margin/2 + 0.4*ysize, margin, xsize, ysize*0.6);
  g.AGIRects = d3.selectAll(rects.nodes().concat(rects2.nodes()).concat(halfRect.nodes()));
  g.svg.selectAll(".income-block")
    .transition()
    .duration(duration)
    .attr("opacity",0.3)
    .on("end",cb);
  g.AGIRects.attr("fill","#ECF2F8"); 
  /*3180 4400 100 50*/
});

var zoomInMore = PromiseMaker(function(cb, duration) {
  g.svg.transition()
    .duration(duration)
    .attr("viewBox","3320 4418 100 50")
    .on("end",cb);
  g.svg.selectAll(".millionLine")
    .transition()
    .duration(duration)
    .attr("stroke-width",0.2);

});

var fadeOut = PromiseMaker(function(cb, duration) {
  $(sel).find(".animation-wrap").fadeOut(duration, function() {
    $(sel).find(".animation-wrap").show().css("visibility","hidden");
  });
});