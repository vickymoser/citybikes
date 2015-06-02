function chart() {
  var chartWidth = 720, // default chartWidth
      chartHeight = 80; // default chartHeight

  var margin = {top: 20, right: 40, bottom: 30, left: 40}, // default margin
    width = chartWidth - margin.left - margin.right,
    height = chartHeight - margin.top - margin.bottom;

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


  var composedFunction = new ComposedFunction();

  function my() {
    // generate chart here, using `chartWidth` and `chartHeight`
  }

  my.appendFunction = function(value) {
  	if (!arguments.length) return chartWidth;

    chartWidth = value;
    return my;
  }

  my.chartWidth = function(value) {
    if (!arguments.length) return chartWidth;
    chartWidth = value;
    return my;
  };


  my.chartHeight = function(value) {
    if (!arguments.length) return chartHeight;
    chartHeight = value;
    return my;
  };

  my.margin = function(value) {
    if (!arguments.length) return margin;
    margin = value;
    return my;
  };


  return my;
}
