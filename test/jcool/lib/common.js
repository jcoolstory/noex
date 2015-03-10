
pagemodule = function(box){
	
	this.dropzone = box;
	
	this.init = function(){
		dropZone.addEventListener('dragover', handleDragOver, false);
		dropZone.addEventListener('drop', handleImageDrop, false);
		dropZone.addEventListener('mousemove', canvasMouseOver ,false);
		dropZone.addEventListener('mousedown', canvasMouseDown ,false);
		dropZone.addEventListener('mouseup', canvasMouseUp ,false);	
	};
	
	
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

	function canvasMouseUp(evt){

		pressed = false;
		if (!dragged)
		{
			octx.clearRect(0,0,oC.width,oC.height);
			selectRect.reset();
		}
		dragged = false;
		selectedRect = false;
	}
	function canvasMouseDown(evt){
		pressed = true;	
		lpx = evt.x;
		lpy = evt.y;
		if (selectRect.contains(evt)){
			selectedRect = true;
		}
	}
	
	function canvasMouseOver(evt){
		
		if (!pressed)
			return;
		dragged = true;
		if (selectedRect)
		{
			selectRect.x -= (lpx-evt.x);
			selectRect.y -= (lpy-evt.y);
				
			lpx = evt.x;
			lpy = evt.y;
		}
		else
		{
			var px = evt.x;
			var py = evt.y;
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
			
			selectRect.set(lpx,lpy,px,py);
		}
		
		if (srcImg != null)
		{
			cropRect.x = selectRect.x/c.width * srcImg.image.width;
			cropRect.y = selectRect.y/c.height * srcImg.image.height;
			cropRect.width = selectRect.width/c.width * srcImg.image.width;
			cropRect.height = selectRect.height/c.height * srcImg.image.height;
		}
		
		drawSelection(selectRect);
		toolbarText.innerHTML = '(' + lpx +',' + lpy + ')-(' + px +',' + py + ')'; 
	}
}