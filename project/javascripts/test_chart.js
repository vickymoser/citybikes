function chart(config) {
  var chartWidth = 720, // default width
      chartHeight = 80; // default height

  var margin = {top: 20, right: 40, bottom: 30, left: 40},
    width = chartWidth - margin.left - margin.right,
    height = chartHeight - margin.top - margin.bottom;


  function my() {
    // generate chart here, using `width` and `height`
  }

  my.chartHeight = function(value) {
    if (!arguments.length) return chartHeight;
    chartHeight = value;
    height = chartHeight - margin.top - margin.bottom;
    return my;
  };

  my.chartWidth = function(value) {
    if (!arguments.length) return chartWidth;
    chartWidth = value;
    width = chartWidth - margin.left - margin.right;
    return my;
  };

  my.margin = function(value) {
    if (!arguments.length) return margin;
    margin = value;
    width = chartWidth - margin.left - margin.right;
    height = chartHeight - margin.top - margin.bottom;

    return my;
  };

  return my;
}