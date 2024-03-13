/*globals require, document, console, window, Typekit*/
"use strict";
var $ = require("jquery");
var d3 = require("d3");
var id = "tax8-27-19";
var script = $("#script_" + id);
var sel = "#" + id;
var colorgen = require("cbpp_colorgen");
var colors = colorgen("#D6E4F0","#5590BF",3);
console.log(colors);
require('./style.scss');
var g = {};
window.debugObj = g;
g.DOM = require("./DOM.html").default;
g.d3 = d3;
g.$ = $;
g.colors = colors; 
g.sel = sel;
g.domLoaded = false;  
g.bracketPath = require("./pathstring.json");
g.polygonClipping = require("polygon-clipping");
g.data = [
  [23.7,0.6,0.5,1.5,27.2],
  [8.9,2.2,1.5,0.9,13.8]
];
g.sums = [
  g.data[0][4],
  g.data[1][4]
];

g.easeInPow = function(pow) {
  return function(p) {
    return Math.pow(p, pow);
  };
};

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
    .attr("viewBox","0 -50 100 50");
  var e = g.events;
  g.speedFactor = 1;
  e.waitFor(2000)()
    .then(e.drawOneThousand(1000)) 
    .then(e.describeOneThousand(1000))
    .then(e.waitFor(2000))
    .then(e.introText(1000))
    .then(e.waitFor(2000))
    .then(doMultiple([
      doSequential([
        doMultiple([
          e.oneYearHerStocks(2000),
          e.seriesOfAdditionalBlocks(6000)
        ]),
        doMultiple([
          e.recolorStartBox(1000),
          e.millionBracket(500),
          doSequential([
            e.millionBracketLabel(500),
            e.waitFor(2000),
            e.fadeOutBracket(800)
          ]),
          doSequential([
            e.secondMillion(1000),
            e.restOfMillionBlocks(5000)
          ])
        ])
      ]),
      e.zoomToViewBoxMaker("-200 -1000 2000 1000")(12000),
      e.fadeOutOneThousandDescription(2000, 1000)
    ]))
    .then(e.waitFor(3000))
    .then(e.fadeOutSlide1(500))
    .then(doMultiple([
      e.supposeSheSells(500),
      e.highlightTwoMillion(1000)
    ]))
    .then(e.waitFor(2000))
    .then(doMultiple([
      e.theTwoMillion(1000),
      e.zoomToViewBoxMaker("-160 -360 720 360")(2000)
    ]))
    .then(e.waitFor(2000))
    .then(e.fadeOutSlide2(500))
    .then(doMultiple([
      e.fadeInTax(3500),
      e.plus238(1000)
    ]))
    .then(e.waitFor(500))
    .then(e.thisMeansThat(500))
    .then(e.waitFor(3000))
    .then(doMultiple([
      e.zoomToViewBoxMaker("-200 -1000 2000 1000")(2500),
      e.unhighlightTwoMillion(2000, 500)
    ]))
    .then(doMultiple([

      e.effectiveTaxRate(2000),
      e.makeGridless(1000, 0),
      doSequential([
        e.moveMillions(1100, 0),
        e.simplifiedPath(),
        e.animateToPie(3000)
      ])
    ]))
    .then(e.waitFor(10000))
    .then(e.fadeOutAllAtEnd(1000));
}

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

g.PromiseMaker = function(asyncFunction) {
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

g.subgroupFontSize = 2.5;
g.objects = {};
g.formatters = {};
g.formatters.percent = function(x, m, round) {
  return (Math.round(x*m*round)/round) + "%";
};

g.billionSizeHoz = 9500;
g.billionSizeVert = 4700;
g.millionMargin = 20;
g.billionMargin = 500;
g.millionHoz = 40;
g.millionVert = 25;
g.thousandMargin = 1;
g.thousandHoz = 40;
g.thousandVert = 25;

g.millionSizeHoz = g.billionSizeHoz / g.millionHoz - g.millionMargin + g.millionMargin/g.millionHoz;
g.millionSizeVert = g.billionSizeVert / g.millionVert - g.millionMargin + g.millionMargin/g.millionVert;
g.thousandSizeHoz = g.millionSizeHoz / g.thousandHoz - g.thousandMargin + g.thousandMargin/g.thousandHoz;
g.thousandSizeVert = g.millionSizeVert / g.thousandVert - g.thousandMargin + g.thousandMargin/g.thousandVert;

console.log(g);


var doSequential = g.doSequential =  function(arr) {
  return function() {
    var makePromise = function(el) {
      return new Promise(function(resolve, reject) {
        el().then(resolve);
      });
    };
    var r = makePromise(arr[0]);
    for (var i = 1, ii = arr.length; i<ii; i++) {
      r = r.then(arr[i]);
    }
    return r;
  };
};


g.fadeInNewBlocks = function(config, cb) {

  var width = config.width || g.millionSizeHoz;
  var height = config.height || g.millionSizeVert;
  var margin = config.margin || g.millionMargin;
  var xsize = config.xsize || g.millionHoz;
  var ysize = config.ysize || g.millionVert;
  var xstart = config.xstart || 0;
  var ystart = config.ystart || 0;
  var skipList = config.skipList || {};
  var skipArray = config.skipArray || [];
  var duration = config.duration || 1000;
  var transitionAtOnce = config.transitionAtOnce || 10;
  var verticalOrder = config.verticalOrder || false;
  var color = config.color || colors[0];
  var identifier = config.identifier;
  var opacity = config.opacity || 1;
  var easing = config.easing || function(p) {return p;}
  var modSkipList = function(list, confs) {
    for (var i = 0, ii = confs.length; i<ii; i++) {
      var conf = confs[i];
      for (var x = conf.colstart; x<conf.colstart + conf.cols; x++) {
        for (var y = conf.rowstart; y<conf.rowstart + conf.rows; y++) {
          list[x] = list[x] || {};
          list[x][y] = true;
        }
      }
    }
    return list;
  };

  skipList = modSkipList(skipList, skipArray);
  var genOrder = function() {
    var order = [], x, y;
    if (!verticalOrder) {
      for (y = 0;y<ysize;y++) {
        for (x = 0;x<xsize;x++) {
          add(x, y);
        }
      }
    } else {
      for (x = 0;x<xsize; x++) {
        for (y = 0;y<ysize; y++) {
          add(x, y);
        }
      }
    }
    function add(x,y) {
      var good = true;
      if (skipList[x]) {
        if (skipList[x][y]) {
          good = false;
        }
      }
      if (good) {order.push([x,y]);}
    }
    return order;
  };

  var order = genOrder();
  var n = order.length;
  var genOpacities = function(n, p, s) {
    var m = -1/s;
    var x0 = p*(n+s);
    var y0 = (0-m)*x0;
    var r = [];
    for (var i = 0;i<n;i++) {
      r.push(Math.max(0,Math.min(1,m*i + y0))*opacity);
    }
    return r;
  };

  var blocks, gridlessBlocks;

  var makeBlocks = function() {
    var id = "c" + xsize + "_" + ysize + "_" + xstart + "_" + ystart + "_" + width + "_" + height + "_" + margin + "_" + color.replace("#","");
    id = id.replace(/\./g,"d");
    blocks = g.shapes.selectAll("rect." + id)
      .data(order)
      .enter()
      .append("rect")
      .attr("class",id)
      .each(function(d) {
        var el = d3.select(this);
        var x = d[0]*(width + margin) + xstart;
        var y = d[1]*(height + margin) + ystart;
        el.attr("x",x)
          .attr("y",y)
          .attr("width",width)
          .attr("height",height)
          .attr("data-identifier", function() {
            if (identifier) {return identifier;}
          })
          .attr("fill",color)
          .attr("opacity",0);
    });
    gridlessBlocks = g.shapes.selectAll("rect." + id + "_gridless")
      .data(order)
      .enter()
      .append("rect")
      .attr("class",id)
      .each(function(d) {
        var el = d3.select(this);
        var x = d[0]*(width + margin) + xstart;
        var y = d[1]*(height + margin) + ystart;
        el.attr("x",x-margin*0.05)
          .attr("y",y-margin*0.05)
          .attr("data-identifier", function() {
            if (identifier) {return identifier;}
          })
          .attr("data-gridless",true)
          .attr("width",width + margin*2)
          .attr("height",height + margin*2)
          .attr("fill",color)
          .attr("opacity",0);
    });
    if (config.prepend===true) {
      blocks.lower();
    }
    return {
      blocks: blocks,
      gridlessBlocks: gridlessBlocks
    };
  };

  var objects = makeBlocks();

  var frame = function() {
    var now = Date.now();
    var progress = (now - startTime)/duration;
    if (progress > 1) {
      progress = 1;
    }
    progress = easing(progress);
    var opacities = genOpacities(n, progress, transitionAtOnce);
    blocks.each(function(d, i) {
      d3.select(this).attr("opacity",opacities[i]);
    });
    if (progress < 1) {
      window.requestAnimationFrame(frame);
    } else {
      cb(blocks, gridlessBlocks);
    }
  };
  var startTime = Date.now();
  frame();

  return objects;

};

require("./events.js")(g);