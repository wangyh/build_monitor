var ArrayExtension = {
	each : function(func){
		for(var i=0; i<this.length; i++){
			func(this[i]);
		}
	},

	map : function(func){
		var result = [];
		for(var i=0;i<this.length;i++){
			result.push(func(this[i]));
		}
		return result;
	},

	findAll : function(predicate){
		var result = [];
		for(var i=0; i<this.length; i++){
			if(predicate(this[i])){
				result.push(this[i]);
			}
		}
		return result;
	},

	any : function(predicate){
		for(var i=0; i<this.length; i++){
			if(predicate(this[i])){
				return true;
			}
		}
		return false;
	},
	
	all : function(predicate){
		return !this.any(function(i) { return !predicate(i)});
	},
	
	contains: function(value){
		return this.any(function(i) {return i === value});
	}
};

Function.prototype.extend = function(module){
	function Func(){};
	Func.prototype = this.prototype;
	this.prototype = new Func();
	for(name in module){
		this.prototype[name] = module[name];
	}
};

Array.extend(ArrayExtension);
