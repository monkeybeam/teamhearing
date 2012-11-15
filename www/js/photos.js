var loaded = false;
var currentPhoto = null;

function onPhotosLoad() {
    // only load the camera selector on first load
    if (!loaded) {
        navigator.camera.getPicture(onPhotoLoadSuccess, onFail, 
        { 
            quality: 50,
            encodingType: Camera.EncodingType.PNG,
            destinationType: navigator.camera.DestinationType.FILE_URI
			//uncomment sourceType and add comman at end of previous to get picture from photo library
			//sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        });
        
        loaded = true;
    }
}

function onPhotoLoadSuccess(photoUri) {
    // store current photo for saving later
    currentPhoto = photoUri;
	alert(currentPhoto);
    document.getElementById('photo').src = photoUri;
}

function onFail(message) {
    alert('Failed because: ' + message);
}

function savePhoto() {
    if (currentPhoto == null) {
        alert("Please select a photo first");
        return;
    }
    
    var uploadOptions = new FileUploadOptions();
    uploadOptions.fileKey = "file";
	var currentPhotoFileName=currentPhoto.substr(currentPhoto.lastIndexOf('/') + 1);
	alert(currentPhotoFileName);
    uploadOptions.fileName = currentPhotoFileName;
    uploadOptions.mimeType="image/png";
	var params = new Object();
	params.value1 = "test";
	params.value2 = "param";
	uploadOptions.params = params;
	
    var fileTransfer = new FileTransfer();
    fileTransfer.upload(currentPhoto, "http://www.teamaudiology.com/phonegap/upload.php", uploadSuccess, uploadFail, uploadOptions);
}

function uploadSuccess(result) {
    alert("Successfully transferred responseCode:"+result.responseCode+" response:"+ result.response+ " bytesSent:"+ result.bytesSent + "bytes");
	console.log("Code = " + result.responseCode);
	console.log("Response = " + result.response);
	console.log("Sent = " + result.bytesSent);	
}

function uploadFail(error) {
    alert("Error uploading file: " + error.code);
}