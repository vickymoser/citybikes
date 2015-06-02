function AbstractFunction(weight) {
	this.weight = weight;


	this.__type = 'abstract_function';

	console.log("Function with weight"+weight);
};




AbstractFunction.prototype = {
    constructor: AbstractFunction,

    toString:function ()  {
        return "AbstractFunction" ;
    },
    setValueForKey:function(key, val) {
    	if (key == "weight") {
    		this.weight = val;
    		return false;
    	}
    	return false;
    },
    lineFunctionX :function(datarow) {
		return datarow.x;
	},
	lineFunctionY :function(datarow) {
		return datarow.x;
	},
	copy :function() {
		return AbstractFunction.fromJSON(JSON.stringify(this));
	}
};


AbstractFunction.fromJSON = function(json) {
	if (json.__type === 'composed_function') {
		return ComposedFunction.fromJSON(json);
	} 	if (json.__type === 'linear_function') {
		return LinearFunction.fromJSON(json);
	} else if (json.__type === 'quadratic_function') {
		return QuadraticFunction.fromJSON(json);
	} else if (json.__type === 'gaussian_function') {
		return GaussianFunction.fromJSON(json);
	}
}

function LinearFunction(weight, k, d) {

	AbstractFunction.call(this, weight);

	this.k = k;
	this.d = d;
	this.__type = 'linear_function';
};

LinearFunction.fromJSON = function(json) {
	if (json.__type === 'linear_function') {
		return new LinearFunction(json.weight, json.k, json.d);
	}
};

LinearFunction.prototype = {
    constructor: LinearFunction,

    updateK :function(newValue) {
    	this.k = newValue;
    	console.log(newValue);
    },
    setValueForKey:function(key, val) {
    	if (key == "weight") {
    		this.weight = val;
    		return true;
    	}
    	else if (key == "k") {
    		this.k = val;
    		return true;
    	}
		else if (key == "d") {
    		this.d = val;
    		return true;
    	}

    	return false;
    },
    lineFunctionY :function(datarow) {
		return this.weight* (this.k*datarow.x +this.d);
	},
    lineFunctionX :function(datarow) {
		return datarow.x;
	},
    toString:function ()  {
        return "LinearFunction(w:"+this.weight+",k:"+this.k+"d:"+this.d+")" ;
    }
};


function ComposedFunction() {

	AbstractFunction.call(this, 1);
	this.functions = [];
	
	this.__type = 'composed_function';

};

ComposedFunction.fromJSON = function(json) {
	if (json.__type === 'composed_function') {

		var obj = new ComposedFunction();

		for (var i = 0; i< json.functions.length ; i++) {
			subJSON = json.functions[i];

			obj.addFunction(AbstractFunction.fromJSON(subJSON));
		};

		return obj;
	}
};

ComposedFunction.prototype = {
    constructor: ComposedFunction,
    addFunction:function (f)  {
        this.functions.push(f)
    },    
    lineFunctionX :function(datarow) {
		return datarow.x;
	},
    setValueForKey:function(key, val) {
		throw "Not Implemented on Type"+ this.__type;
    },
	getFunction: function(index){
		return this.functions[index];
	},
    lineFunctionY :function(datarow) {
		var val = 0;

		for (var i = this.functions.length - 1; i >= 0; i--) {
			val += this.functions[i].lineFunctionY(datarow);
		};

		return val / this.functions.length;
	},
    removeFunction:function (f)  {
		var i = array.indexOf(f);
		if(i != -1) {
			array.splice(i, 1);
		}
    },
    toString:function ()  {
        var stringBuilder = "ComposedFunction subfunctions {" ;

        for (var i =0 ; i < this.functions.length; i++) {
        	if (i>0) {
        		stringBuilder += ",";
        	}
        	stringBuilder += this.functions[i].toString();
        };
        stringBuilder += "}"

        return stringBuilder;
    }
};


function QuadraticFunction(weight) {

	AbstractFunction.call(this, weight);

	
	this.__type = 'quadratic_function';

};

QuadraticFunction.fromJSON = function(json) {
	if (json.__type === 'quadratic_function') {
		return new QuadraticFunction(json.weight);
	}
};

QuadraticFunction.prototype = {
    constructor: QuadraticFunction,
    lineFunctionX :function(datarow) {
		return datarow.x;
	},
	lineFunctionY:function(d) {
		return this.weight * d.x * d.x;
	},
    toString:function ()  {
        return "QuadraticFunction" ;
    }
};


function GaussianFunction(weight, a, b, c) {

	AbstractFunction.call(this, weight);

	this.a = a;
	this.b = b;
	this.c = c;
	
	this.__type = 'gaussian_function';

};

GaussianFunction.fromJSON = function(json) {
	if (json.__type === 'gaussian_function') {
		return new GaussianFunction(json.weight, json.a, json.b, json.c);
	}
};

GaussianFunction.prototype = {
    constructor: GaussianFunction,
    lineFunctionX :function(datarow) {
		return datarow.x;
	},
	setValueForKey:function(key, val) {
    	if (key == "weight") {
    		this.weight = val;
    		return true;
    	}
    	else if (key == "a") {
    		this.a = val;
    		return true;
    	}
		else if (key == "b") {
    		this.b = val;
    		return true;
    	}
		else if (key == "c") {
    		this.c = val;
    		return true;
    	}

    	return false;
    },
	lineFunctionY:function(d) {

		var helper = d.x - this.b;

		helper *= helper;

		var helper2 = this.c * this.c;


		var innerValue = - helper/(2*helper2);

		return this.weight * this.a * Math.exp(innerValue);
	},
    toString:function ()  {
        return "GaussianFunction" ;
    }
};


