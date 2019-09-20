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
    .attr("viewBox","0 -80 160 80");

  waitFor(200)()
    .then(introText(1000))
    .then(waitFor(4000))
    .then(fadeOutIntroText(1000))
    .then(doMultiple([
      drawOneThousand(1000),
      describeOneThousand(1000)
    ]))
    .then(waitFor(2000))
    .then(fadeOutOneThousandDescription(500))
    .then(doMultiple([
      describeSalary(1000),
      seriesOfAdditionalBlocks(5000)
    ]))
    .then(doMultiple([
      describeSalaryTax(1000),
      ordinaryIncomeTaxBlocks(2500)
    ]))
    .then(waitFor(3000))
    .then(doMultiple([
      fadeOutSalary(500),
      fadeOutSalaryTax(500)
    ]))
    .then(waitFor(1000))
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
    .then(describeUntaxedIncome3(1000));

 
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

var drawOneThousand = PromiseMaker(function(cb, duration) {
  g.shapes = g.svg.append("g")
    .attr("class","shapes")
    .attr("transform","matrix(1 0 0 -1 0 0)");
  var rect = g.objects.firstRect = g.shapes.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height",g.thousandSizeVert)
    .attr("width",g.thousandSizeHoz)
    .attr("fill","#ECF2F8")
    .attr("opacity",0)
    .attr("stroke-width",0);
  rect.transition()
      .duration(duration)
      .attr("opacity",1)
      .on("end",cb);
});

var introText = PromiseMaker(function(cb, duration) {
  var text = "Imagine a billionaire founder of a large tech company. He or she might take a token salary of $100,000, but this would only be " +
    "a very small portion of his or her overall economic income, most of which would be unrealized capital gains.";
  var div = g.objects.introText = $(document.createElement("div"))
    .css("width","100%")
    .css("height","60%")
    .css("position","absolute")
    .css("top","40%")
    .css("left",0)
    .css("text-align","center")
    .css("font-size","24pt")
    .text(text);
  $(sel).find(".animation-inner").append(div);
  div.hide().fadeIn(duration, cb);
});

var fadeOutIntroText = PromiseMaker(function(cb, duration) {
  g.objects.introText.fadeOut(duration, cb);
});

var describeOneThousand = PromiseMaker(function(cb, duration) {
  var coords = svgCoordsToPercentOfViewBox(g.thousandSizeHoz*1.3,g.thousandSizeVert);
  var text = g.objects.describeOneThousand = $(document.createElement("div"))
    .addClass("annotation")
    .html("&larr; This block represents one thousand dollars.")
    .css("left", (coords.x*100) + "%")
    .css("top", (coords.y*100) + "%");
  $(sel).find(".animation-inner").append(text);
  text.hide().fadeIn(duration, cb);
});

var describeSalary = PromiseMaker(function(cb, duration) {
  var text = "The CEO takes a token salary of $100,000.";
  var obj = g.objects.salaryDesc = $(document.createElement("div"))
    .addClass("annotation")
    .css("right",0)
    .css("top","20%")
    .css("width","50%")
    .css("text-align","center")
    .text(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
});

var describeSalaryTax = PromiseMaker(function(cb, duration) {
  var text = "The top individual income tax rate is 37%, plus 7.65% in payroll taxes - a tax bill of about $45,000.";
  var obj = g.objects.salaryTaxDesc = $(document.createElement("div"))
    .addClass("annotation")
    .css("right",0)
    .css("width","50%")
    .css("text-align","center")
    .css("top","50%")
    .text(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
});

var describeCapGains = PromiseMaker(function(cb, duration) {
  var text = "To cover the expenses of a luxury lifestyle, the billionaire sells stock each year...";
  var obj = g.objects.capGainsDesc = $(document.createElement("div"))
    .addClass("annotation")
    .css("right",0)
    .css("width","30%")
    .css("text-align","center")
    .css("top","10%")
    .text(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
});

var backfillFirstMillion = PromiseMaker(function(cb, duration) {
  fadeInNewBlocks({
    duration:duration,
    width: g.millionSizeHoz,
    height: g.millionSizeVert,
    margin: g.millionMargin,
    xsize:1,
    ysize:1,
    transitionAtOnce:1,
    color:"#ECF2F8",
    prepend:true
  }, cb);
});

var finishCapGainsDesc = PromiseMaker(function(cb, duration) {
  var text = "...up to $6 million.";
  var obj = g.objects.capGainsDesc2 = $(document.createElement("div"))
    .addClass("annotation")
    .css("right",0)
    .css("width","30%")
    .css("text-align","center")
    .css("top","40%")
    .text(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
});

var labelOneMillion = PromiseMaker(function(cb, duration) {
  var outer_wrap = g.objects.oneMillionLabel = $(document.createElement("div"));
  outer_wrap.css({
    left:"56%",
    top:"0%",
    width:"20%",
    height:"100%",
    display:"block"
  }).addClass("annotation");
  var inner_wrap = $(document.createElement("div"));
  inner_wrap.css({
    "white-space":"nowrap",
    height:"100%"
  });
  var bracket = $(document.createElement("div"));
  bracket.css({
    display:"inline-block",
    "font-size":"100pt",
    "font-family":"Bravura",
    transform:"scaleY(2.5)",
    position:"relative",
    top:"120pt"
  }).html("");
  var text = $(document.createElement("div"));
  text.css({
    display:"inline-block",
    "font-size":"20pt",
    top:"2pt",
    left:"4pt",
    position:"relative"
  }).text("one million dollars");
  outer_wrap.append(inner_wrap);
  inner_wrap.append(bracket, text);
  $(sel).find(".animation-inner").append(outer_wrap);
  outer_wrap.hide().fadeIn(duration, cb);
    
});

var labelOneBillion = PromiseMaker(function(cb, duration) {
  var outer_wrap = g.objects.oneBillionLabel = $(document.createElement("div"));
  outer_wrap.css({
    left:"55%",
    top:"5%",
    width:"20%",
    height:"100%",
    display:"block"
  }).addClass("annotation");
  var inner_wrap = $(document.createElement("div"));
  inner_wrap.css({
    "white-space":"nowrap",
    height:"100%"
  });
  var bracket = $(document.createElement("div"));
  bracket.css({
    display:"inline-block",
    "font-size":"100pt",
    "font-family":"Bravura",
    transform:"scaleY(1.5)",
    position:"relative",
    top:"120pt"
  }).html("");
  var text = $(document.createElement("div"));
  text.css({
    display:"inline-block",
    "font-size":"20pt",
    top:"50pt",
    left:"4pt",
    position:"relative"
  }).text("one billion dollars");
  outer_wrap.append(inner_wrap);
  inner_wrap.append(bracket, text);
  $(sel).find(".animation-inner").append(outer_wrap);
  outer_wrap.hide().fadeIn(duration, cb);
    
});

var fadeOutBracket = PromiseMaker(function(cb, duration) {
  g.objects.oneMillionLabel.fadeOut(duration, cb);
});

var describeCapGainsTax = PromiseMaker(function(cb, duration) {
  var text = "Income from these stock sales is taxed at a preferential rate of 23.8%.";
  var obj = g.objects.capGainsTaxDesc = $(document.createElement("div"))
    .addClass("annotation")
    .css("right",0)
    .css("width","30%")
    .css("text-align","center")
    .css("top","50%")
    .text(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
});

var prepareUntaxed = PromiseMaker(function(cb, duration) {
  var text = "But this is still only a very small portion of his or her economic income.";
  var obj = g.objects.untaxedPrep = $(document.createElement("div"))
  .addClass("annotation")
  .css("right",0)
  .css("width","30%")
  .css("text-align","center")
  .css("top","80%")
  .text(text);
  $(sel).find(".animation-inner").append(obj);
  obj.hide().fadeIn(duration, cb);
});




var fadeOutStockSalesExplainer = PromiseMaker(function(cb, duration) {
  g.objects.capGainsDesc.fadeOut(duration, cb);
  g.objects.capGainsTaxDesc.fadeOut(duration);
  g.objects.untaxedPrep.fadeOut(duration);
  g.objects.capGainsDesc2.fadeOut(duration);
});

var describeUntaxedIncome = PromiseMaker(function(cb, duration) {
  var text = "Individuals who own large amounts of stock might see annual changes in the value of their portfolios of $1 billion...";
  var obj = g.objects.untaxedGains= $(document.createElement("div"))
    .addClass("annotation")
    .css("right",0)
    .css("width","50%")
    .css("text-align","center")
    .css("top","5%")
    .text(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
});

var describeUntaxedIncome2 = PromiseMaker(function(cb, duration) {
  var text = "...or even $2 or $3 billion.";
  var obj = g.objects.untaxedGainsFinal = $(document.createElement("div"))
    .addClass("annotation")
    .css("right",0)
    .css("width","50%")
    .css("text-align","center")
    .css("top","30%")
    .text(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
});

var describeUntaxedIncome3 = PromiseMaker(function(cb, duration) {
  var text = "None of this income is taxable if the stock is never sold. These assets can be passed onto heirs, ensuring that tax will NEVER be paid on such gains.";
  var obj = g.objects.untaxedGainsFinal2 = $(document.createElement("div"))
    .addClass("annotation")
    .css("right",0)
    .css("width","50%")
    .css("text-align","center")
    .css("top","55%")
    .text(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
  
});

var fadeOutBillionBracket = PromiseMaker(function(cb, duration) {
  g.objects.oneBillionLabel.fadeOut(duration, cb);
});

var fadeIn3Billion = PromiseMaker(function(cb, duration) {
  fadeInNewBlocks({
    skipList:{0:{0:true}},
    duration:duration,
    width: g.billionSizeHoz,
    height: g.billionSizeVert,
    margin: g.billionMargin,
    xsize:1,
    ysize:3,
    transitionAtOnce:1,
    color:"#aaaaaa"
  }, cb);
});

function svgCoordsToPercentOfViewBox(x, y) {
  var viewBox = g.svg.attr("viewBox").split(" ");
  var left = (x - viewBox[0])/(viewBox[2]);
  var bottom = (y - viewBox[1])/(viewBox[3])-1;
  return {x:left,y:1-bottom};
}

var fadeOutOneThousandDescription = PromiseMaker(function(cb, duration) {
  g.objects.describeOneThousand.fadeOut(duration, cb);
});

var fadeOutSalaryTax = PromiseMaker(function(cb, duration) {
  g.objects.salaryTaxDesc.fadeOut(duration, cb);
});

var fadeOutSalary = PromiseMaker(function(cb, duration) {
  g.objects.salaryDesc.fadeOut(duration, cb);
});

var seriesOfAdditionalBlocks = PromiseMaker(function(cb, duration) {
  fadeInNewBlocks({
    skipList:{0:{0:true}},
    duration:duration,
    width: g.thousandSizeHoz,
    height: g.thousandSizeVert,
    margin: g.thousandMargin,
    xsize:10,
    ysize:10,
    transitionAtOnce:25
  }, cb);
});

var ordinaryIncomeTaxBlocks = PromiseMaker(function(cb, duration) {
  fadeInNewBlocks({
    duration:duration,
    width: g.thousandSizeHoz,
    height: g.thousandSizeVert,
    margin: g.thousandMargin,
    xsize:10,
    ysize:5,
    color:"#5590BF",
    skipArray:[{rows: 1, cols: 5, rowstart: 4, colstart: 5}],
    transitionAtOnce:5
  }, cb);
});

var zoomToFirstMillionView = PromiseMaker(function(cb, duration) {
  g.svg.transition()
    .duration(duration)
    .attr("viewBox", "0 -200 400 200")
    .on("end", cb);
});

var zoomToRealizedGainsView = PromiseMaker(function(cb, duration) {
  g.svg.transition()
    .duration(duration)
    .attr("viewBox", "0 -600 1200 600")
    .on("end", cb);
});

var zoomToFurthestOutView = PromiseMaker(function(cb, duration) {
  g.svg.transition()
    .duration(duration)
    .attr("viewBox", "0 -9000 18000 9000")
    .on("end", cb);
});


var zoomOutEvenFurther = PromiseMaker(function(cb, duration) {
  g.svg.transition()
    .duration(duration)
    .attr("viewBox", "0 -16000 32000 16000")
    .on("end", cb);
});


var fillOutFirstMillionWithCapGains = PromiseMaker(function(cb, duration) {
  fadeInNewBlocks({
    duration:duration,
    width: g.thousandSizeHoz,
    height: g.thousandSizeVert,
    margin: g.thousandMargin,
    xsize:40,
    ysize:25,
    verticalOrder:true,
    skipArray:[{rows: 10, cols: 10, rowstart: 0, colstart: 0}],
    transitionAtOnce:100
  }, cb);
});



var fillOutRestOfCapGains = PromiseMaker(function(cb, duration) {
  fadeInNewBlocks({
    duration:duration,
    xsize:3,
    ysize:2,
    skipList:{
      0:{
        0:true
      }
    },
    transitionAtOnce:2
  }, cb);
});

var capGainsTax1 = PromiseMaker(function(cb, duration) {
  fadeInNewBlocks({
    duration:duration,
    xsize:40,
    ysize:25,
    width: g.thousandSizeHoz,
    height: g.thousandSizeVert,
    margin: g.thousandMargin,
    skipArray: [
      {
        rows:1,
        cols:5,
        rowstart:4,
        colstart:0
      },
      {
        rows:4,
        cols:10,
        rowstart:0,
        colstart:0
      }
    ],
    color:"#5590BF",
    transitionAtOnce:100
  }, cb);
});

var capGainsTax2 = PromiseMaker(function(cb, duration) {
  var config = {
    duration:duration,
    xsize:40,
    ysize:12,
    xstart: g.millionSizeHoz + g.millionMargin,
    ystart: 0,
    width: g.thousandSizeHoz,
    height: g.thousandSizeVert,
    margin: g.thousandMargin,
    skipArray: [
      {
        rows:1,
        cols:11,
        rowstart:11,
        colstart:29
      }
    ],
    color:"#5590BF",
    transitionAtOnce:100
  };
  fadeInNewBlocks(config, cb);
});

var fadeInFirstBillionOfUntaxedIncome = PromiseMaker(function(cb, duration) {
  var config = {
    duration:duration,
    xsize:40,
    ysize:25,
    xstart:0,
    ystart:0,
    width: g.millionSizeHoz,
    height: g.millionSizeVert,
    margin: g.millionMargin,
    verticalOrder: true,
    skipArray: [
      {
        rows:2,
        cols:3,
        rowstart:0,
        colstart:0
      }
    ],
    color:"#aaaaaa",
    transitionAtOnce:10
  };
  fadeInNewBlocks(config, cb);
});

var fadeInNewBlocks = function(config, cb) {

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
  var color = config.color || "#ECF2F8";

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
  console.log(skipList);
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
  console.log(order);
  var n = order.length;
  var genOpacities = function(n, p, s) {
    var m = -1/s;
    var x0 = p*(n+s);
    var y0 = (0-m)*x0;
    var r = [];
    for (var i = 0;i<n;i++) {
      r.push(Math.max(0,Math.min(1,m*i + y0)));
    }
    return r;
  };

  var blocks;

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
      cb();
    }
  };
  var startTime = Date.now();
  frame();
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
  label.text("← This block represents one million dollars.")
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

var describeIncome = PromiseMaker(function(cb, duration) {
  var label = g.objects.describe65 = $(document.createElement("div")); 
  $(sel).find(".animation-inner").append(label);
  label.text("Assuming a 10% rate of return (the rough average for Berkshire Hathaway stock")
    .css("left","30%")
    .css("top","40%")
    .css("font-size","12pt")
    .css("color","#ECf2F8")
    .css("position","absolute")
    .hide()
    .fadeIn(duration, cb);
});

var describe65Billion = PromiseMaker(function(cb, duration) {
  var label = g.objects.describe65 = $(document.createElement("div")); 
  $(sel).find(".animation-inner").append(label);
  label.text("Warren Buffet's net worth is $65 billion.")
    .css("left","30%")
    .css("top","40%")
    .css("font-size","12pt")
    .css("color","#ECf2F8")
    .css("position","absolute")
    .hide()
    .fadeIn(duration, cb);
});

var fadeOut65BillionDesc = PromiseMaker(function(cb, duration) {
  g.objects.describe65.fadeOut(duration, cb);
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
  g.AGIRects.attr("fill","#ECF2F8")
    .attr("class","highlighted");
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

var highlightTax = PromiseMaker(function(cb, duration) {
  var ysize = 11.6;
  var xsize = 7.175;
  var margin = 0.2;
  var xbottom = 3367.5;
  var yright = 4467.5;
  var tax = 1.845557;
  var rect1 = drawGrid(1,1, xbottom-1*(xsize+margin)+margin/2, yright - 1*(ysize+margin)+margin/2, margin, xsize, ysize);
  var rect2 = drawGrid(1,1, xbottom-1*(xsize+margin)+margin/2, yright - tax*(ysize+margin)+margin/2, margin, xsize, ysize*(tax-1));
  g.taxRects = d3.selectAll(rect1.nodes().concat(rect2.nodes()));
  g.taxRects.attr("fill","#FFCE6D")
    .attr("class","highlighted");
  g.taxRects.attr("opacity",0)
    .transition()
    .duration(duration)
    .attr("opacity",1)
    .on("end",cb);
});

var zoomBackOut = PromiseMaker(function(cb, duration) {
  g.svg.transition()
    .duration(duration)
    .attr("viewBox","0 0 10000 5000")
    .on("end", cb);
});

var removeMillionLines = PromiseMaker(function(cb, duration) {
  g.millionLines.transition()
    .duration(duration)
    .attr("opacity",0)
    .on("end", function() {
      d3.select(this).remove();
      cb();
    });
});

var moveGroupsBack = PromiseMaker(function(cb, duration) {
  g.svg.selectAll(".billionBox").each(function() {
    var self = d3.select(this);
    self.transition()
      .duration(duration)
      .attr("width",self.attr("data-orgwidth"))
      .attr("height",self.attr("data-orgheight"))
      .attr("x",self.attr("data-orgx"))
      .attr("y", self.attr("data-orgy"))
      .on("end", cb);
  });
  g.svg.selectAll(".highlighted").each(function() {
    var self = d3.select(this);
    var x = self.attr("x")*1;
    var y = self.attr("y")*1;
    self.transition()
      .duration(duration)
      .attr("x",x-55/2)
      .attr("y",y-55/2);
  });
});

var fadeOut = PromiseMaker(function(cb, duration) {
  $(sel).find(".animation-wrap").fadeOut(duration, function() {
    $(sel).find(".animation-wrap").show().css("visibility","hidden");
  });
});