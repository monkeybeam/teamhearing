var play_html5_audio = false;
// PhoneGap Audio player
var my_media = null;
var mediaTimer = null;
var audiofilepath="";

function onAudioLoad() {
    if (isConnected) {
		if(html5_audio()) play_html5_audio = true;	
		document.getElementById("checkhtml5audio").innerHTML=play_html5_audio;			
		if (isAndroid) //Android has to have it's path set to this
			{audiofilepath="/android_asset/www/data/";}
		else
			{audiofilepath="data/";}		
    } else {
        alert("Must be connected to the Internet");
    }
}

// Play Native Audio
function playAudio(src) {
	// Create Media object from src
	var audiofile=audiofilepath + src;	
	my_media = new Media(audiofile, onSuccess, onError);
	// Play audio
	my_media.play({numberOfLoops:99});
	// Update my_media position every second
	if (mediaTimer == null) {
		mediaTimer = setInterval(function() {
			// get my_media position
			my_media.getCurrentPosition(
				// success callback
				function(position) {
					if (position > -1) {
						setAudioPosition((position) + " sec");
					}
				},
				// error callback
				function(e) {
					console.log("Error getting pos=" + e);
					setAudioPosition("Error: " + e);
				}
			);
		}, 1000);
	}
}

//Play Native Sound and Noise
function playBoth() {
	playAudio("gated.wav");
	playAudio("starter.wav");
}

// Pause Native Audio
// 
function pauseAudio() {
	if (my_media) {
		my_media.pause();
	}
}

// Stop Native Audio
// 
function stopAudio() {
	if (my_media) {
		my_media.stop();
	}
	clearInterval(mediaTimer);
	mediaTimer = null;
}

// onSuccess Callback
function onSuccess() {
	console.log("playAudio():Audio Success");
}

// onError Callback 
function onError(error) {
	alert('code: '    + error.code    + '\n' + 
		  'message: ' + error.message + '\n');
}

// Set Native Audio position
function setAudioPosition(position) {
	document.getElementById('checkmediaposition').innerHTML = "pos="+position;
}

// HTML 5 Audio Player
function html5_audio(){
	var a = document.createElement('audio');
	return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
}
 
function play_noise(url){
	if(play_html5_audio){
		var nse = new Audio(audiofilepath + url);
		nse.loop=true;
		nse.volume = parseFloat(10/100);
		nse.load();
		nse.play();
	}else{
		$("#noise").remove();
		var noise = $("<embed id='noise' type='audio/mpeg' />");
		noise.attr('src', url);
		noise.attr('loop', false);
		noise.attr('hidden', true);
		noise.attr('autostart', true);
		$('body').append(noise);
	}
}

function play_sound(url){
	if(play_html5_audio){
		var snd = new Audio(audiofilepath + url);
		snd.volume = parseFloat(100/100);
		snd.load();
		snd.play();
	}else{
		$("#sound").remove();
		var sound = $("<embed id='sound' type='audio/mpeg' />");
		sound.attr('src', url);
		sound.attr('loop', false);
		sound.attr('hidden', true);
		sound.attr('autostart', true);
		$('body').append(sound);
	}
}

function play_soundsoft(url){
	if(play_html5_audio){
		var snd = new Audio(audiofilepath + url);
		snd.volume = parseFloat(30/100);
		snd.load();
		snd.play();
	}else{
		$("#sound").remove();
		var sound = $("<embed id='sound' type='audio/mpeg' />");
		sound.attr('src', url);
		sound.attr('loop', false);
		sound.attr('hidden', true);
		sound.attr('autostart', true);
		$('body').append(sound);
	}
}

function play_all() {
	play_noise('gated.wav');
	play_sound('starter.wav');
}

//HTML5 Video Player
function play_video(url) {
		var videofile="data/"+url;
		var videocontent = "<video width='320' height='240' controls='controls' autoplay='autoplay'>"
						  +"<source src='"+videofile+".mp4' type='video/mp4'>"
						  +"<source src='"+videofile+".ogg' type='video/ogg'>"
						  +"Your browser does not support the video tag."
						+"</video>";
		document.getElementById("videopanel").innerHTML=videocontent;
}

//RIFFWAVE
function play_riffwave() {
	var data = []; // just an array
	for (var i=0; i<10000; i++) data[i] = Math.round(255 * Math.random()); // fill data with random samples
	var wave = new RIFFWAVE(data); // create the wave file
	var audio = new Audio(wave.dataURI); // create the HTML5 audio element
	audio.play(); // some noise
}
