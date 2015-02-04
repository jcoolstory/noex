var canvasApp = function(){
	var canvasId = document.getElementById("dragDraw");
	var ctx = canvasId.getContext("2d");
	var dragging = false;
	var x, y;
	
	var init = function(){
		canvasId.addEventListener("mousedown", mouseDownListener, false);
	},
	mouseDownListener = function(evt){
		var x, y;
		x = evt.layerX;
		y = evt.layerY;
		
		ctx.beginPath();
		//1. x좌표, 2. y좌표, 3. 원의반경, 4. 원의시작과 끝, 5. 2 * Math.PI 전체원 그리기, 6. anticlockwise 매개 변수
		//x, y, radius, startingAngle, endingAngle, antiClockwise
		ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
		ctx.fill();
		
		dragging = true;
		if(dragging)
			window.addEventListener("mousemove", mouseMoveListener, false);
		
		canvasId.removeEventListener("mousedown", mouseDownListener, false);
		window.addEventListener("mouseup", mouseUpListener, false);
		
		evt.preventDefault ? evt.preventDefault() : evt.returnValue = false;
		
		console.log("aaaa");
	},
	mouseUpListener = function(evt){
		
		var x, y;
		x = evt.layerX;
		y = evt.layerY;
		
		ctx.beginPath();
		//1. x좌표, 2. y좌표, 3. 원의반경, 4. 원의시작과 끝, 5. 2 * Math.PI 전체원 그리기, 6. anticlockwise 매개 변수
		//x, y, radius, startingAngle, endingAngle, antiClockwise
		ctx.arc(x*2, y*2, 3, 0, 2 * Math.PI, true);
		ctx.fill();
		
		canvasId.addEventListener("mousedown", mouseDownListener, false);
		window.removeEventListener("mouseup", mouseUpListener, false);
		if(dragging){
			dragging = false;
			window.removeEventListener("mousemove", mouseMoveListener, false);
		}
		
		console.log("bbbb");
	},
	mouseMoveListener = function(evt){
		var x, y;
		x = evt.layerX;
		y = evt.layerY;
		ctx.strokeRect(x, y, x*2, y*2);
		
		console.log("ccccc");
	}
	init();
}

window.addEventListener("load", canvasApp, false);