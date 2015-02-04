var canvasApp = function(){
	var canvasId = document.getElementById("dragDraw");
	var ctx = canvasId.getContext("2d");
	var dragging = false;
	var downX, downY;
	var upX, upY;
	var moveX, moveY;
	
	var init = function(){
		canvasId.addEventListener("mousedown", mouseDownListener, false);
	},
	//클릭다운시
	mouseDownListener = function(evt){
		downX = evt.layerX;
		downY = evt.layerY;
		ctx.clearRect(0, 0, canvasId.width, canvasId.height);
		ctx.beginPath();
		//1. x좌표, 2. y좌표, 3. 원의반경, 4. 원의시작과 끝, 5. 2 * Math.PI 전체원 그리기, 6. anticlockwise 매개 변수
		//x, y, radius, startingAngle, endingAngle, antiClockwise
		ctx.arc(downX, downY, 3, 0, 2 * Math.PI, true);
		ctx.fill();
		
		dragging = true;
		if(dragging)
			window.addEventListener("mousemove", mouseMoveListener, false);
		
		canvasId.removeEventListener("mousedown", mouseDownListener, false);
		window.addEventListener("mouseup", mouseUpListener, false);
		
		evt.preventDefault ? evt.preventDefault() : evt.returnValue = false;

	},
	//클릭업시
	mouseUpListener = function(evt){
		upX = evt.layerX;
		upY = evt.layerY;
		
		ctx.beginPath();
		//1. x좌표, 2. y좌표, 3. 원의반경, 4. 원의시작과 끝, 5. 2 * Math.PI 전체원 그리기, 6. anticlockwise 매개 변수
		//x, y, radius, startingAngle, endingAngle, antiClockwise
		ctx.arc(upX, upY, 3, 0, 2 * Math.PI, true);
		ctx.fill();
		
		canvasId.addEventListener("mousedown", mouseDownListener, false);
		window.removeEventListener("mouseup", mouseUpListener, false);
		if(dragging){
			dragging = false;
			window.removeEventListener("mousemove", mouseMoveListener, false);
		}

	},
	//클릭다운 후 드래그시
	mouseMoveListener = function(evt){
		moveX = evt.layerX;
		moveY = evt.layerY;
		
		//그려질때 드래그선 지우기
		ctx.clearRect(downX, downY, moveX-downX, moveY-downY);
		
		//드래그선 그리기
		ctx.strokeRect(downX, downY, moveX-downX, moveY-downY);
		
		//영역을 넘고나서 선이 줄어들때 지우기
		
	} 
	init();
}

window.addEventListener("load", canvasApp, false);