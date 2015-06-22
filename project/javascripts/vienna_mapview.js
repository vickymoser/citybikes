
/*
  <!-- implementation of the hosted D3- and TopoJson js-libraries -->
  <script src="http://d3js.org/d3.v3.js"></script>
  <script src="../scripts/topojson.js"></script>

*/
//Creates a MapView and renders it into th element with the specified id
function mapSelection(mapViewId) {

//Default Values for margin, height, width
var margin = {top: 20, right: 10, bottom: 20, left: 10}; 
var width = 450 - margin.left - margin.right;
var height = 350 - margin.top - margin.bottom;


//Initialize selected districts
var selectedDistricts = [];

var projection = d3.geo.mercator().scale(1);
var svg = d3.select(mapViewId).append("svg").attr("width", width).attr("height", height);
    svg.append("rect").attr("class", "background").attr("width", width).attr("height", height);
var path = d3.geo.path().projection(projection);

var g = svg.append("g");

var wien;

var box;
var s;
var sorg;
var b;
var q=0;

var didSelectCallBack;
var didUnSelectCallBack;

var isReady = false;


//Read data from topojson file and draw map on completion
d3.json("geo/wien.json", function(temp) {
//console.log(temp);

  var obj = temp.objects.wien;

  wien = topojson.feature(temp, obj);

  console.log(wien);

  isReady = true;
  show();
});


  function my() {
    // generate chart here, using Default Parameters


  }

  //Sets the selected Districts 
  //Calling this method also redraws the map to show the new selection
  my.selectedDistricts = function(value) {
    if (!arguments.length) return selectedDistricts;


    selectedDistricts = value;

    show();
    return my;
  };

  //Adds the passed values to the selected Districts if tey are not already present
  //Calling this method also redraws the map to show the new selection
  my.selectDistricts = function(values) {

    for (var i = 0; i<values.length; i++) {
      var distr = values[i];

      var idx = selectedDistricts.indexOf(distr);

      if (idx == -1) {
        selectedDistricts.push(distr);
      }



    };

    show();
    return my;
  }
  //Removed the passed values to the selected Districts if tey are present
  //Calling this method also redraws the map to show the new selection
  my.unselectDistricts = function(value) {

    for (var i = value.length - 1; i >= 0; i--) {
      var distr = +value[i];

      var i = selectedDistricts.indexOf(distr);

      if (i != -1) {
        selectedDistricts.splice(i, 1);
      }
    };

    show();
    return my;
  }

  //Set The Call back method for a specified event
  //Valid Events are "selec", "unselect"
  //function gets passed the districtnumber which was selected/ unselected
  //select Callback gets called after the user clicks on a currently not selected district on the map
  //unselect Callback gets called after the user clicks on a currently selected district on the map
  //Setting selected districts with selectedDistricts(), selectDistricts(), selcectDistrict(), unselectDistricts(), unselcectDistrict() does not trigger callbacks
  my.on = function(evt, callbackFunction) {
    if (evt == "select") {
      didSelectCallBack = callbackFunction;
    } else if (evt == "unselect") {
      didUnSeletCallBack = callbackFunction;
    } else {
      throw "No Callbacks for event: "+evt;
    }

    return my;
  };
//Selects a single district
function selectDistrict(value) {
    var i = selectedDistricts.indexOf(+value);
    if(i == -1) {
      selectedDistricts.push(+value);
    }

    return my;
}

//Unselects a single district
function unselectDistrict(value) {
    var i = selectedDistricts.indexOf(+value);
    if(i != -1) {
      selectedDistricts.splice(i, 1);
    }

    return my;
  }

//Draws the MapView
//Shows Current Selection in the Mapview
function show()
{
  if (!isReady) {return;};

b = path.bounds(wien);
box = d3.geo.bounds(wien);
s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
sorg = s;
projection.scale(s).center([(box[0][0]+box[1][0])/2,(box[0][1]+box[1][1])/2]).translate([width/2,height/2]);

g.append("g").selectAll("path").data(wien.features).enter().append("path").attr('d', path).attr("id",function(d){return d.properties.BEZNR;}).
    attr("class", function(d) {
      var cl ="mappath";

      var beznr = +d.properties.BEZNR;


      var i = selectedDistricts.indexOf(beznr);

      if (i != -1) {

        cl += " selected";
      } 


      return cl;

    }).on("click", function (d, i) {

            var setSelected = true;

            if (d3.select(this).classed("selected")) {
              setSelected = false;
            }
            // Select current item
            d3.select(this).classed("selected", setSelected);
            if (setSelected && didSelectCallBack) {
              selectDistrict(d.properties.BEZNR);
              didSelectCallBack(d.properties.BEZNR);

            }
            if (!setSelected && didUnSeletCallBack) {
              unselectDistrict(d.properties.BEZNR);
              didUnSeletCallBack(d.properties.BEZNR);
            }

        }).append("title").text(function(d,i){ return d.properties.BEZNR;});
}

  return my;
}



/*
Sample

A new Map View can becreated like this
Methods can be chained

var mapsSelect = mapSelection("#mapq").
on("select", function(id) {
  console.log("didSelectCallBack"+id);
}).
on("unselect",function(id) {
  console.log("didUnSelectCallBack"+id);
});
*/
