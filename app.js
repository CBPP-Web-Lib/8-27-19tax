/*globals require, document, console, window, Typekit*/
"use strict";
import "@babel/polyfill";
import "./app.scss";
var $ = require("jquery");
var csv_parse = require("csv-parse");
var d3 = require("d3");
var id = "tanf8-20-19";
var script = $("#script_" + id);
var Figure = require("cbpp_figures")($);
var url_base = script[0].src.replace("js/app.js","").replace("js/app.min.js","");
var sel = "#" + id;
var colorgen = require("cbpp_colorgen");
var colors = colorgen("#D6E4F0","#5590BF",3);
console.log(colors);
require('./app.scss');
var g = {};
window.debugObj = g;
g.DOM = require("./DOM.html");
g.d3 = d3;
g.$ = $;
g.colors = colors;
g.sel = sel;
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
    .attr("viewBox","0 -50 100 50");
  var e = g.events;
  g.speedFactor = 1;
  e.waitFor(2000)()
    .then(e.drawOneThousand(1000)) 
    .then(e.describeOneThousand(1000))
    .then(e.waitFor(2000))
    .then(e.introText(1000))
    .then(e.waitFor(2000))
    .then(e.describeSalary(1000))
    .then(doMultiple([
      e.zoomToViewBoxMaker("0 -200 400 200")(2000, 1000),
      e.seriesOfAdditionalBlocks(3000),
      e.fadeOutOneThousandDescription(2000, 1000)
    ]))
    .then(doMultiple([
      e.restOfSalary(4000),
      e.recolorStartBox(1000) 
    ]))
    .then(doMultiple([
      e.describeSalaryTax(1000, 1000),
      e.ordinaryIncomeTaxBlocks(4000)
    ]))
    .then(e.waitFor(3000)) 
    .then(doMultiple([
      e.fadeOutSalary(500),    
      e.fadeOutSalaryTax(500),
      e.fadeOutIntroText(500)
    ]))
    .then(doMultiple([
      e.fadeInCover(500),
      e.fadeInStockExplainer(500)
    ]))
    .then(e.waitFor(4000))
    .then(doMultiple([
      e.zoomToViewBoxMaker("0 -2500 5000 2500")(3000),
      e.realizedGainsExplainer(1000),
      e.fadeInCapGains(3000),
      e.fadeOutCover(500, 2500)
    ]))
    .then(e.waitFor(4000))
    .then(doMultiple([
      e.fadeInCapGainsTax(3000),
      e.realizedGainsTaxExplainer(1000)
    ]))
    .then(e.waitFor(4000))
    .then(e.fadeOutGains(1000))
    .then(doMultiple([
      e.zoomToViewBoxMaker("0 -7800 15600 7800")(6000),
      e.fadeInCover2(500, 2000),
      e.unrealizedExplainer(500, 2000),
      e.unrealizedGains(3000, 2000),
      e.solidifyTax(6000)
    ]))
    .then(e.waitFor(2000))
    .then(e.unrealizedExplainer2(1000))
    .then(e.waitFor(6000))
    .then(doMultiple([
      e.fadeOutUnrealizedExplainers(1000),
      e.moveIncome(2000),
      e.moveUnrealizedIncome(2000),
      e.solidifyAll(2000) 
    ]))
    .then(e.explainUnrealized(2000))
    .then(e.waitFor(2000))
    .then(e.explainRealized(2000))
    .then(e.waitFor(2000))
    .then(e.explainTax(2000))
    .then(e.summary(2000))
    .then(e.waitFor(10000))
    .then(e.fadeOutAllAtEnd(1000));
    /*
    .then(doMultiple([
      zoomToFirstMillionView(2000),
      describeCapGains(500),
      fillOutFirstMillionWithCapGains(2000)
    ]))
    .then(labelOneMillion(500))
    .then(waitFor(1000))
    .then(doMultiple([
      zoomToRealizedGainsView(2000),
      finishCapGainsDesc(500, 2000),
      fadeOutBracket(500),
      fillOutRestOfCapGains(4000, 1500),
      backfillFirstMillion(2000)
    ]))
    .then(waitFor(1000))
    .then(doMultiple([
      describeCapGainsTax(1000),
      capGainsTax1(1000),
      capGainsTax2(1000,1000),
    ]))
    .then(waitFor(1000))
    .then(prepareUntaxed(500))
    .then(waitFor(3000))
    .then(fadeOutStockSalesExplainer(500))
    .then(doMultiple([
      zoomToFurthestOutView(2000),
      solidifyTax(1000),
      fadeInFirstBillionOfUntaxedIncome(3000)
    ]))
    .then(doMultiple([
      labelOneBillion(500),
      describeUntaxedIncome(500)
    ]))
    .then(waitFor(3000))
    .then(doMultiple([
      fadeOutBillionBracket(500),
      zoomOutEvenFurther(1000),
      fadeIn3Billion(3000),
      describeUntaxedIncome2(1000)
    ]))
    .then(describeUntaxedIncome3(1000))
    .then(waitFor(5000))
    .then(doMultiple([
      moveStuffAtEnd(3000),
      fadeOutUntaxedIncomeDesc(3000)
    ]))
    .then(describeUntaxedIncome4(1000))
    .then(waitFor(1000))
    .then(describeUntaxedIncome5(1000))
    .then(waitFor(1000))
    .then(describeUntaxedIncome6(1000))
    .then(waitFor(1000))
    .then(zoomBackIn(4000))
    .then(waitFor(2000))
    .then(zoomBackOut(4000))
    .then(fadeOutAllAtEnd(1000));
*/
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
    console.log("xstart", xstart);
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
  };

  makeBlocks();

  var frame = function() {
    var now = Date.now();
    var progress = (now - startTime)/duration;
    if (progress > 1) {
      progress = 1;
    }
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
};

require("./events.js")(g);