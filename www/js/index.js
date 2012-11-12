/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 //Global variable that will tell us whether PhoneGap is ready 
var isPhoneGapReady = false;  
// Default all phone types to false 
var isAndroid = false; 
var isBlackberry = false; 
var isIphone = false; 
var isIpad = false; 
var isWindows = false; 
// Store the device's uuid 
var deviceUUID;
var play_html5_audio = false;

// Set an onload handler to call the init function 
window.onload = init;
 
function init() {
	document.addEventListener("deviceready", onDeviceReady, false);
	if(html5_audio()) play_html5_audio = true;	
	document.getElementById("checkhtml5audio").innerHTML=play_html5_audio;			
	//play_noise("gated.wav");
	
}

 function onDeviceReady() {
	// set to true 
	isPhoneGapReady = true; 
	
	// detect the device's platform 
	deviceUUID = device.uuid;
	deviceDetection();
	//alert("start creating jPlayers");
	//createPlayers();
	//alert("end creating jPlayers");
	// This is an event handler function, which means the scope is the event.
	// So, we must explicitly called `app.report()` instead of `this.report()`.
	report('deviceready');
	//var mytarea = document.getElementById("tarea");
	//mytarea.value='This is a native app compiled for 5 mobile platforms...';
}

// PhoneGap Audio player
var my_media = null;
var mediaTimer = null;
// Play audio
function playAudio(src) {
	// Create Media object from src
	var audiofile="data/" + src;
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

function playBoth() {
	playAudio("gated.wav");
	playAudio("starter.wav");
}

// Pause audio
// 
function pauseAudio() {
	if (my_media) {
		my_media.pause();
	}
}

// Stop audio
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

// Set audio position
function setAudioPosition(position) {
	document.getElementById('checkmediaposition').innerHTML = "pos="+position;
}

// HTML 5 Audio Player
function html5_audio(){
	var a = document.createElement('audio');
	return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
}
 
function play_noise(url){
	var audiopath="data/";
	if(play_html5_audio){
		var nse = new Audio(audiopath + url);
		nse.loop=true;
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

	var audiopath="data/";
	if(play_html5_audio){
		var snd = new Audio(audiopath + url);
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

function play_video(url) {
		var videofile="data/"+url;
		var videocontent = "<video width='320' height='240' controls='controls' autoplay='autoplay'>"
						  +"<source src='"+videofile+".mp4' type='video/mp4'>"
						  +"<source src='"+videofile+".ogg' type='video/ogg'>"
						  +"Your browser does not support the video tag."
						+"</video>";
		document.getElementById(videopanel).innerHTML=videocontent;
}

function play_all() {
	play_noise('gated.wav');
	play_sound('starter.wav');
}

function report(id) {
	// Report the event in the console
	console.log("Report: " + id);

	// Toggle the state from "pending" to "complete" for the reported ID.
	// Accomplished by adding .hide to the pending element and removing
	// .hide from the complete element.
	document.querySelector('#' + id + ' .pending').className += ' hide';
	var completeElem = document.querySelector('#' + id + ' .complete');
	completeElem.className = completeElem.className.split('hide').join('');
	document.getElementById("checkisphonegapready").innerHTML="Yes";		
}

function deviceDetection() { 
	if (isPhoneGapReady) { 
		switch (device.platform) { 
			case "Android": isAndroid = true; break; 
			case "Blackberry": isBlackberry = true; break; 
			case "iPhone": isIphone = true; break; 
			case "iPad": isIpad = true; break; 
			case "WinCE": isWindows = true; break; 
		}
		document.getElementById("checkdeviceplatform").innerHTML=device.platform;		
	}
}

function createPlayers() {
	var cpcontainer = "#cp_container_1";
	var audiofile = "data/starter.wav";
	var audiovolume = 100;
	var myPlayer = new Array();
	var a=0;
	var jplayername = "#jquery_jplayer_" + a;
	alert (jplayername);
	myPlayer[a] = new CirclePlayer(jplayername,
	{
		wav: audiofile
	}, {
		cssSelectorAncestor: cpcontainer,
		swfPath: "jPlayer/js",
		volume: audiovolume
	});
	alert("play " + audiofile);
	myPlayer[0].play();
}