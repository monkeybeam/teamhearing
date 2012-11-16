<?php
print_r($_FILES);
$new_image_name = "aphoto.png";
move_uploaded_file($_FILES['file']['tmp_name'], "/home/content/27/8271327/html/phonegap/uploads/".$new_image_name);
//the absolute file path to teamaudiology.org is necessary  
//this might be different if path is for teamhearing.org
?>