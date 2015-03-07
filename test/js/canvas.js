var canvasApp = function(){
	var canvasId = document.getElementById("dragDraw");
	var ctx = canvasId.getContext("2d");
	var dragging = false;
	var downX, downY;
	var upX, upY;
	var moveX, moveY;
	
	var canvasId2 = document.getElementById("ImgDraw");
	var ctx2 = canvasId2.getContext("2d");
	var imgObj = new Image();
	imgObj.src = "http://localhost:8080/jcool/img_the_scream.jpg";

	var init = function(){
		imgObj.addEventListener("load", function(){
			ctx2.drawImage(imgObj, 0, 0);
		}, false);

		canvasId.addEventListener("mousedown", mouseDownListener, false);
	},
	//꼭지점 점
	edgeCircle = function(x, y){
		ctx.beginPath();
		//1. x좌표, 2. y좌표, 3. 원의반경, 4. 원의시작과 끝, 5. 2 * Math.PI 전체원 그리기, 6. anticlockwise 매개 변수
		//x, y, radius, startingAngle, endingAngle, antiClockwise
		ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
		ctx.fillStyle="yellow";
		ctx.fill();
	},
	//클릭다운시
	mouseDownListener = function(evt){
		downX = evt.layerX;
		downY = evt.layerY;

		edgeCircle(downX, downY);
		
		dragging = true;
		if(dragging)
			window.addEventListener("mousemove", mouseMoveListener, false);
		
		canvasId.removeEventListener("mousedown", mouseDownListener, false);
		window.addEventListener("mouseup", mouseUpListener, false);
		
		//이벤트실행 취소
		//evt.preventDefault ? evt.preventDefault() : evt.returnValue = false;

	},
	//클릭업시
	mouseUpListener = function(evt){
		upX = evt.layerX;
		upY = evt.layerY;
		edgeCircle(upX, upY);
		
		canvasId.addEventListener("mousedown", mouseDownListener, false);
		window.removeEventListener("mouseup", mouseUpListener, false);
		if(dragging){
			dragging = false;
			window.removeEventListener("mousemove", mouseMoveListener, false);
		}
		console.log("downX" + downX);
		console.log("downY" + downY);
		console.log("upX" + upX);
		console.log("upY" + upY);

	},
	//클릭다운 후 드래그시
	mouseMoveListener = function(evt){
		moveX = evt.layerX;
		moveY = evt.layerY;
		
		ctx.canvas.width = ctx.canvas.width;
		
		edgeCircle(downX, downY);
		
		ctx.strokeStyle = "yellow";
		//드래그선 그리기
		ctx.strokeRect(downX, downY, moveX-downX, moveY-downY);
		
	} 
	init();
}

window.addEventListener("load", canvasApp, false);