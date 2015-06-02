
// D3 code for the bar chart

// Step 2: set up plot size and margins
var chartWidth = 800,
    chartHeight = 400;

var chartIsReady = false;
 
var margin = {top: 20, right: 40, bottom: 30, left: 40},
    width = chartWidth - margin.left - margin.right,
    height = chartHeight - margin.top - margin.bottom;
 
var svg = d3.select("#chart")
    .attr("width", chartWidth)
    .attr("height", chartHeight);
 
var chart = svg.append("g")
   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var activeIndexes = [];


var phantomFunction = null;
var phantomLineFunc;

var selectedFunction = new ComposedFunction();

var newFunction = null;


var lineFunc;

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

var onDataLoaded = null;



var data = [];

var filteredData = [];

var composedFilterFunction = new ComposedFilterFunction(new FilterTime('1.2.2012', 2));

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
  var timeParseHelper = new FilterTime('1.2.2012', 2);

  return{
    //fahrtnummer : +d.Fahrtnummer,
    entlehnstation : +d.Entlehnstation,
    entlehnzeitpunkt :  timeParseHelper.parseTimeLong( d.Entlehnzeitpunkt ) , // use function
    //rueckgabestation : +d.Rueckgabestation,
    //rueckgabezeitpunkt : timeParseHelper.parseTimeLong( d.Rueckgabezeitpunkt ), //use function
    //zweck : d.Zweck,
    land : d.Land
    //touristcard : touristencardComp // 0 = nein, 1 = ja*/

  };
}



function graphFromData () {
  var filePath = "data/fahrten_2012.csv";
  var cssv = d3.dsv(";","text/plain");

  cssv(filePath, parseCitbikeData, function(error,data) {
    if(error != null) {
      console.log(error);
    }

    if( data == null) {
      throw "data is null";
    }
  });
}

function updateGraph() {
  graphFromData();


  var minYValue = 0,
      maxYValue = d3.max(filteredData, function(d) {return selectedFunction.lineFunctionY(d); });

  var minXValue = d3.min(filteredData, function(d) {return selectedFunction.lineFunctionX(d);}),
      maxXValue = d3.max(filteredData, function(d) {return selectedFunction.lineFunctionX(d);});

  console.log("maxYValue updated"+maxYValue);

  xScale.domain([minXValue, maxXValue]);
  yScale.domain([minYValue, maxYValue]);


  var t = chart.transition().duration(200);

  t.select("g.xaxis").call(xAxis);
  t.select("g.yaxis").call(yAxis);

  t.select('.line').delay(200).transition(200)
    .attr('d', lineFunc(filteredData));


    if (phantomLineFunc != null) {
       t.select('#phantomline').transition(200)
        .attr('d', phantomLineFunc(filteredData));
    }


    for (var i = activeIndexes.length - 1; i >= 0; i--) {
      var activeIndex = activeIndexes[i];


        console.log("UPDATE INDEX "+activeIndex);

      t.select('#hoverline'+activeIndex).transition(200)
      .attr('d', lineFunctionForIndex(activeIndex)(filteredData));

    };



}

function lineFunctionForIndex(index) {
  var hoveredFunction = selectedFunction.getFunction(index);

  var functionsCount = selectedFunction.functions.length;

  var individualLineFunction = d3.svg.area()
  .x(function(d) {
    return xScale(hoveredFunction.lineFunctionX(d));
  })
  .y0(function(d) {
    return yScale(0);
  })
  .y1(function(d) {
    return yScale( ( 1 / functionsCount )* hoveredFunction.lineFunctionY(d));
  })
  .interpolate('basis');

  return individualLineFunction;
}


function showPhantomFunction() {

  phantomFunction = Function.fromJSON(JSON.stringify(selectedFunction));


  phantomLineFunc = d3.svg.line()
  .x(function(d) {
    return xScale(phantomFunction.lineFunctionX(d));
  })
  .y(function(d) {
    return yScale(phantomFunction.lineFunctionY(d));
  })
  .interpolate('basis');


  chart.append('svg:path')
    .attr('id','phantomline')
    .attr('class','phantomline')
    .attr('d', lineFunc(filteredData))
    .attr('stroke', 'red')
    .attr('stroke-width', 2)
    .attr('fill', 'none');
}

function hidePhantomFunction() {
    selectedFunction = phantomFunction;
    phantomFunction = null;
    phantomLineFunc = null;

    d3.select('#phantomline').remove();

    updateGraph();
}


function showFunction(index) {



  if (document.getElementById('hoverline'+index)) {return;}

  activeIndexes.push(index);

  var hoveredFunction = selectedFunction.getFunction(index);

  var functionsCount = selectedFunction.functions.length;

  //console.log("COUNT "+functionsCount);



  var zeroLineFunction = d3.svg.area()
  .x(function(d) {
    return xScale(hoveredFunction.lineFunctionX(d));
  })  
  .y0(function(d) {
    return yScale(0);
  })
  .y1(function(d) {
    return yScale(0);
  })
  .interpolate('basis');;



  var individualLineFunction = lineFunctionForIndex(index);



  chart.append('svg:path')
    .attr('id','hoverline'+index)
    .attr('class','hoverline')
    .attr('d', zeroLineFunction(filteredData))
    .attr('stroke', 'grey')
    .attr('stroke-width', 1)
    .attr('fill', '#d3d3d3');

  d3.select('#hoverline'+index).transition(200)
  .attr('d', individualLineFunction(filteredData));


}


function hideFunction(index) {


  var zeroLineFunction = d3.svg.area()
  .x(function(d) {
    return xScale(d.x);
  })
  .y0(function(d) {
    return yScale(0);
  })
  .y1(function(d) {
    return yScale(0);
  })
  .interpolate('basis');;


  d3.select('#hoverline'+index).transition(200)
  .attr('d', zeroLineFunction(filteredData)).each("end", function() {
    d3.select('#hoverline'+index).remove();
    var i = activeIndexes.indexOf(index);
    if(i != -1) {
      activeIndexes.splice(i, 1);
    }

  });
}


function DataRow(x) {
	this.x = x;
};


// Step 3: load data file
// This is asynchronous so we should wait until we get data 
// before making the chart
d3.csv("csv_name.csv", function(error, data) {
  // Convert strings to numbers

	filteredData = [];

	for (var i = 20 - 1; i >= 0; i--) {
		filteredData.push(new DataRow(i));
	};


  //TODO: Filter data




  //TODO:

  selectedFunction.addFunction(new GaussianFunction(0.3, 3, 5, 2));
  selectedFunction.addFunction(new GaussianFunction(0.3, 3, 12, 2));


  //selectedFunction.addFunction(new QuadraticFunction(0.3));


  


  // Compute the extents of the data
  var minYValue = 0,
      maxYValue = d3.max(filteredData, function(d) {return selectedFunction.lineFunctionY(d); });

  var minXValue = d3.min(filteredData, function(d) {return selectedFunction.lineFunctionX(d);}),
      maxXValue = d3.max(filteredData, function(d) {return selectedFunction.lineFunctionX(d);});

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




  lineFunc = d3.svg.line()
  .x(function(d) {
    return xScale(selectedFunction.lineFunctionX(d));
  })
  .y(function(d) {
    return yScale(selectedFunction.lineFunctionY(d));
  })
  .interpolate('basis');


  chart.append('svg:path')
    .attr('class','line')
    .attr('d', lineFunc(filteredData))
    .attr('stroke', 'red')
    .attr('stroke-width', 2)
    .attr('fill', 'none');




    if (onDataLoaded != null) {
       onDataLoaded();
    }
    onDataLoaded = null;

    chartIsReady = true;

});
