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
var isWindows = false; 
// Store the device's uuid 
var deviceUUID;


// Set an onload handler to call the init function 
window.onload = init;
 
function init() {
	alert("init");
	document.addEventListener("deviceready", onDeviceReady, false);
}

 function onDeviceReady() {
	alert("onDeviceReady");
	// set to true 
	isPhoneGapReady = true; 
	alert(' The device is now ready'); 
	// This is an event handler function, which means the scope is the event.
	// So, we must explicitly called `app.report()` instead of `this.report()`.
	report('deviceready');
	var mytarea = document.getElementById("tarea");
	mytarea.value='This is a native app compiled for 5 mobile platforms...';
	
	// detect the device's platform 
	deviceUUID = device.uuid;
	deviceDetection();
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
			case "WinCE": isWindows = true; break; 
		}
		alert(" Detected you are using a " + device.platform); 
	}
}