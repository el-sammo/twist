var x = 6;
var y = 4;

var a = function(b) { 
	return function(c) { 
		return y + b + c; 
	} 
};

x = 2;
y = 5;

var fn = a(x);

x = 1;
y = 3;

var unknown = 5;
console.log(fn(unknown));
