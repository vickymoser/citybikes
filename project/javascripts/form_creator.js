



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


function createFunction(f, identifier) {

var str ="<div class=\"functioncontainer\" title=\"functionstitle\" onclick =\"toggleShowDetail(event)\">"+
			"<p class=\"functionname\">"+ f.name +": " + f.formula + "</p>"+
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
							"<input oninput=\"amount.value=rangeInput.value\" id=\"slider"+identifier+"\" type=\"range\" min=\"0\" max=\"200\" name=\"rangeInput\" />"+
							"<input size=\"3\" id=\"box\" type=\"text\" value=\"0\" name=\"amount\" for=\"rangeInput\"  oninput=\"rangeInput.value=amount.value\" />"+
				    	"</div>"+
				    "</form>";
					};


				    

			str+="</p></div></div>"

	return str;
}