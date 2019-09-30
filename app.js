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
    .then(moveStuffAtEnd(500000));


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
g.speedFactor = 10;
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
  fadeInNewBlocks({
    duration:duration,
    xsize:1,
    ysize:1,
    xstart: 0,
    ystart: 0,
    width: g.thousandSizeHoz,
    height: g.thousandSizeVert,
    margin: g.thousandMargin,
    identifier:"firstThousand",
    color:colors[0],
    transitionAtOnce:1
  }, cb);
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
    identifier: "firstMillion",
    xsize:1,
    ysize:1,
    transitionAtOnce:1,
    color:colors[1],
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
    identifier:"threeBillion",
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
    transitionAtOnce:25,
    identifier:"restOfSalary"
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
    color:"#C75459",
    identifier:"ordinaryTax",
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
    color:colors[1],
    ysize:25,
    verticalOrder:true,
    identifier:"firstMillionOfCapGains",
    skipArray:[{rows: 10, cols: 10, rowstart: 0, colstart: 0}],
    transitionAtOnce:100
  }, cb);
});

var moveStuffAtEnd = PromiseMaker(function(cb, duration) {
  var starts1 = [];
  g.svg.selectAll("[data-identifier='restOfCapGains'], [data-identifier='firstMillion']")
    .transition(duration)
    .attr("x",function(d, i) {
      starts1[i] = starts1[i] || d3.select(this).attr("x")*1;
      var r = starts1[i] + g.billionSizeHoz + g.billionMargin;
      console.log(r);
      return r;
    });
  var starts2 = [];
  g.svg.selectAll("[data-identifier='restOfSalary'], [data-identifier='firstThousand'], [data-identifier='firstMillionOfCapGains']")
    .attr("opacity",0);
  console.log(g.svg.selectAll("[data-identifier='restOfCapGains'], [data-identifier='firstMillionOfCapGains']"));
  g.svg.selectAll("[data-identifier='capGainsTax1'], [data-identifier='capGainsTax2'], [data-identifier='ordinaryTax']")
    .transition(duration)
    .attr("x", function(d, i) {
      starts2[i] = starts2[i] || d3.select(this).attr("x")*1;
      var r = starts2[i] + g.billionSizeHoz + g.billionMargin + 6*g.millionSizeHoz;
      console.log(r);
      return r;
    })
    .on("end", cb);
});

var fillOutRestOfCapGains = PromiseMaker(function(cb, duration) {
  fadeInNewBlocks({
    duration:duration,
    xsize:3,
    ysize:2,
    color:colors[1],
    identifier:"restOfCapGains",
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
    identifier:"capGainsTax1",
    skipArray: [
      {
        rows:10,
        cols:10,
        rowstart:0,
        colstart:0
      }
    ],
    color:"#C75459",
    transitionAtOnce:100
  }, cb);
});

var capGainsTax2 = PromiseMaker(function(cb, duration) {
  var config = {
    duration:duration,
    xsize:40,
    ysize:13,
    xstart: g.millionSizeHoz + g.millionMargin,
    ystart: 0,
    width: g.thousandSizeHoz,
    height: g.thousandSizeVert,
    margin: g.thousandMargin,
    identifier:"capGainsTax2",
    skipArray: [
      {
        rows:1,
        cols:16,
        rowstart:12,
        colstart:24
      }
    ],
    color:"#C75459",
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
    identifier:"firstBillionUntaxed",
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

var solidifyTax = PromiseMaker(function(cb, duration) {
  var identifiers = [
    "restOfSalary",
    "capGainsTax1",
    "capGainsTax2",
    "ordinaryTax",
    "firstThousand"
  ];
  var selector = [];
  identifiers.forEach(function(el) {
    selector.push("[data-identifier='" + el + "']");
  });
  selector = selector.join(",");
  var gridTax = g.svg.selectAll(selector).filter(function() {
    return d3.select(this).attr("data-gridless")===true;
  });
  var gridlessTax = g.svg.selectAll(selector).filter("[data-gridless]");
  gridlessTax.transition()
    .duration(duration)
    .attr("opacity",1)
    .on("end", cb);
  gridTax.transition()
    .duration(duration)
    .attr("opacity",0);
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
  var color = config.color || colors[0];
  var identifier = config.identifier;
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
      r.push(Math.max(0,Math.min(1,m*i + y0)));
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
          .attr("width",width + margin*1.1)
          .attr("height",height + margin*1.1)
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

/*repeated events*/
var waitFor = PromiseMaker(function(cb, duration) {
  setTimeout(cb, duration);
});