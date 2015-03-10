var viewIndex = 0;

function readSub(index, obj) {
	var reader = new FileReader();
	reader.onload = function(e) {
		img = new Image();
		img.src = URL.createObjectURL(obj);
		img.onload = function() {
			refreshImage("view" + (viewIndex + 1), this);
			viewIndex++;
		};
	};
	reader.readAsDataURL(obj);
}

function readImage(index, obj,func) {
	var reader = new FileReader();
	reader.onload = function(e) {
		img = new Image();
		img.src = URL.createObjectURL(obj);
		img.onload = function() {
			func("view" + (viewIndex + 1), this);
			viewIndex++;
		};
	};
	reader.readAsDataURL(obj);
}

function readInput(input) {
	if (input.files && input.files[0]) {
		var length = input.files.length > maxImage ? maxImage
				: input.files.length;
		for ( var i = 0; i < length; i++) {
			readSub(i, input.files[i]);
		}
	}
}

var Rectangle = function(){
	this.x = 0;
	this.y = 0;
	this.width = 1;
	this.height = 1;
	this.set = function(x,y,w,h){
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
	};
	this.reset = function()	{
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;	
	};
	this.contains = function(ox,oy){
		if(typeof oy == "undefined") {

			return (ox.x > this.x && 
					ox.x < this.x + this.width && 
					ox.y > this.y && 
					ox.y < this.y + this.height);
		}
		return (ox > this.x && 
				ox < this.x + this.width && 
				oy > this.y && 
				oy < this.y + this.height);
	};
};

var ImageRect = function(){
	
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.image = null;
	
	this.draw = function(){
		ctx.drawImage(this.image, this.x,this.y,this.width,this.height);
	};
};

