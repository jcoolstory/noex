var maxImage = 1;
	var infomationText = null;
	var toolbarText = null;
	var toolbarText1 = null;
	
	var c = null;
	var oC = null;
	var octx = null;
	var ctx = null;
	var srcImg = null;
	var backPattern = null;
 	var mousePressed = false;

	var lpx=0;
	var lpy=0;
	var cropRect = new Rectangle();
	
	var pressedVertex = new Point();
	pressedVertex.pressed = false;
	pressedVertex.vertex = "none";

	var selection = new Selection();
	
	var rPointX =0;
	var rPointY =0;	
	
	var offsetx =0;
	var offsety =0;
	
	function RelativePosition(evt)
	{
		//evt.layerX =evt.x - c.offsetLeft + window.scrollX;
		//evt.layerY =evt.y- c.offsetTop +window.scrollY;
	}
	function refreshImage(name, src) {
	
		srcImg = new ImageRect();
		
		srcImg.image = src;
		infomationText.innerHTML = 'width : ' + srcImg.image.width +' px <br/>height : ' + srcImg.image.height + ' px'; 
		drawImage(srcImg);
	}
	
	function collisionTest(x1,y1,x2,y2,dist)
	{
		return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2)) <= dist; 
	}
	
	function CalRectAutoFit(imgW,imgH,dstW,dstH){
	
		var gap = imgW - imgH;
		if (gap > 0){ //가로가 크다
				
				var imageperscreen = imgW / dstW;
				var w=dstW;
				var h=imgH / imageperscreen;
				offsetx = 0;
				offsety = Math.abs((dstH-h)/2.0);	
		}
		else{ //세로가 크다

			var imageperscreen = imgH / dstH;
			var w=imgW / imageperscreen;
			var h =dstH;				
			offsetx =Math.abs((dstW-w)/2.0);	
			offsety = 0;
		}
		var rect = new Rectangle();
		rect.set(offsetx,offsety,w,h);
		return rect ;
	}
	
	
	function drawImage(image) {
		
		if (getMode() == 'fit')
			srcImg.draw();
		else {
			ctx.fillRect(0,0,c.width,c.height);
			var rect = CalRectAutoFit(image.image.width,image.image.height,c.width,c.height);
			ctx.drawImage(image.image, rect.x,rect.y,rect.width,rect.height);
		}
	}
	
	function getMode() {
		if (document.getElementById('scalefit').checked == true)
			return "fit";
		if (document.getElementById('scaleorigin').checked == true)
			return "origin"
			
		return "fit";
	}
	
	function selectionValid(){
		if (selection.width < 0 || selection.height < 0){
			if (selection.width <0)
				selection.x = selection.x + selection.width;
			if (selection.height <0)
				selection.y = selection.y + selection.height;
			
			selection.width =  Math.abs(selection.width);
			selection.height =  Math.abs(selection.height);
		}
	}
	
	function canvasMouseUp(evt){
		RelativePosition(evt);
		
		if (mousePressed){
			selectionValid();
		}
		
		if (!selection.dragging && !pressedVertex.pressed)	{
			octx.clearRect(0,0,oC.width,oC.height);
			selection.reset();
		}
		if (selection.width + selection.height <4){
			octx.clearRect(0,0,oC.width,oC.height);
			selection.reset();
		}
				
		mousePressed = false;
		selection.dragging = false;
		selection.isSelect = false;
		pressedVertex.pressed = false;
	}
	
	function vertextTest(evt){
		
		if (collisionTest(evt.layerX,evt.layerY,
				selection.x,selection.y,5))
		{
			pressedVertex.x = selection.x;
			pressedVertex.y = selection.y;
			pressedVertex.pressed = true;
			pressedVertex.vertex = 'lefttop';
 		}
		
		if (collisionTest(evt.layerX,evt.layerY,
				selection.x +  selection.width, selection.y +  selection.height,5))
		{
			pressedVertex.x = selection.x +  selection.width;
			pressedVertex.y = selection.y +  selection.height;
			pressedVertex.pressed = true;
			pressedVertex.vertex = 'rightbottom';
		}

		if (collisionTest(evt.layerX,evt.layerY, selection.x +  selection.width, selection.y,5))
		{
			pressedVertex.x = selection.x +  selection.width;
			pressedVertex.y = selection.y;
			pressedVertex.pressed = true;		
			pressedVertex.vertex = 'righttop';
		}

		if (collisionTest(evt.layerX,evt.layerY,
				selection.x , selection.y +  selection.height,5))
		{
			pressedVertex.x = selection.x;
			pressedVertex.y = selection.y +  selection.height;
			pressedVertex.pressed = true;

			pressedVertex.vertex = 'leftbottom';
		}
	}
	
	function canvasMouseDown(evt){
		RelativePosition(evt);
		mousePressed = true;	
		lpx = evt.layerX;
		lpy = evt.layerY;
		
		if (selection.contains(evt.layerX,evt.layerY)){
			selection.isSelect = true;
		}
		
		vertextTest(evt);
	}
	
	function canvasMouseOver(evt){
		RelativePosition(evt);
	
		toolbarText1.innerHTML = '(' + evt.layerX +',' +  evt.layerY + ')'; 

		if (mousePressed){
			pressMove(evt);
		}
		else {
			cursorMove(evt)
		}
	}
	
	
	function cursorMove(e){
		e.target.style.cursor = "Default";
		cursored = false;
		if(selection.contains(e.layerX,e.layerY)){
			e.target.style.cursor = "Move";
		}else if(e.layerX < selection.x && e.layerX > selection.x + selection.width && e.layerY < selection.y && e.layerY > selection.y + selection.height){
			e.target.style.cursor = "none";
		}
		
		if(collisionTest(e.layerX, e.layerY, selection.x + selection.width, selection.y, 5)){
			e.target.style.cursor = "ne-resize";
		}
		if(collisionTest(e.layerX, e.layerY, selection.x + selection.width, selection.y + selection.height, 5)){
			e.target.style.cursor = "nw-resize";

		}
		if(collisionTest(e.layerX, e.layerY, selection.x, selection.y+ selection.height, 5)){
			e.target.style.cursor = "ne-resize";
		}
		if(collisionTest(e.layerX, e.layerY, selection.x, selection.y, 5)){
			e.target.style.cursor = "nw-resize";
		}
	}
	
	function pressMove(evt)	{
		selection.dragging = true;
		if (selection.isSelect){
			selection.x -= (lpx-evt.layerX);
			selection.y -= (lpy-evt.layerY);
				
			lpx = evt.layerX;
			lpy = evt.layerY;
		}
		else if (pressedVertex.pressed)	{
			switch (pressedVertex.vertex){
			case 'lefttop':
				var xoff = evt.layerX - selection.x; 
				var yoff = evt.layerY - selection.y
				selection.x = evt.layerX;
				selection.y = evt.layerY;
				selection.width -= xoff; 
				selection.height -= yoff;
				break
			case 'righttop':
				var xoff = evt.layerX - selection.x; 
				var yoff = evt.layerY - selection.y
				selection.y = evt.layerY;
				selection.width = xoff; 
				selection.height -= yoff;
				break
			case 'rightbottom':
				var xoff = evt.layerX - selection.x; 
				var yoff = evt.layerY - selection.y
				
				selection.width = xoff; 
				selection.height = yoff;
				break
			case 'leftbottom':
				var xoff = evt.layerX - selection.x; 
				var yoff = evt.layerY - selection.y
				selection.x = evt.layerX;
				selection.width -= xoff ; 
				selection.height = yoff;
				break
			}
		}
		else {
			// select가 허용범위보다 크거나 작은것을 방
			var px = evt.layerX;
			var py = evt.layerY;
			if (px > c.width){
				px = c.width;
			}		
			if (py > c.height){					
				py = c.height;
			}		
			if (px < 0){
				px = 0;
			}		
			if (py < 0){
				py = 0;
			}		
			px = px-lpx;
			py = py-lpy;
			
			selection.x = lpx;
			selection.y = lpy;
			selection.width = px;
			selection.height = py;
		}
		
		selection.draw(octx,selection);
		
		toolbarText.innerHTML = '(' + lpx +',' + lpy + ')-(' + px +',' + py + ')'; 
	}
	
	
	function imagecrop(){
		if (srcImg == null)
			return;

		var srcX,srcY,srcW,srcH;
		
		if (getMode() == 'fit') {
			cropRect.x = selection.x/c.width * srcImg.image.width;
			cropRect.y = selection.y/c.height * srcImg.image.height;
			cropRect.width = selection.width/c.width * srcImg.image.width;
			cropRect.height = selection.height/c.height * srcImg.image.height;

			ctx.drawImage(srcImg.image, cropRect.x,cropRect.y,cropRect.width,cropRect.height,0,0,c.width,c.height);
			octx.clearRect(0,0,oC.width,oC.height);
		}
		else{
			ctx.fillRect(0,0,c.width,c.height);
			
			cropRect.x = selection.x- offsetx;
			cropRect.y = selection.y - offsety;
			cropRect.x = cropRect.x/(c.width -offsetx*2) * srcImg.image.width;
			cropRect.y = cropRect.y/(c.height-offsety*2) * srcImg.image.height;
			cropRect.width = selection.width/(c.width -offsetx*2) * srcImg.image.width;
			cropRect.height = selection.height/(c.height-offsety*2) * srcImg.image.height;

			octx.clearRect(0,0,oC.width,oC.height);

			var rect = CalRectAutoFit(cropRect.width,cropRect.height,c.width,c.height);
		
			ctx.drawImage(srcImg.image,cropRect.x,cropRect.y,cropRect.width,cropRect.height, rect.x,rect.y,rect.width,rect.height);
		}
		selection.reset();
	}
	
	function imageorigin(){
	
		if (srcImg == null)
			return;
		drawImage(srcImg);
		selection.reset();
		octx.clearRect(0,0,oC.width,oC.height);
	}
	
	function reflectionVertical(){
		if (srcImg == null)
			return;
			
		ctx.translate(0, c.height);
        ctx.scale(1, -1);
		ctx.drawImage(srcImg.image, 0,0,srcImg.image.width,srcImg.image.height,0,0,c.width,c.height);		
	}
	
	function reflectionHorizon(){
		if (srcImg == null)
			return;
			
		ctx.translate(c.width, 0);
        ctx.scale(-1, 1);
		ctx.drawImage(srcImg.image, 0,0,srcImg.image.width,srcImg.image.height,0,0,c.width,c.height);
	}
	
	function saveFile(){
		if (srcImg == null)
			return;
		
		var dataURL = c.toDataURL('image/png');
		var button = document.getElementById('saveFile');
		button.href = dataURL;
	}
	
	function handleImageDrop(evt) {
		evt.stopPropagation();
		evt.preventDefault();

		var files = evt.dataTransfer.files;
		readSub(0, files[0]);
	}

	function handleDragOver(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy';
	}
	
	function init(){
		infomationText = document.getElementById('infomation');
		toolbarText = document.getElementById('status1');
		toolbarText1 = document.getElementById('status2');
		
		c = document.getElementById('editorCanvas');
		oC = document.getElementById('overlayCanvas');
		octx = oC.getContext("2d");
		ctx = c.getContext("2d");
	
		var imageObj = new Image();
		imageObj.onload = function() {
			var pattern = ctx.createPattern(imageObj, 'repeat');

			ctx.rect(0, 0, c.width, c.height);
			ctx.fillStyle = pattern;
			ctx.fill();
		};
		imageObj.src = 'img/parttern.bmp';
		
		var dropZone = document.getElementById('drop_zone')
		// Setup the dnd listeners. 
		dropZone.addEventListener('dragover', handleDragOver, false);
		dropZone.addEventListener('drop', handleImageDrop, false);
		dropZone.addEventListener('mousemove', canvasMouseOver ,false)
		dropZone.addEventListener('mousedown', canvasMouseDown ,false)
		dropZone.addEventListener('mouseup', canvasMouseUp ,false)	
		
		var ShadowColor = 'rgba(1,0,1,1)';
		octx.shadowColor = ShadowColor;
		octx.shadowOffsetX = 1;
		octx.shadowOffsetY = 1;
		octx.shadowBlur =5;
	}
	