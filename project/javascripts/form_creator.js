

var functionsCount = 0;


var weightParam = {name:"Weight",key:"weight", decription:"impact of function in result"};



//Linear Function
var kParam = {name:"K",key:"k" , decription:"slope of the line"};
var dParam = {name:"D",key:"d" , decription:"intercept - denotes the portion on the y axis"};

var linearFormula = "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mrow> <mn>kx+d</mn></mrow></mrow></math>";

var linearFunctionForm = {name:"Linear Function", formula:linearFormula, params:[weightParam,kParam,dParam]};

//Gaussian
var aParam = {name:"A",key:"a" , decription:"height of the curve's peak"};
var bParam = {name:"B",key:"b" , decription:"position of the center of the peak"};
var cParam = {name:"C",key:"c" , decription:"controls the width of the \"bell\""};

var gaussFormula = "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>a exp - </mi><mfrac><mrow><msup><mi>(x-b)</mi><mn>2</mn></msup></mrow><mrow><msup><mi>2c</mi><mn>2</mn></msup></mrow></mfrac></mrow></math>";

var gaussFunctionForm = {name:"Gaussian Function", formula:gaussFormula, params:[weightParam,aParam,bParam,cParam]};


function createFunction(f) {

	var identifier = functionsCount;
	functionsCount++;

var str ="<div class=\"functioncontainer\" id=\"functioncontainer_"+identifier+"\" title=\"functionstitle\"  onMouseEnter=\"slOnMouseEnter(event)\" onMouseLeave=\"slOnMouseLeave(event)\">"+
			"<p class=\"functionname\" onclick =\"slToggleShowDetail(event)\">"+ f.name +": " + f.formula + "</p>"+
			"<!-- Overview -->"+
			"<div class = \"overviewcontainer\">";


				for (var i = 0; i<f.params.length; i++) {
					var param = f.params[i];

					str += "<span class=\"functionparameter\">"+ param.name+": </span><span class=\"functionparametervalue\">10</span>"
				};

		str+="</div>"+
		"<!-- Details -->"+
		"<div class=\"detailcontainer hidden\" id=\"hidden_div\" >"+
				"<p>";

				for (var i = 0; i<f.params.length; i++) {
					var param = f.params[i];

					str +=  "<form style=\"padding :0px; background-color: transparent;\">"+
						"<div>"+
							"<span class=\"functionparameter\">"+param.name+": </span><span class=\"functionparametervalue\">"+param.description+"</span>"+
							"</br>"+
							"<input oninput=\"amount.value=rangeInput.value;slOnValueChanged(event);\" id=\"slider_"+param.key+"_"+identifier+"\" type=\"range\" min=\"0\" max=\"200\" name=\"rangeInput\" onMouseDown=\"slOnMouseDown(event)\" onMouseUp=\"slOnMouseUp(event)\"/>"+
							"<input size=\"3\" id=\"box\" type=\"text\" value=\"0\" name=\"amount\" for=\"rangeInput\"  oninput=\"rangeInput.value=amount.value\" />"+
				    	"</div>"+
				    "</form>";
					};


				    

			str+="</p></div></div>"

	return str;
}


	function slToggleShowDetail(event) {

		var t = event.target;

		$(t).parent().find('.overviewcontainer').toggleClass('hidden');
		$(t).parent().find('.detailcontainer').toggleClass('hidden');

	}

	function slOnMouseEnter (event) {
		console.log("ENTER");
		var t = event.target;
		var comps = t.id.split("_");

		var index = +comps[1];

		bikeChart.addHoverFunctionForKey(index);

	}

	function slOnMouseDown(event) {
		console.log("DOWN");

		bikeChart.beginValueTransition();
	}

	function slOnValueChanged(event) {
		

		var t = event.target;
		var comps = t.id.split("_");

		var key = comps[1];
		var index = +comps[2];
		var val = +t.value / 100;

        bikeChart.updateFunctionValue(index,key, val );

        bikeChart.transitionValueUpdated();

		console.log("CHANGE:"+comps+":"+val);
	}


	function slOnMouseUp(event) {
		console.log("UP");
		bikeChart.endValueTransition();
	}

	function slOnMouseLeave(event) {
		console.log("LEAVE");
		var t = event.target;
		var comps = t.id.split("_");

		var index = +comps[1];

		bikeChart.removeHoverFunctionForKey(index);
	}