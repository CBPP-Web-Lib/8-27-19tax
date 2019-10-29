module.exports = function(g) {
var $ = g.$;
var sel =  g.sel;
var colors = g.colors;
var d3 = g.d3;
var PromiseMaker = g.PromiseMaker;
var fadeInNewBlocks = g.fadeInNewBlocks;
g.events = {};
g.events.drawOneThousand = PromiseMaker(function(cb, duration) {
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
    color:"#FFCE6D",
    transitionAtOnce:1
  }, cb);
});

g.events.recolorStartBox = PromiseMaker(function(cb, duration) {
  g.svg.selectAll("rect[data-identifier='firstThousand']")
    .transition()
    .duration(duration)
    .attr("fill", colors[0])
    .on("end", cb);
});

g.events.introText = PromiseMaker(function(cb, duration) {
  var text = "Imagine a billionaire founder and CEO of a large tech company.";
  var div = g.objects.introText = $(document.createElement("div"))
    .css("width","44%")
    .css("height","60%")
    .css("position","absolute")
    .css("top","10%")
    .css("right",0)
    .css("text-align","center")
    .css("font-size","24pt")
    .text(text);
  $(sel).find(".animation-inner").append(div);
  div.hide().fadeIn(duration, cb);
});

g.events.fadeOutIntroText = PromiseMaker(function(cb, duration) {
  g.objects.introText.fadeOut(duration, cb);
});

g.events.describeOneThousand = PromiseMaker(function(cb, duration) {
  var coords = svgCoordsToPercentOfViewBox(0,g.thousandSizeVert*1.7);
  var text = g.objects.describeOneThousand = $(document.createElement("div"))
    .addClass("annotation")
    .html("&darr; This rectangle represents one thousand dollars.")
    .css("left", (coords.x*100) + "%")
    .css("color","#FFCE6D")
    .css("top", (coords.y*100) + "%");
  $(sel).find(".animation-inner").append(text);
  text.hide().fadeIn(duration, cb);
});

g.events.describeSalary = PromiseMaker(function(cb, duration) {
  var text = "She earns a $1 million annual salary...";
  var obj = g.objects.salaryDesc = $(document.createElement("div"))
    .addClass("annotation")
    .css("right",0)
    .css("top","30%")
    .css("width","44%")
    .css("text-align","center")
    .text(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
});

g.events.describeSalaryTax = PromiseMaker(function(cb, duration) {
  var text = "...on which she pays about $365,000 in federal income and payroll taxes (not counting potential deductions.)";
  var obj = g.objects.salaryTaxDesc = $(document.createElement("div"))
    .addClass("annotation")
    .css("right",0)
    .css("top","40%")
    .css("width","44%")
    .css("text-align","center")
    .text(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
});

g.events.fadeInCover = PromiseMaker(function(cb, duration) {
  var obj = g.objects.textCover = $(document.createElement("div"))
    .css("background","linear-gradient(to right, rgba(10, 80, 135, 0), rgba(10, 80, 135, 100) 20%)")
    /*rgb(10, 80, 135);*/
    .css("width","45%")
    .css("height","100%")
    .css("right",0)
    .css("top",0)
    .css("position","absolute");
  $(sel).find(".animation-inner").append(obj);
  console.log(obj);
    obj.hide().fadeIn(duration, cb);

});

g.events.fadeInCover2 = PromiseMaker(function(cb, duration) {
  console.log("cover 2");
  var obj = g.objects.textCover2 = $(document.createElement("div"))
    .css("background","linear-gradient(to right, rgba(10, 80, 135, 0), rgba(10, 80, 135, 100) 5%)")
    /*rgb(10, 80, 135);*/
    .css("width","60%")
    .css("height","100%")
    .css("right",0)
    .css("top",0)
    .css("position","absolute");
  $(sel).find(".animation-inner").append(obj);
  console.log(obj);
    obj.hide().fadeIn(duration, cb);

});

g.events.fadeOutCover = PromiseMaker(function(cb, duration) {
  g.objects.textCover.fadeOut(duration, cb);
});

g.events.fadeInStockExplainer = PromiseMaker(function(cb, duration) {
  var text = "But most of her income comes from her large holdings of her company’s stock, which gain about $1 billion per year in value.";
  var obj = g.objects.stockExplainer = $(document.createElement("div"))
    .addClass("annotation")
    .css("right",0)
    .css("top","7%")
    .css("width","40%")
    .css("text-align","center")
    .text(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
});

g.events.realizedGainsExplainer = PromiseMaker(function(cb, duration) {
  var text = "Now, let's assume she sells $100 million worth of stock each year, and the entire amount represents a gain.";
  var obj = g.objects.realizedGainsExplainer = $(document.createElement("div"))
    .addClass("annotation")
    .css("right",0)
    .css("top","42%")
    .css("width","40%")
    .css("text-align","center")
    .text(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
});

g.events.realizedGainsTaxExplainer = PromiseMaker(function(cb, duration) {
  console.log("hello");
  var text = "That gain is taxed at a 23.8% rate (well below the 37% top rate on wages and salaries.)";
  var obj = g.objects.realizedGainsTaxExplainer = $(document.createElement("div"))
    .addClass("annotation")
    .css("right",0)
    .css("top","75%")
    .css("width","40%")
    .css("text-align","center")
    .text(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
});

g.events.fadeOutGains = PromiseMaker(function(cb, duration) {
  g.objects.realizedGainsExplainer
    .add(g.objects.stockExplainer)
    .add(g.objects.realizedGainsTaxExplainer)
    .fadeOut(duration, cb);


});

g.events.unrealizedGains = PromiseMaker(function(cb, duration) {
  fadeInNewBlocks({
    duration: duration,
    width: g.millionSizeHoz,
    height: g.millionSizeVert,
    margin: g.millionMargin,
    identifier: "unrealizedGains",
    xsize:25,
    ysize:40,
    xstart: g.millionSizeHoz + g.millionMargin,
    skipArray:[{rows: 10, cols: 10, rowstart: 0, colstart: 0}],
    transitionAtOnce:10,
    color:"#69879b",
    verticalOrder:true
  }, cb);
});


g.events.fadeInCapGains = PromiseMaker(function(cb, duration) {
  fadeInNewBlocks({
    duration: duration,
    width: g.millionSizeHoz,
    height: g.millionSizeVert,
    margin: g.millionMargin,
    identifier: "realizedCapGains",
    xsize:10,
    ysize:10,
    xstart: g.millionSizeHoz + g.millionMargin,
    transitionAtOnce:5,
    color:colors[1],
    prepend:true
  }, cb);
});

g.events.fadeInCapGainsTax = PromiseMaker(function(cb, duration) {
  fadeInNewBlocks({
    duration: duration,
    width: g.millionSizeHoz,
    height: g.millionSizeVert,
    margin: g.millionMargin,
    identifier: "realizedCapGainsTax",
    xsize:10,
    ysize:3,
    xstart: g.millionSizeHoz + g.millionMargin,
    skipArray:[{rows: 1, cols: 6, rowstart: 2, colstart: 4}],
    transitionAtOnce:5,
    color:"#C75459"
  }, cb);
});

g.events.gainsTaxExplainer = PromiseMaker(function(cb, duration) {
  var text = "This capital gains income is taxed at a 23.8% rate, well below the 37% top rate on wages and salaries.";
  var obj = g.objects.gainsTaxExplainer = $(document.createElement("div"))
    .addClass("annotation")
    .css("right",0)
    .css("width","30%")
    .css("text-align","center")
    .css("top","60%")
    .text(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
});

g.events.unrealizedExplainer = PromiseMaker(function(cb, duration) {
  var text = "She doesn’t pay any tax on the rest of the $1 billion-a-year growth in her stock.";
  var obj = g.objects.unrealizedExplainer = $(document.createElement("div"))
    .addClass("annotation")
    .css("right","5%")
    .css("width","50%")
    .css("text-align","center")
    .css("top","20%")
    .text(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
});

g.events.unrealizedExplainer2 = PromiseMaker(function(cb, duration) {
  //var text = "If she never sells any of it, the tax liability on her unsold gains goes away when she dies.";
  var text = "On the stocks she never sells, the income tax liability on all her gains is wiped out when she dies.";
  var obj = g.objects.unrealizedExplainer2 = $(document.createElement("div"))
    .addClass("annotation")
    .css("right","5%")
    .css("width","50%")
    .css("text-align","center")
    .css("top","45%")
    .html(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);

});

g.events.fadeOutUnrealizedExplainers = PromiseMaker(function(cb, duration) {
  g.objects.unrealizedExplainer
    .add(g.objects.unrealizedExplainer2)
    .add(g.objects.textCover2)
    .fadeOut(duration, cb);
});

g.events.moveIncome = PromiseMaker(function(cb, duration) {
  var identifiers = [
    'restOfSalary',
    'realizedCapGains',
    'firstThousand'
  ];
  var sel = [];
  identifiers.forEach(function(i) {
    sel.push("rect[data-identifier='" + i + "']");
  });
  var income = g.svg.selectAll(sel.join(", ")).transition()
    .duration(duration)
    .attr("x", function() {
      var start = d3.select(this).attr("x")*1;
      return start + (g.millionSizeHoz + g.millionMargin)*20;
    })
    .attr("opacity",1)
    .on("end", cb);    
});

g.events.moveUnrealizedIncome = PromiseMaker(function(cb, duration) {
  g.svg.selectAll("rect[data-identifier='unrealizedGains']")
    .transition()
    .duration(duration)
    .attr("x", function() {
      var start = d3.select(this).attr("x")*1;
      //console.log(this);
      return start + (g.millionSizeHoz + g.millionMargin)*35;
    })
    .attr("opacity",1)
    .on("end", cb);
});

g.events.explainUnrealized = PromiseMaker(function(cb, duration) {
  var text = "This income never even appears on her tax return.";
  var obj = g.objects.unrealizedExplainer = $(document.createElement("div"))
    .addClass("annotation")
    .css("right","8.5%")
    .css("width","35%")
    .css("text-align","center")
    .css("top","40%")
    .css("line-height",1.1)
    .text(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
});

g.events.explainRealized = PromiseMaker(function(cb, duration) {
  var text = "This income is all that appears on her tax return.&nbsp;&darr;";
  var obj = g.objects.realizedExplainer = $(document.createElement("div"))
    .addClass("annotation")
    .css("right","53%")
    .css("width","20%")
    .css("text-align","right")
    .css("top","55%")
    .css("line-height",1.1)
    .html(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
});

g.events.explainTax = PromiseMaker(function(cb, duration) {
  var text = "This is the total federal income tax that she paid.<br>&darr;"; 
  var obj = g.objects.realizedExplainer = $(document.createElement("div"))
    .addClass("annotation")
    .css("right","78.5%")
    .css("width","20%")
    .css("text-align","left")
    .css("top","66%")
    .css("line-height",1.1)
    .html(text);
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
});

g.events.summary = PromiseMaker(function(cb, duration) {
  var text = "The CEO pays less than two and a half percent of her total income in taxes in a given year.";
  var obj = g.objects.summary = $(document.createElement("div"))
    .addClass("annotation")
    .css("left","0")
    .css("width","50%")
    .css("text-align","left")
    .css("top","10%")
    .css("line-height",1.1)
    .css("font-size","35px")
    .html(text); 
  $(sel).find(".animation-inner").append(obj);
    obj.hide().fadeIn(duration, cb);
});




function svgCoordsToPercentOfViewBox(x, y) {
  var viewBox = g.svg.attr("viewBox").split(" ");
  var left = (x - viewBox[0])/(viewBox[2]);
  var bottom = (y - viewBox[1])/(viewBox[3])-1;
  return {x:left,y:1-bottom};
}

g.events.fadeOutOneThousandDescription = PromiseMaker(function(cb, duration) {
  g.objects.describeOneThousand.fadeOut(duration, cb);
});

g.events.fadeOutSalaryTax = PromiseMaker(function(cb, duration) {
  g.objects.salaryTaxDesc.fadeOut(duration, cb);
});

g.events.fadeOutSalary = PromiseMaker(function(cb, duration) {
  g.objects.salaryDesc.fadeOut(duration, cb);
});

g.events.seriesOfAdditionalBlocks = PromiseMaker(function(cb, duration) {
  fadeInNewBlocks({
    skipList:{0:{0:true}},
    duration:duration,
    width: g.thousandSizeHoz,
    height: g.thousandSizeVert,
    margin: g.thousandMargin,
    xsize:40,
    ysize:1,
    transitionAtOnce:2,
    identifier:"additionalBlocks"
  }, cb);
});

g.events.restOfSalary = PromiseMaker(function(cb, duration) {
  fadeInNewBlocks({
    duration:duration,
    width: g.thousandSizeHoz,
    height: g.thousandSizeVert,
    margin: g.thousandMargin,
    ystart:g.thousandSizeVert + g.thousandMargin,
    xsize:40,
    ysize:24,
    transitionAtOnce:40,
    identifier:"restOfSalary"
  }, cb);
});

g.events.ordinaryIncomeTaxBlocks = PromiseMaker(function(cb, duration) {
  fadeInNewBlocks({
    duration:duration,
    width: g.thousandSizeHoz,
    height: g.thousandSizeVert,
    margin: g.thousandMargin,
    xsize:40,
    ysize:10,
    color:"#C75459",
    identifier:"ordinaryTax",
    skipArray:[{rows: 1, cols: 35, rowstart: 9, colstart: 5}],
    transitionAtOnce:50
  }, cb);
});

g.events.zoomToViewBoxMaker = function(viewbox) {
  return PromiseMaker(function(cb, duration) {
    g.svg.transition()
      .duration(duration)
      .attr("viewBox", viewbox)
      .on("end", cb);
  });
};


/*
  textLocks.lockTextElToSVGEl(
    g.objects.untaxedGainsFinal6[0], 
    bottomRightCapGains[bottomRightCapGains.length - 1], 
    "totalTaxPaid"
  );

  textLocks.lockTextElToSVGEl(
    g.objects.untaxedGainsFinal5[0],
    topLeftCapGains[topLeftCapGains.length - 1],
    "IRSknown"
  );

  textLocks.lockTextElToSVGEl(
    g.objects.untaxedGainsFinal4[0],
    topRightBillions[topRightBillions.length - 1],
    "Billions"
  );

  g.svg.transition()
    .duration(duration)
    .attr("viewBox", "9800 -1600 3200 1600")
    .on("end", cb);
});*/

var TextLocker = function() {
  var locks = {};
  this.lockTextElToSVGEl = function(textEl, svgEl, lockid) {
    var startingSVGCoords = $(svgEl).offset();
    console.log(startingSVGCoords);
    var startingTextCoords = {
      top: $(textEl).offset().top - $(textEl).parent().offset().top,
      left: $(textEl).offset().left - $(textEl).parent().offset().left
    };
    console.log(startingTextCoords);
    locks[lockid] = true;
    var frame = function() {
      if (locks[lockid]) {
        var svgCoords = $(svgEl).offset();
        var change = {
          top: svgCoords.top - startingSVGCoords.top,
          left: svgCoords.left - startingSVGCoords.left
        };
        //console.log(change);
        var textCoords = {
          top: startingTextCoords.top + change.top,
          left: startingTextCoords.left + change.left
        };
        $(textEl).css({
          top: textCoords.top + "px",
          left: textCoords.left + "px",
          bottom:"",
          right:""
        });
        window.requestAnimationFrame(frame);
      }
    };
    window.requestAnimationFrame(frame);
  };
  this.removeLock = function(lockid) {
    delete(locks[lockid]);
  };
};

g.events.fadeOutAllAtEnd = PromiseMaker(function(cb, duration) {
  $(g.svg.node()).fadeOut(duration, cb);
  $(sel).find(".annotation").fadeOut(duration);
});


g.events.solidifyTax = PromiseMaker(function(cb, duration) {
  var identifiers = [
    "ordinaryTax"
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

g.events.solidifyAll = PromiseMaker(function(cb, duration) {
  g.svg.selectAll("[data-identifier='realizedCapGainsTax']")
    .transition()
    .duration(duration)
    .attr("opacity",1)
    .on("end", cb);
});

var textLocks = new TextLocker();

/*repeated events*/
g.events.waitFor = PromiseMaker(function(cb, duration) {
  setTimeout(cb, duration);
});

};