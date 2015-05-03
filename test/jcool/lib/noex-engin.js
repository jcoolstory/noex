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

function drawDashedLine(context, x1, y1, x2, y2, dashLength){
	dashLength = dashLength === undefined ? 5 : dashLength;
	
	var deltaX = x2- x1;
	var deltaY = y2-y1;
	var numDashes = Math.floor(
		Math.sqrt(deltaX * deltaX + deltaY * deltaY)/dashLength);
	
	for (var i =0 ; i < numDashes ;i++){
		context[i % 2 === 0? 'moveTo':'lineTo'](x1+(deltaX / numDashes)
			* i ,y1 + (deltaY / numDashes) * i);
	}
	
	context.stroke();
}

function Selection(){
	this.isSelect = false;
	this.dragging = false;
	
	this.draw = function(ctx){
	
		ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
		ctx.fillStyle ='rgba(30,30,30,0.5)';
		ctx.fillRect(0, 0, ctx.canvas.width,ctx.canvas.height);
		ctx.globalCompositeOperation = 'destination-out';
		ctx.fillStyle = "black";
		
		ctx.fillRect(this.x,this.y,this.width,this.height);		
		ctx.fill();
		
		
		ctx.beginPath();
		ctx.lineWidth = 2	;	
		ctx.globalCompositeOperation = "source-over";
		ctx.strokeStyle = '#3a5795';
	//	ctx.strokeStyle = '#888';

		ctx.rect(this.x,this.y,this.width,this.height);		
		ctx.stroke();
		
		ctx.beginPath();
		
		ctx.strokeStyle = "back";
		ctx.moveTo(this.x + (this.width /3), this.y);
		ctx.lineTo(this.x + (this.width /3), this.y+this.height);
		ctx.moveTo(this.x + (this.width /1.5), this.y);
		ctx.lineTo(this.x + (this.width /1.5), this.y+this.height);
		ctx.moveTo(this.x, this.y+(this.height /3));
		ctx.lineTo(this.x + this.width, this.y+(this.height /3));
		ctx.moveTo(this.x, this.y+(this.height /1.5));
		ctx.lineTo(this.x + this.width, this.y+(this.height /1.5));
		ctx.lineWidth = 1;
		
		ctx.stroke();
		ctx.beginPath();
		
		drawVertex(ctx, this.x,this.y);
		drawVertex(ctx, this.x +  this.width, this.y +  this.height);		
		drawVertex(ctx, this.x +  this.width, this.y);
		drawVertex(ctx, this.x , this.y +  this.height);
		
		drawVertex(ctx, this.x + this.width /2 , this.y);
		drawVertex(ctx, this.x + this.width /2 , this.y + this.height);
		drawVertex(ctx, this.x , this.y +  this.height /2);
		drawVertex(ctx, this.x+ this.width , this.y +  this.height/2);
		
	}
}
Selection.prototype = new Rectangle();