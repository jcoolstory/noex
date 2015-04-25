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

var Point = function(){
	
	this.x = 0;
	this.y = 0;
};

function drawVertex(context, x, y,focus){
	
	if (focus){
		
		context.lineWidth = 2;
		context.lineStyle = 'gray';
		context.fillStyle = 'black';
	}
	else{	
		context.lineWidth = 0;
		context.fillStyle = 'yellow';
	}
	
	context.arc(x, y,2, 0, 2 * Math.PI, true);
	
	context.fill();
	context.beginPath();
}


function drawSelection(ctx,sRect,focus){
	
	ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
	ctx.strokeStyle = "back";
	ctx.moveTo(sRect.x + (sRect.width /3), sRect.y);
	ctx.lineTo(sRect.x + (sRect.width /3), sRect.y+sRect.height);
	ctx.moveTo(sRect.x + (sRect.width /1.5), sRect.y);
	ctx.lineTo(sRect.x + (sRect.width /1.5), sRect.y+sRect.height);
	ctx.moveTo(sRect.x, sRect.y+(sRect.height /3));
	ctx.lineTo(sRect.x + sRect.width, sRect.y+(sRect.height /3));
	ctx.moveTo(sRect.x, sRect.y+(sRect.height /1.5));
	ctx.lineTo(sRect.x + sRect.width, sRect.y+(sRect.height /1.5));
	
	ctx.fillStyle ='rgba(30,30,30,0.8)';
	ctx.fillRect(0, 0, ctx.canvas.width,ctx.canvas.height);
	ctx.globalCompositeOperation = 'destination-out';
	ctx.fillStyle = "black";
	ctx.fillRect(sRect.x,sRect.y,sRect.width,sRect.height);		
	ctx.lineWidth = 1;	
	ctx.globalCompositeOperation = "source-over";
	ctx.strokeStyle = "lightgray";
	ctx.rect(sRect.x,sRect.y,sRect.width,sRect.height);		
	ctx.stroke();
	ctx.beginPath();

}