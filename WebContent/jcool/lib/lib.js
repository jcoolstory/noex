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

function readURL(input, name) {
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
}


var ImageRect = function(){
	
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.image = null;
	this.pressed = false;
	this.offsetx = 0;
	this.offsety= 0;
	
	this.draw = function(){
		ctx.drawImage(this.image, this.x,this.y,this.width,this.height);
	}
}

