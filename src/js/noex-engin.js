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
		ctx.drawImage(this.image, 0,0);
	};
};

var Point = function(){
	
	this.x = 0;
	this.y = 0;
};



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

function collisionTest(x1,y1,x2,y2,dist)
{
	return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2)) <= dist; 
}
	
function Selection(){
	this.isSelect = false;
	this.dragging = false;
	this.borderColor = '#3a5795';
	this.borderLineWidth = 2;
	this.vertexSize = 2;
	this.outerFillColor = 'rgba(30,30,30,0.5)';
	
	this.pressedVertex = new Point();
	this.pressedVertex.pressed = false;
	this.pressedVertex.vertex = "none";
	
	this.draw = function(ctx){
	
		ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
		ctx.fillStyle = this.outerFillColor;
		ctx.fillRect(0, 0, ctx.canvas.width,ctx.canvas.height);
		ctx.globalCompositeOperation = 'destination-out';
		ctx.fillStyle = "black";
		
		ctx.fillRect(this.x,this.y,this.width,this.height);		
		ctx.fill();
		
		ctx.beginPath();
		ctx.lineWidth =this.borderLineWidth;	
		ctx.globalCompositeOperation = "source-over";
		ctx.strokeStyle = this.borderColor;

		ctx.rect(this.x,this.y,this.width,this.height);		
		ctx.stroke();
		
		ctx.beginPath();
		
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
		
		this.drawVertex(ctx, this.x,this.y);
		this.drawVertex(ctx, this.x +  this.width, this.y +  this.height);		
		this.drawVertex(ctx, this.x +  this.width, this.y);
		this.drawVertex(ctx, this.x , this.y +  this.height);
		
		this.drawVertex(ctx, this.x + this.width /2 , this.y);
		this.drawVertex(ctx, this.x + this.width /2 , this.y + this.height);
		this.drawVertex(ctx, this.x , this.y +  this.height /2);
		this.drawVertex(ctx, this.x+ this.width , this.y +  this.height/2);
		
	}
	this.drawVertex= function(context, x, y){
	
		context.lineWidth = 0;
		context.fillStyle = 'yellow';
		context.arc(x, y,this.vertexSize , 0, 2 * Math.PI, true);
		context.fill();
		context.beginPath();
	}
	
	this.setVertex = function(x, y, status)
	{
		this.pressedVertex.x = x;
		this.pressedVertex.y = y;
		this.pressedVertex.pressed = true;
		this.pressedVertex.vertex = status;
	}
	this.resetStatus = function(){
		this.dragging = false;
		this.isSelect = false;
		this.pressedVertex.pressed = false;
	}
	this.VertexMove = function(x,y){
		
		switch (this.pressedVertex.vertex){
			case 'lefttop':
			
				var xoff = x - this.x; 
				var yoff = y - this.y
				this.x = x;
				this.y = y;
				this.width -= xoff; 
				this.height -= yoff;
				break
			case 'righttop':
				var xoff = x - this.x; 
				var yoff = y - this.y
				this.y = y;
				this.width = xoff; 
				this.height -= yoff;
				break
			case 'rightbottom':
				var xoff = x - this.x; 
				var yoff = y - this.y
				
				this.width = xoff; 
				this.height = yoff;
				break
			case 'leftbottom':
				var xoff = x - this.x; 
				var yoff = y - this.y
				this.x = x;
				this.width -= xoff ; 
				this.height = yoff;
				break
				///////
			case 'left':
				var xoff = x - this.x; 
				this.x =x;
				this.width -= xoff; 
				break
			case 'right':
				var xoff = x - this.x; 
				this.width = xoff; 
				break
			case 'top':
				var yoff = y - this.y
				this.y = y;
				this.height -= yoff;
				break
			case 'bottom':
				var yoff = y - this.y
				this.height = yoff;
				break
			} 
		}
	this.vertextTest=function (evt){
		
		if (collisionTest(evt.layerX,evt.layerY,
				this.x,this.y,5))
		{
			this.setVertex(evt.layerX,evt.layerY,'lefttop');
 		}
		
		if (collisionTest(evt.layerX,evt.layerY,
				this.x +  this.width, this.y +  this.height,5))
		{
			this.setVertex(evt.layerX,evt.layerY,'rightbottom');
		}

		if (collisionTest(evt.layerX,evt.layerY, this.x +  this.width, this.y,5))
		{
			this.setVertex(evt.layerX,evt.layerY,'righttop');
		}

		if (collisionTest(evt.layerX,evt.layerY,
				this.x , this.y +  this.height,5))
		{
			this.setVertex(evt.layerX,evt.layerY,'leftbottom');
		}
		
		if(collisionTest(evt.layerX, evt.layerY, this.x , this.y+ this.height/2, 5)){
			this.setVertex(evt.layerX,evt.layerY,'left');
		
		}
		if(collisionTest(evt.layerX, evt.layerY, this.x + this.width, this.y+ this.height/2, 5)){
		
			this.setVertex(evt.layerX,evt.layerY,'right');
		}
		if(collisionTest(evt.layerX, evt.layerY, this.x + this.width /2, this.y, 5)){
			this.setVertex(evt.layerX,evt.layerY,'top');
		}
		if(collisionTest(evt.layerX, evt.layerY,  this.x + this.width /2, this.y+ this.height, 5)){
			this.setVertex(evt.layerX,evt.layerY,'bottom');
		}
	}
}
Selection.prototype = new Rectangle();