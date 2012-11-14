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
var currentUrl;

// Default all phone types to false 
var isAndroid = false; 
var isBlackberry = false; 
var isIphone = false; 
var isIpad = false; 
var isWindows = false; 
// Store the device's uuid 
var deviceUUID;

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
	

	document.getElementById("checkisphonegapready").innerHTML=isPhoneGapReady;	
	document.getElementById("checkdeviceplatform").innerHTML=device.platform;
	document.getElementById("checknetworkconnected").innerHTML=isConnected;
	document.getElementById("checkhighspeed").innerHTML=isHighSpeed;		
	// This is an event handler function, which means the scope is the event.
	// So, we must explicitly called `app.report()` instead of `this.report()`.
	report('deviceready');
}

function executeEvents() { 
	if (isPhoneGapReady) { 
		// attach events for online and offline detection 
		document.addEventListener("online", onOnline, false); 
		document.addEventListener("offline", onOffline, false); 
		// attach events for pause and resume detection 
		document.addEventListener("pause", onPause, false); 
		document.addEventListener("resume", onResume, false);
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
}

function onOnline() { 
	isConnected = true;
	document.getElementById("checknetworkconnected").innerHTML=isConnected;
} 
	
function onOffline() {
	isConnected = false; 
	document.getElementById("checknetworkconnected").innerHTML=isConnected;
}

function onPause() { 
	isPhoneGapReady = false; 
}

function onResume() {
	// don't run if phonegap is already ready 
	if (isPhoneGapReady == false) {
		init(currentUrl); 
	} 
}