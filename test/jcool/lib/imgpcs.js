function brightfilter(data,w,h){
	for(var i = 0 ; i < data.length;i++){
		data[i] = data[i] + 10;
	}
}

function darkfilter(data,w,h){
	for(var i = 0 ; i < data.length;i++){
		data[i] = data[i] - 10;
	}
}

function embosFilter(data,w,h){
	for(var i = 0 ; i < data.length;i++){
		if ((i+1) % 4 !=0){
			data[i] = 255/2 + 2*data[i] - data[i+4] - data[i+w*4];
		}
	}
}

function grayfilter(data,w,h){
	for(var i = 0 ; i < data.length-4;i+=4){
		average = (data[i] + data[i+1] + data[i+2])/3;
		data[i] = average;
		data[i+1] = average;
		data[i+2] = average;
	}
}

function negativefilter(data,w,h){
	for(var i=0;i<= data.length-4;i+=4)	{
		data[i] = 255-data[i];
		data[i+1] = 255-data[i+1];
		data[i+2] = 255-data[i+2];
	}
}

function sunglassfilter(data,w,h){
	for(var i = 0 ; i < data.length ; i++){
		if ((i+1) % 4 != 0){
			if ((i+4) % (w*4)==0){
				data[i] = data[i-4];
				data[i+1] = data[i-3];
				data[i+2] = data[i-2];
				data[i+3] = data[i-1];
			}
			else{
				data[i] = 2*data[i] - data[i+4] - 0.5*data[i+4];
			}
		}
	}
}