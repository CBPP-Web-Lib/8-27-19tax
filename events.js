module.exports = function(g) {
var $ = g.$;
var sel =  g.sel;
var colors = g.colors;
var d3 = g.d3;
var PromiseMaker = g.PromiseMaker;
var fadeInNewBlocks = g.fadeInNewBlocks;
var polygonClipping = g.polygonClipping;
g.events = {};
g.events.drawOneThousand = PromiseMaker(function(cb, duration) {
  g.shapes = g.svg.append("g")
    .attr("class","shapes")
    .attr("transform","matrix(1 0 0 -1 0 0)");
  g.objects.firstThousand = fadeInNewBlocks({
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
  var text = "Imagine a wealthy person whose income comes mostly from investments in the stock market.";
  var div = g.objects.introText = $(document.createElement("div"))
    .css("width","44%")
    .css("height","60%")
    .css("position","absolute")
    .css("top","5%")
    .css("right",0)
    .css("text-align","center")
    .css("font-size","24pt")
    .text(text);
  $(sel).find(".animation-inner").append(div);
  div.hide().fadeIn(duration, cb);
});

g.events.oneYearHerStocks = PromiseMaker(function(cb, duration) {
  var text = "One year her stocks appreciate by $10 million in value. This income doesn’t count as income on her tax return unless she sells the stock and realizes the gain. (Wages and salaries, in contrast, count as income in the year a worker earns them.)";
  var div = g.objects.oneYearHerStocks = $(document.createElement("div"))
    .css("width","44%")
    .css("height","60%")
    .css("position","absolute")
    .css("top","35%")
    .css("right",0)
    .css("text-align","center")
    .css("font-size","24pt")
    .text(text);
  $(sel).find(".animation-inner").append(div);
  div.hide().fadeIn(duration, cb);
});

g.events.fadeOutSlide1 = PromiseMaker(function(cb, duration) {
  g.objects.introText.fadeOut(duration, cb);
  g.objects.oneYearHerStocks.fadeOut(duration);
});

g.events.supposeSheSells = PromiseMaker(function(cb, duration) {
  var text = "Suppose she sells stocks with $2 million in gains.";
  var div = g.objects.supposeSheSells = $(document.createElement("div"))
    .css("width","44%")
   // .css("height","30%")
    .css("position","absolute")
    .css("top","15%")
    .css("right",0)
    .css("text-align","center")
    .css("font-size","24pt")
    .text(text);
  
  var backerDiv = $(document.createElement("div"))
    .css("width","47%")
    .css("height","100%")
    .css("position","absolute")
    .css("top",0)
    .css("right",0)
    .css("background-image","linear-gradient(to right, rgba(10, 80, 135, 0), rgba(10, 80, 135, 1) 5%)");
  $(sel).find(".animation-inner").append(backerDiv);
  $(sel).find(".animation-inner").append(div);
  div.hide().fadeIn(duration, cb);
});



g.events.theTwoMillion = PromiseMaker(function(cb, duration) {
  var text = "This $2 million is the only part of her $10 million gain that shows up on her tax return.";
  var div = g.objects.theTwoMillion = $(document.createElement("div"))
    .css("width","44%")
   // .css("height","30%")
    .css("position","absolute")
    .css("top","45%")
    .css("right",0)
    .css("text-align","center")
    .css("font-size","24pt")
    .text(text);
  $(sel).find(".animation-inner").append(div);
  div.hide().fadeIn(duration, cb);
});

g.events.fadeOutSlide2 = PromiseMaker(function(cb, duration) {
  g.objects.supposeSheSells.fadeOut(duration, cb);
  g.objects.theTwoMillion.fadeOut(duration);
});

g.events.plus238 = PromiseMaker(function(cb, duration) {
  var text = "Plus, her tax rate on the $2 million is 23.8%, well below the 37% top rate on wages and salaries."; 
  var div = g.objects.plus238 = $(document.createElement("div"))
    .css("width","44%")
   // .css("height","30%")
    .css("position","absolute")
    .css("top","10%")
    .css("right",0)
    .css("text-align","center")
    .css("font-size","24pt")
    .text(text);
  $(sel).find(".animation-inner").append(div);
  div.hide().fadeIn(duration, cb);
});

g.events.thisMeansThat = PromiseMaker(function(cb, duration) {
  var text = "This means that on $10 million of income that year, she pays $476,000 in tax..."; 
  var div = g.objects.thisMeansThat = $(document.createElement("div"))
    .css("width","44%")
   // .css("height","30%")
    .css("position","absolute")
    .css("top","45%")
    .css("right",0)
    .css("text-align","center")
    .css("font-size","24pt")
    .text(text);
  $(sel).find(".animation-inner").append(div);
  div.hide().fadeIn(duration, cb);
});

g.events.effectiveTaxRate = PromiseMaker(function(cb, duration) {
  var text = "...for an effective tax rate on this income of 5%."; 
  var div = g.objects.thisMeansThat = $(document.createElement("div"))
    .css("width","44%")
   // .css("height","30%")
    .css("position","absolute")
    .css("top","80%")
    .css("right",0)
    .css("text-align","center")
    .css("font-size","24pt")
    .text(text);
  $(sel).find(".animation-inner").append(div);
  div.hide().fadeIn(duration, cb);
});




g.events.millionBracket = PromiseMaker(function(cb, duration) {
  var bracket = g.objects.millionBracket = g.shapes.append("path")
    .attr("d", g.bracketPath)
    .attr("fill",colors[0])
    .attr("opacity",0)
    .attr("transform", "translate(" + g.millionSizeHoz + ",0)")
    .transition()
    .duration(duration)
    .attr("opacity",1)
    .on("end", cb);
});

g.events.millionBracketLabel = PromiseMaker(function(cb, duration) {
  var text = g.objects.millionBracketText = g.shapes.append("text")
    .text("One million dollars")
    .attr("fill","#fff")
    .attr("font-size",g.millionSizeVert/4)
    .attr("transform", "translate(" + (g.millionSizeHoz + g.millionMargin + 30) + "," + 7*g.millionSizeVert/16 + "),scale(1,-1)")
    .attr("opacity",0)
    .transition()
    .duration(duration)
    .attr("opacity",1)
    .on("end", cb);
});

g.events.fadeOutBracket = PromiseMaker(function(cb, duration) {
  var nodes = [g.objects.millionBracket.node(), g.objects.millionBracketText.node()];
  var toFade = d3.selectAll(nodes);
  toFade
    .transition()
    .duration(duration)
    .attr("opacity",0)
    .on("end", cb);
});

g.events.fadeOutIntroText = PromiseMaker(function(cb, duration) {
  g.objects.introText.fadeOut(duration, cb);
});

g.events.testLog = function(phrase) {
  return PromiseMaker(function(cb, duration) {
    console.log(phrase);
    cb();
  });
};

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




function svgCoordsToPercentOfViewBox(x, y) {
  var viewBox = g.svg.attr("viewBox").split(" ");
  var left = (x - viewBox[0])/(viewBox[2]);
  var bottom = (y - viewBox[1])/(viewBox[3])-1;
  return {x:left,y:1-bottom};
}

g.events.fadeOutOneThousandDescription = PromiseMaker(function(cb, duration) {
  g.objects.describeOneThousand.fadeOut(duration, cb);
});

g.events.seriesOfAdditionalBlocks = PromiseMaker(function(cb, duration) {
  g.objects.additionalBlocks = fadeInNewBlocks({
    skipList:{0:{0:true}},
    duration:duration,
    width: g.thousandSizeHoz,
    height: g.thousandSizeVert,
    margin: g.thousandMargin,
    xsize:40,
    ysize:25,
    easing: g.easeInPow(8),
    transitionAtOnce:20,
    identifier:"additionalBlocks"
  }, cb);
});

g.events.secondMillion = PromiseMaker(function(cb, duration) {
  g.objects.secondMillion = fadeInNewBlocks({
    duration:duration,
    width: g.millionSizeHoz,
    height: g.millionSizeVert,
    margin: g.millionMargin,
    xsize:1,
    ysize:1,
    ystart: g.millionSizeVert + g.millionMargin,
    verticalOrder: true,
    transitionAtOnce:1,
    identifier:"secondMillion"
  }, cb);
});

g.events.restOfMillionBlocks = PromiseMaker(function(cb, duration) {
  g.objects.millionBlocks = fadeInNewBlocks({
    skipList:{
      0:{
        0:true,
        1:true,
      }
      /*2: {
        2: true,
        3: true
      }*/
    },
    duration:duration,
    width: g.millionSizeHoz,
    height: g.millionSizeVert,
    margin: g.millionMargin,
    xsize:2,
    ysize:5,
    verticalOrder: true,
    easing: g.easeInPow(2),
    transitionAtOnce:2,
    identifier:"millionBlocks"
  }, cb);
});

g.events.highlightTwoMillion = PromiseMaker(function(cb, duration) {
  var nodes = g.svg.selectAll("[data-identifier='millionBlocks']:not([data-gridless])");
  nodes
    .transition()
    .duration(duration)
    .attr("opacity",0.3)
    .on("end", cb);
});

g.events.unhighlightTwoMillion = PromiseMaker(function(cb, duration) {
  var nodes = g.svg.selectAll("[data-identifier='millionBlocks']:not([data-gridless])");
  nodes
    .transition()
    .duration(duration)
    .attr("opacity",1)
    .on("end", cb);
});

g.events.fadeInTax = PromiseMaker(function(cb, duration) {
  g.objects.tax = fadeInNewBlocks({
    skipArray:[{rows: 1, cols: 4, rowstart: 11, colstart: 36}],
    duration:duration,
    width: g.thousandSizeHoz,
    height: g.thousandSizeVert,
    margin: g.thousandMargin,
    xsize:40,
    ysize:12,
    verticalOrder: true,
    easing: g.easeInPow(2),
    transitionAtOnce:25,
    identifier:"tax",
    color:"#C75459"
  }, cb);
});

g.events.zoomToViewBoxMaker = function(viewbox) {
  return PromiseMaker(function(cb, duration) {
    g.svg.transition()
      .duration(duration)
      .attr("viewBox", viewbox)
      .on("end", function() {
        console.log("done zooming");
        cb();
      });
  });
};

g.events.makeGridless = PromiseMaker(function(cb, duration) {
  var nodes = g.svg.selectAll("[data-gridless='true']")
    .filter(function() {
      var identifier = d3.select(this).attr("data-identifier");
      return {
        "additionalBlocks":true,
        "tax":true,
        "firstThousand":true
      }[identifier];
    })
    .raise()
    .transition()
    .duration(duration)
    .attr("opacity",1)
    .on("end", cb);
});

g.events.moveMillions = PromiseMaker(function(cb, duration) {
  var millions = g.objects.millionBlocks.blocks;
  var secondMillion = g.objects.secondMillion.blocks;
  millions.transition()
    .duration(duration)
    .attr("x", function(d) {
      var x= d3.select(this).attr("x");
      return x - g.millionMargin*d[0];
    })
    .attr("y", function(d) {
      var y = d3.select(this).attr("y");
      return y - g.millionMargin*d[1];
    })
    .attr("width", function() {
      return d3.select(this).attr("width")*1.01;
    })
    .attr("height", function() {
      return d3.select(this).attr("height")*1.01;
    })
    .on("end", cb);
  secondMillion.transition()
    .duration(duration)
    .attr("y", function() {
      var y = d3.select(this).attr("y");
      return y - g.millionMargin;
    })
    .attr("width", function() {
      return d3.select(this).attr("width")*1.01;
    })
    .attr("height", function() {
      return d3.select(this).attr("height")*1.01;
    });
});

g.events.simplifiedPath = PromiseMaker(function(cb, duration) {
  var polygonListFromSelection = function(selection) {
    var list = [];
    selection.each(function() {
      var obj = d3.select(this);
      var x = obj.attr("x")*1;
      var y = obj.attr("y")*1;
      var width = obj.attr("width")*1;
      var height = obj.attr("height")*1;
      list.push([[
        [x, y],
        [x + width, y],
        [x + width, y + height],
        [x, y + height],
        [x, y]
      ]]);
    });
    return list;
  };
  
  var tax = polygonListFromSelection(g.objects.tax.gridlessBlocks);
  var income = polygonListFromSelection(
    g.objects.firstThousand.gridlessBlocks
  ).concat(polygonListFromSelection(
    g.objects.additionalBlocks.gridlessBlocks
  )).concat(polygonListFromSelection(
    g.objects.secondMillion.blocks
    )).concat(polygonListFromSelection(
    g.objects.millionBlocks.blocks
  ));
  
  var pathString = function(polygon) {
    var str = "M" + polygon[0][0][0].join(",");
    for (var i = 1, ii = polygon[0][0].length; i<ii; i++) {
      str += ("L" + polygon[0][0][i].join(","));
    }
    str += "z";
    return str;
  };



  var combinedTax = pathString(polygonClipping.union.call(null, tax));
  var combinedIncome = pathString(polygonClipping.union.call(null, income));

  g.objects.combinedIncome = g.shapes.append("path")
  .attr("d", combinedIncome)
  .attr("stroke-width",0)
  .attr("fill",colors[0]);

  g.objects.combinedTax = g.shapes.append("path")
    .attr("d", combinedTax)
    .attr("stroke-width",0)
    .attr("fill", "#C75459");

  g.objects.firstThousand.blocks.remove();
  g.objects.firstThousand.gridlessBlocks.remove();
  g.objects.additionalBlocks.blocks.remove();
  g.objects.additionalBlocks.gridlessBlocks.remove();
  g.objects.secondMillion.blocks.remove();
  g.objects.secondMillion.gridlessBlocks.remove();
  g.objects.millionBlocks.blocks.remove();
  g.objects.millionBlocks.gridlessBlocks.remove();
  g.objects.tax.blocks.remove();
  g.objects.tax.gridlessBlocks.remove();
  cb();
});

g.events.animateToPie = PromiseMaker(function(cb, duration) {
  var toBasicRect = function(path) {
    var pathString = path.attr("d");
    var bbox = path.node().getBBox();
    pathString = pathString.split("M")[1];
    pathString = pathString.split("z")[0];
    pathString = pathString.split("L");
  
    for (var i = 0, ii = pathString.length; i<ii; i++) {
      pathString[i] = pathString[i].split(",");
      pathString[i][0]*=1;
      pathString[i][1]*=1;
    }
    var area = d3.polygonArea(pathString);
    var point_in_rect = function(coord, box) {
      if (coord[0]-0.06 <= box.x) {
        return false;
      }
      if (coord[0]+0.06 >= box.x + box.width) {
        return false;
      }
      if (coord[1]-0.06 <= box.y) {
        return false;
      }
      if (coord[1]+0.06 >= box.y + box.height) {
        return false;
      }
      return true;
    };

    var point_above = function(coord, box) {
      if (coord[1]+0.001 >= box.y + box.height) {
        return true;
      }
      return false;
    };

    
    var newHeight = Math.abs(area/bbox.width);
    var newPath = [];



    for (i = 0, ii = pathString.length; i<ii; i++) {
      if (point_in_rect(pathString[i], bbox)) {
        newPath[i] = [bbox.x + bbox.width, bbox.y + newHeight];
      } else if (point_above(pathString[i], bbox)) {
        newPath[i] = [pathString[i][0], bbox.y + newHeight];
      } else {
        newPath[i] = pathString[i];
      }
    }

    var newPathStringGen = function(path) {
      var str = "M" + path[0].join(",");
      for (var i = 1, ii = path.length; i<ii; i++) {
        str += "L" + path[i].join(",");
      }
      str += "z";
      return str;
    };

    var newString = newPathStringGen(newPath);

    return {path:newString, area:area};


  };
  var newCombinedTax = toBasicRect(g.objects.combinedTax);
  var newCombinedIncome = toBasicRect(g.objects.combinedIncome);

  var rectElement = function(orgPath) {
    var bbox = orgPath.getBBox();
    var fill = d3.select(orgPath).attr("fill");
    d3.select(orgPath).remove();
    return g.shapes.append("rect")
      .attr("x", bbox.x)
      .attr("y", bbox.y)
      .attr("width", bbox.width)
      .attr("height", bbox.height)
      .attr("stroke-width",0)
      .attr("fill", fill);
  };

  g.objects.combinedTax
    .transition()
    .duration(duration/4.1)
    .ease(d3.easeQuadIn)
    .attr("d", newCombinedTax.path)
    .on("end", function() {
      g.objects.combinedTax = rectElement(this);
      g.objects.combinedTax.raise();
    });
  g.objects.combinedIncome
    .transition()
    .duration(duration/4)
    .ease(d3.easeQuadIn)
    .attr("d", newCombinedIncome.path)
    .on("end", function() {
      g.objects.combinedIncome = rectElement(this);
      g.objects.combinedIncome.lower();
      var circleParms = transitionRectToCircle(g.objects.combinedIncome, function() {
        g.objects.combinedIncome.lower();
        g.objects.combinedTax.raise();
      }, 100, 100, 3*duration/4);
      circleParms.angle = newCombinedTax.area/newCombinedIncome.area * Math.PI*2;
      g.objects.combinedTax = transitionRectToArc(g.objects.combinedTax, circleParms, 3*duration/4, function() {
        g.objects.combinedIncome.lower();
        g.objects.combinedTax.raise();
        cb();
      });
      
    });

  function transitionRectToArc(rect, parms, duration, cb) {

    var arcPath = "M" + parms.x + "," + (parms.y - parms.r);
    arcPath += " A" + parms.r + " " + parms.r;
    arcPath += " 0 0 0";
    arcPath += " " + (parms.x - Math.sin(parms.angle)*parms.r);
    arcPath += " " + (parms.y - Math.cos(parms.angle)*parms.r);
    var rectCoords = rect.node().getBBox();
    arcPath +=  "L" + (parms.x - Math.sin(parms.angle)*parms.r) + "," + (parms.y - Math.cos(parms.angle)*parms.r) + 
      "L" + (parms.x - Math.sin(parms.angle)*parms.r) + "," + (parms.y - Math.cos(parms.angle)*parms.r) + 
      "L" + parms.x + "," + parms.y + "z";
    

    var startPath = "M " +
      (rectCoords.x + rectCoords.width) + "," + rectCoords.y;
    startPath += " A" + parms.r + " " + parms.r;
    startPath += " 0 0 0 "; 
    startPath += (rectCoords.x + rectCoords.width) + "," + rectCoords.y;
    startPath += "L" + rectCoords.x + "," + rectCoords.y +
      "L" + rectCoords.x + "," + (rectCoords.y + rectCoords.height) + 
      "L" + (rectCoords.x + rectCoords.width) + "," + (rectCoords.y + rectCoords.height) + "z";

    var fill = rect.attr("fill");
    rect.remove();
    var newPath = g.shapes.append("path")
      .attr("d", startPath)
      .attr("fill", fill)
      .attr("stroke-width",0);
    newPath.raise();
    newPath.transition()
      .duration(duration)
      .ease(d3.easeQuadOut)
      .attr("d", arcPath)
      .on("end", cb);
    return newPath;

  }

  function transitionRectToCircle(rect, cb, xgain, ygain, duration) {
    var width = rect.attr("width")*1;
    var height = rect.attr("height")*1;
    var area = (width)*height;
    var reduced_visual_area = (width*height);
    console.log(width, height);
    var radius = Math.sqrt(area/Math.PI);
    var fill = rect.attr("fill");
    var x = rect.attr("x")*1;
    var y = rect.attr("y")*1;
    var xdiff = (radius*2 - width)/2 - xgain;
    var ydiff = (radius*2 - height)/2 - ygain;
    var transitionOngoing = true;
    rect.attr("rx",0)
      .attr("ry",0)
      .attr("data-progress",0);
    rect.transition()
      .duration(duration)
      .ease(d3.easeQuadOut)
      .attr("x", x - xdiff)
      .attr("y", y - ydiff)
      .attr("rx",radius)
      .attr("ry",radius)
      .attr("data-progress",1)
      .attr("width", 2*radius)
      .on("end", function() {
        transitionOngoing = false;
        g.shapes.append("circle")
          .attr("cx", x - xdiff + radius)
          .attr("cy", y - ydiff + radius)
          .attr("r",radius)
          .attr("fill", fill)
          .attr("stroke","none")
          .attr("class", rect.attr("class"));
        rect.remove();
        if (typeof(cb)==="function") {cb();}
      });
    var holdAreaConstant = function() {
      var radius = rect.attr("rx")*1;
      var radius_sq = Math.pow(radius,2);
      var width = rect.attr("width")*1;
      var progress = rect.attr("data-progress");
      var frame_area = (area - reduced_visual_area)*progress + reduced_visual_area;
      var height = (frame_area + 4*radius_sq - Math.PI*radius_sq)/width;
      rect.attr("height",height);
      if (transitionOngoing) {
        window.requestAnimationFrame(holdAreaConstant);
      }
    };
    window.requestAnimationFrame(holdAreaConstant);
    
    return {
      x: x - xdiff + radius,
      y: y - ydiff + radius,
      r: radius
    };

  }

  

});


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
  console.log($(sel).find(".animation-inner"));
  $(sel).find(".animation-inner").fadeOut(duration, cb);
});

var textLocks = new TextLocker();

/*repeated events*/
g.events.waitFor = PromiseMaker(function(cb, duration) {
  setTimeout(cb, duration);
});

};