
/*
  <!-- implementation of the hosted D3- and TopoJson js-libraries -->
  <script src="http://d3js.org/d3.v3.js"></script>
  <script src="../scripts/topojson.js"></script>

*/
//Creates a MapView and renders it into th element with the specified id
function cityBikeChart(chartId, containerId) {

function DataRow(x, y) {
  this.x = x;
  this.y = y;
};

d3.select(window).on('resize', resize); 

var containerId = containerId;
//Default Values for margin, height, width
var chartWidth = 800,
    chartHeight = 400;

var margin = {top: 20, right: 40, bottom: 40, left: 40},
    width = chartWidth - margin.left - margin.right,
    height = chartHeight - margin.top - margin.bottom;


var bandWidth = 0.5;

var xScale = d3.scale.linear() // The between-group axis
    .range([0, width]);

var yScale = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

var data;
var filteredData = [];

var chartIsReady = false;
 
 
var svg = d3.select(chartId)
    .attr("width", chartWidth)
    .attr("height", chartHeight);
 
var chart = svg.append("g")
   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Contains Functions which are displayed when hovering over a function
//[{key:"examplekey", val:"Descendant AbstractFunction"}]

var hoverFunctions = [];

var currentFunction = new ComposedFunction();

//TODO: Christoph
//var currentFilter = new ComposedFilterFunction();

var oldFunction = null;

var onReadyCallback = null;



var predictionLineFunction = null;




//Anfang für Christoph


/*
 Parses the "fahrten"
 Note: -I changed the names of the times to "ue" in the csv
 -csv is separated with semicolon
 -https://github.com/mbostock/d3/wiki/CSV#parse
 */
function parseCitbikeData(d) {
  //makes touristcard smaller
  /*var touristencardComp = 0;
  if( "ja" == d.Touristcard ) {
    touristencardComp = 1;
  }*/
  var bufferString = d.Entlehnzeitpunkt.split(" ");

  var bufferString1 = bufferString[0].split("-");
  var year = parseInt( bufferString1[0] );
  var month = parseInt( bufferString1[1] ) - 1; //offset
  var day = parseInt( bufferString1[2] );

  var bufferString2 = bufferString[1].split(":");
  var hour = parseInt( bufferString2[0] );
  var minute = parseInt( bufferString2[1] );
  var second = parseInt( bufferString2[2].split(".")[0] );


  return{

    //fahrtnummer : +d.Fahrtnummer,
    entlehnstation : +d.Entlehnstation,
    entlehnzeitpunkt :  new Date( year, month, day, hour, minute, second) , // use function
    //rueckgabestation : +d.Rueckgabestation,
    //rueckgabezeitpunkt : timeParseHelper.parseTimeLong( d.Rueckgabezeitpunkt ), //use function
    //zweck : d.Zweck,
    land : d.Land
    //touristcard : touristencardComp // 0 = nein, 1 = ja*/

  };
}


function loadData(completion) {
 
    var fileFahrtenPath = "data/fahrten_2012.csv";
    var cssv = d3.dsv(";", "text/plain");
    console.log("starting parsing data");

    cssv(fileFahrtenPath, parseCitbikeData, function (error, d) {
      if (error != null) {
        console.log(error);
      }

      if (d == null) {
        console.log("data is null");
      } else {
        data = d;
        var length = d.length;
        var timeParseHelper = new FilterTime();
        timeParseHelper.changeTime('1.4.2012', 2);
        var composedFilterFunction = new ComposedFilterFunction();
        composedFilterFunction.addFilter(timeParseHelper);
        console.log("getting graph");
        for (var i = 0; i < length; i++) {
          composedFilterFunction.includeLine( d[i] ) ;
        }
        //console.log(loop);
        console.log(composedFilterFunction.getGraph());

      }
      
        completion();
    });
}

loadData( function() {

  currentFunction.addFunction(new GaussianFunction(0.3, 3, 5, 2));

  currentFunction.addFunction(new GaussianFunction(0.3, 3, 10, 2));

  // Generate Some Dummy Data
  filteredData = [];

  for (var i = 20 - 1; i >= 0; i--) {
    filteredData.push(new DataRow(i, Math.random()));
  };

  chartIsReady = true;
  if (onReadyCallback != null) {
    onReadyCallback();
    onReadyCallback = null;
  }
  show();
  });

  function createCopyOfFunction( element) {
    console.log("CREATE COPY 1: "+element);

    var strVal = JSON.stringify(element);
    console.log("CREATE COPY 2: "+strVal);

    var c = AbstractFunction.fromJSON(JSON.parse(strVal));

    console.log("CREATE COPY 3");

    return c;
  }

  function generateZeroAreaFunction() {
    return d3.svg.area()
    .x(function(d) {
      return xScale(d.x);
    })
    .y0(function(d) {
      return yScale(0);
    })
    .y1(function(d) {
      return yScale(0);
    })
    .interpolate('basis');
  }

  function my() {
    // generate chart here, using Default Parameters
  }

  my.onChartReady = function(value) {
    if (!arguments.length) {
      return onReadyCallback;
    }

    if (chartIsReady) {
      value();
      //Chart is already Initialized Call immediatly
    } else {
      onReadyCallback = value;
    }

    return my;
  }

  my.updateFunctionValue = function(index, key, value) {
    var f = currentFunction.getFunction(index);

    var newVal = value/100;



    if (key == 'a') {

      newVal =  (newVal*2);
    }   
    if (key == 'c') {

      newVal =  (newVal*3 );
    }
    if (key == 'b') {

      newVal =  (newVal*filteredData.length);
    }




    f.setValueForKey(key, newVal);
  }


  function addHoverFunctionForKey(index) {

  //Sets the selected Districts 
  //Calling this method also redraws the map to show the new selection


    var funcKey = "hover"+index;

    //Check if Hover Function For This Index Is already being shown

    var found = false;


    for (var i = hoverFunctions.length - 1; i >= 0; i--) {
      var keyValuePair = hoverFunctions[i];

      var keysEqual = keyValuePair == funcKey; 


      found = found | keysEqual;
    };

    if (!found) {

      console.log("HOVER FUNCTION NOT PRESENT");
      var functionsCount = currentFunction.functions.length;


      console.log("ADD HOVER 1");
      var keyValuePair = funcKey;

      console.log("ADD HOVER 2");
      console.log(""+keyValuePair);

      console.log("ADD HOVER 3");
      hoverFunctions.push(keyValuePair);


      var zeroAreFunction = generateZeroAreaFunction();

      var hoverAreaFunction = weightedAreaFunctionForIndex(+index);

      chart.append('svg:path')
      .attr('class','hoverline')
      .attr('id', funcKey)
      .attr('d', zeroAreFunction(filteredData))
      .attr('stroke', 'grey')
      .attr('stroke-width', 1)
      .attr('fill', '#d3d3d3');

      d3.select('#'+funcKey)
      .transition(200)
      .attr('d', hoverAreaFunction(filteredData));



    } else {

      console.log("HOVER FUNCTION ALREADY PRESENT");
    }

    //redraw();

    //TODO: Copy Function and add to hover Functions

  }

    my.addHoverFunctionForKey = function(index) {

      addHoverFunctionForKey(index);
    }

  //Adds the passed values to the selected Districts if tey are not already present
  //Calling this method also redraws the map to show the new selection
  my.removeHoverFunctionForKey = function(index) {
    var funcKey = "hover"+index;

    //Check if Hover Function For This Index Is already being shown

    var found = false;
    var index = -1;


    for (var i = hoverFunctions.length - 1; i >= 0; i--) {
      var keyValuePair = hoverFunctions[i];

      var keysEqual = keyValuePair == funcKey;
     
      if (keysEqual) {
        index = i;
      }

      found = found | keysEqual;
    };

    if (found) {

      var zeroAreFunction = generateZeroAreaFunction();
      hoverFunctions.splice(index, 1);

      d3.select('#'+funcKey)
      .transition(200)
      .attr('d', zeroAreFunction(filteredData))
      .each("end", function() {
        d3.select('#'+funcKey).remove();
      });
    }



  }


  my.addFunction = function(value) {
    if (value) {
      currentFunction.addFunction(value);
      redraw(true);
    } 
    return my;
  }

  my.currentFunction = function() {
    return currentFunction;
  }

  var valueTransitionInProgress = false;
  

  my.beginValueTransition = function() {
    console.log("TRANSITION BEGIN");

    valueTransitionInProgress = true;
    oldFunction = createCopyOfFunction(currentFunction);

    var phantomlineFunction = generateLineForFunction(oldFunction);

      chart.append('svg:path')
      .attr('class','phantomline')
      .attr('d', phantomlineFunction(filteredData))
      .attr('stroke', '#d3d3d3')
      .style("stroke-dasharray", ("6, 3"))
      .attr('stroke-width', 1)
      .attr('fill', 'none');
    //TODO: Copy Current Function and Store in old
  }

  my.transitionValueUpdated = function() {

    console.log("TRANSITION UPDATE");
    if (valueTransitionInProgress) {
      redraw();
    }

  }

  my.endValueTransition = function() {
    console.log("TRANSITION END");
    valueTransitionInProgress = false;
    oldFunction = null;

    chart.select('.phantomline').remove();



    redraw(true);
    //TODO: Remove phantom function 
  }


  function generateLineForFunction(value) {
    return d3.svg.line()
    .x(function(d) {
      return xScale(value.lineFunctionX(d));
    })
    .y(function(d) {
      return yScale(value.lineFunctionY(d));
    })
    .interpolate('basis');
  }

  function generateAreaForFunction(value) {
    return d3.svg.area()
    .x(function(d) {
      return xScale(value.lineFunctionX(d));
    })
    .y0(function(d) {
      return yScale(0);
    })
    .y1(function(d) {
      return yScale(value.lineFunctionY(d));
    })
    .interpolate('basis');
  }

  function weightedAreaFunctionForIndex(index) {

    var functionsCount = currentFunction.functions.length;
    var f = currentFunction.getFunction(index);

    return d3.svg.area()
    .x(function(d) {
      return xScale(f.lineFunctionX(d));
    })
    .y0(function(d) {
      return yScale(0);
    })
    .y1(function(d) {
      return yScale(f.lineFunctionY(d)/functionsCount);
    })
    .interpolate('basis');
  }

  function resize() {

      console.log("resize");
    if (containerId == null) {return;}


    chartWidth = parseInt(d3.select(containerId).style('width'), 10);
       width = chartWidth - margin.left - margin.right;


    xScale.range([0, width]);

    yScale = d3.scale.linear()
    .range([height, 0]);


    redraw();
    
  }

  function redraw(animated)
  {
    if (!animated) {
      animated = false;
    }

    if (!chartIsReady) {return;};



  if (!valueTransitionInProgress) {
    var minYValue = 0,
        maxYValue = d3.max(filteredData, function(d) {return currentFunction.lineFunctionY(d); });

        var actualmaxYValue = d3.max(filteredData, function(d) {return d.y; });

        maxYValue = Math.max(actualmaxYValue,maxYValue);



    var minXValue = d3.min(filteredData, function(d) {return currentFunction.lineFunctionX(d);}),
        maxXValue = d3.max(filteredData, function(d) {return currentFunction.lineFunctionX(d);});

    console.log("maxYValue updated"+maxYValue);

    xScale.domain([minXValue, maxXValue]);
    yScale.domain([minYValue, maxYValue]);


    var t = chart;

    if (animated) {
         t = chart.transition().duration(200);
    }

    t.select("g.xaxis").call(xAxis);
    t.select("g.yaxis").call(yAxis);

    actualLineFunction = d3.svg.line()
    .x(function(d) {
      return xScale(d.x);
    })
    .y(function(d) {
      return yScale(d.y);
    })
    .interpolate('basis');


    var selection = d3.select('.actualline');

    if (animated) {
      selection = selection.transition(200);
    }

    selection.attr('d', actualLineFunction(filteredData));



    var actualLineBand = d3.svg.area()
    .x(function(d) {
      return xScale(d.x);
    })
    .y0(function(d) {
      return yScale(d.y - bandWidth/2);
    })
    .y1(function(d) {
      return yScale(d.y + bandWidth/2);
    })
    .interpolate('basis');

    selection = d3.select('.band');

    if (animated) {
      selection = selection.transition(200);
    }

    selection.attr('d', actualLineBand(filteredData));


  }



    predictionLineFunction = generateLineForFunction(currentFunction);


    var selection = d3.select('.line');

    if (animated) {
      selection = selection.transition(200);
    }

    selection.attr('d', predictionLineFunction(filteredData));


    if (valueTransitionInProgress) {

      var phantomlineFunction = generateLineForFunction(oldFunction);

    var selection = chart.select('.phantomline');

    if (animated) {
      selection = selection.transition(200);
    }

    selection
      .attr('d', phantomlineFunction(filteredData));
    }

    for (var i = hoverFunctions.length - 1; i >= 0; i--) {
      var keyValuePair = hoverFunctions[i];

      var key = keyValuePair;

      var index = key.replace("hover","");

      console.log("index "+index);

      var hoverAreaFunction =weightedAreaFunctionForIndex(index);


      var selection = chart.select('#'+key);

      if (animated) {
        selection = selection.transition(200);
      }

      selection.attr('d', hoverAreaFunction(filteredData));


    }
  }

  //Draws the MapView
  //Shows Current Selection in the Mapview
  function show()
  {
    if (!chartIsReady) {return;};



    // Compute the extents of the data
    var minYValue = 0,
        maxYValue = d3.max(filteredData, function(d) {return currentFunction.lineFunctionY(d); });

    var minXValue = d3.min(filteredData, function(d) {return currentFunction.lineFunctionX(d);}),
        maxXValue = d3.max(filteredData, function(d) {return currentFunction.lineFunctionX(d);});

    // Step 4: add scales
   // y is backwards because 0 is the top left corner
    xScale.domain([minXValue, maxXValue]);
    yScale.domain([minYValue, maxYValue]);

    // Step 5: set up the axes

    
    chart.append("g")
         .attr("class", "xaxis")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis);
    chart.append("g")
         .attr("class", "yaxis")
         .call(yAxis);

    chart.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", chartHeight - 30)
      .text("Zeit");

    predictionLineFunction = generateLineForFunction(currentFunction);


    

    actualLineFunction = d3.svg.line()
    .x(function(d) {
      return xScale(d.x);
    })
    .y(function(d) {
      return yScale(d.y);
    })
    .interpolate('basis');



    actualLineBand = d3.svg.area()
    .x(function(d) {
      return xScale(d.x);
    })
    .y0(function(d) {
      return yScale(d.y - bandWidth/2);
    })
    .y1(function(d) {
      return yScale(d.y + bandWidth/2);
    })
    .interpolate('basis');

    chart.append('svg:path')
      .attr('class','band')
      .attr('d', actualLineBand(filteredData))
      .attr('stroke', 'none')
      .attr('stroke-width', 2)
      .attr('fill', 'green')
      .attr('opacity', 0.1);
    //Actual Line
    chart.append('svg:path')
      .attr('class','actualline')
      .attr('d', actualLineFunction(filteredData))
      .attr('stroke', 'green')
      .attr('stroke-width', 2)
      .attr('fill', 'none');

    //Actual Line Margin

    chart.append('svg:path')
      .attr('class','line')
      .attr('d', predictionLineFunction(filteredData))
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .attr('fill', 'none');



    if (valueTransitionInProgress) {

      var phantomlineFunction = generateLineForFunction(oldFunction);

      chart.append('svg:path')
      .attr('class','phantomline')
      .attr('d', phantomlineFunction(filteredData))
      .attr('stroke', 'grey')
      .attr('stroke-width', 2)
      .attr('fill', 'none');
    }

    for (var i = hoverFunctions.length - 1; i >= 0; i--) {
      var keyValuePair = hoverFunctions[i];

      var key = keyValuePair.key;
      var f = keyValuePair.val;

      var hoverAreaFunction = generateAreaForFunction(f);

      chart.append('svg:path')
      .attr('class','hoverline')
      .attr('id', key)
      .attr('d', hoverAreaFunction(filteredData))
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('fill', 'grey');

    }
  }



  //TODO: Update Filter 

  //




  return my;
}

