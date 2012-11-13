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
// Store the current network status 
var isConnected = false;
var isHighSpeed = false;
var internetInterval;
var currentUrl;

// Default all phone types to false 
var isAndroid = false; 
var isBlackberry = false; 
var isIphone = false; 
var isIpad = false; 
var isWindows = false; 
// Store the device's uuid 
var deviceUUID;
var play_html5_audio = false;
// PhoneGap Audio player
var my_media = null;
var mediaTimer = null;

// This gets called by jQuery mobile when the page has loaded
$(document).bind("pageload", function(event, data) {init(data.url);});

// Set an onload handler to call the init function 
window.onload = init;
 
function init(url) {
	if (typeof url != 'string') { 
		currentUrl = location.href; 
	} else { 
		currentUrl = url; 
	} 
	
	if (isPhoneGapReady) { 
		onDeviceReady(); 
	} else { 
		// Add an event listener for deviceready 
		document.addEventListener("deviceready", onDeviceReady, false); 
	}
	if(html5_audio()) play_html5_audio = true;	
	document.getElementById("checkhtml5audio").innerHTML=play_html5_audio;				
}

 function onDeviceReady() {
	// set to true 
	isPhoneGapReady = true; 
	// detect the device's platform 
	deviceUUID = device.uuid;
	deviceDetection();
	// detect for network access 
	networkDetection();
	// execute any events at start up 
	executeEvents(); 
	// execute a callback function
	executeCallback();
	
	// This is an event handler function, which means the scope is the event.
	// So, we must explicitly called `app.report()` instead of `this.report()`.
	report('deviceready');
}

function executeEvents() { 
	if (isPhoneGapReady) { 
		// attach events for online and offline detection 
		document.addEventListener("online", onOnline, false); 
		document.addEventListener("offline", onOffline, false); 
	}
}

function executeCallback() { 
	if (isPhoneGapReady)
	{ 
		// get the name of the current html page 
		var pages = currentUrl.split("/"); 
		var currentPage = pages[pages.length - 1].slice(0, pages[pages.length - 1].indexOf(".html")); 
		// capitalize the first letter and execute the function 
		currentPage = currentPage.charAt(0).toUpperCase() + currentPage.slice(1); 
		if (typeof window['on' + currentPage + 'Load'] == 'function') 
			{window['on' + currentPage + 'Load'](); }
	}
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

function networkDetection() { 
	if (isPhoneGapReady) { 
	// as long as the connection type is not none, 
	// the device should have Internet access 
		if (navigator.network.connection.type != Connection.NONE) 
		{ isConnected = true; } 
	} 
	// determine whether this connection is high-speed 
	switch (navigator.network.connection.type) { 
		case Connection.UNKNOWN: 
		case Connection.CELL_2G: 
			isHighSpeed = false; break; 
		default: 
			isHighSpeed = true; break; 
		}
	
	document.getElementById("checknetworkconnected").innerHTML=isConnected;
	document.getElementById("checkhighspeed").innerHTML=isHighSpeed;
}

function onOnline() { 
	isConnected = true;
	document.getElementById("checknetworkconnected").innerHTML=isConnected;
} 
	
function onOffline() {
	isConnected = false; 
	document.getElementById("checknetworkconnected").innerHTML=isConnected;
}

// Play Native Audio
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