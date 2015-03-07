<?php
$data = $_POST['imgData'];
$file = "temp/file.png";
$uri =  substr($data,strpos($data,",")+1);
$result = file_put_contents($file, base64_decode($uri));

if ($result){
	echo $file;
}
else{
	echo $result;
}
?>