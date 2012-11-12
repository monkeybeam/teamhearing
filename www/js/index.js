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


// Set an onload handler to call the init function 
window.onload = init;
 
function init() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

 function onDeviceReady() {
	// set to true 
	isPhoneGapReady = true; 
	
	// detect the device's platform 
	deviceUUID = device.uuid;
	deviceDetection();
	createPlayers();
	
	// This is an event handler function, which means the scope is the event.
	// So, we must explicitly called `app.report()` instead of `this.report()`.
	report('deviceready');
	//var mytarea = document.getElementById("tarea");
	//mytarea.value='This is a native app compiled for 5 mobile platforms...';
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
	var cpcontainer = "#cp_container_0";
	var audiofile = "http://www.teamaudiology.org/data/percept/starter.wav";
	var myPlayer = new Array();
	var a=0;
	jplayername = "#jquery_jplayer_" + a;
	myPlayer[a] = new CirclePlayer(jplayername,
	{
		wav: audiofile
	}, {
		cssSelectorAncestor: cpcontainer,
		preload: "auto",
		swfPath: "jPlayer/js",
		wmode: "window",
		volume: audiovolume
	});
	myPlayer[0].play();
}