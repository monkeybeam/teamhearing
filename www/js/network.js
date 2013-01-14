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

function MobileLogin()
{
	//mobile version only needs this function in lieu of hrilogin.js
	
	//get variables
	guestname=document.getElementById("username").value;
	guestpassword=document.getElementById("password").value;
	version=document.getElementById("version").value;
	//remove all the class add the messagebox classes and start fading
	//document.getElementById("msgbox").removeClass().addClass('messagebox').text('Validating....').fadeIn(1000);
	document.getElementById("msgbox").innerHTML="Validating...";
	//this dbcontrol.php file is a copy for phonegap use
	$.post("https://www.teamaudiology.org/phonegap/php/dbcontrol.php",{ action:'login',username:guestname,password:guestpassword,version:version,rand:Math.random() } ,function(data)
	{
	  if(data=='no')  //login failed
	  {
		document.getElementById("msgbox").innerHTML="Your login detail failed..";
	  }
	  else //the login detail is correct
	  {
		document.getElementById("msgbox").innerHTML="Login for " + guestname + " succeeded.";
		// Connect to Database
		GetJson("MembersOnly",guestname,true);		
	  }
	});
	return false; //not to post the  form physically
}

function showDatabaseStats() {
	document.getElementById("checkdatabase").innerHTML="Database is Connected";
	document.getElementById("checkdatabasemembers").innerHTML=jsonmemberscount;
	displayMyTeam();
	document.location='#page3';	
}

function displayMyTeam() {
	var myteamcontent="";
	var userprefix = 'user';
	myteamcontent=myteamcontent+"<ul data-role='listview' data-divider-theme='b' data-inset='true'>";
	for (i=0;i<jsonmemberscount;i++)
	{
        myteamcontent=myteamcontent
					+"<li data-theme='c'>"
                        +"<a href='#page7' data-transition='slide' "
						+"id='"+ userprefix + i +"' "
						+"onclick='SelectMember(this)'>"
                        +jsonmembers[i].firstname+" "+jsonmembers[i].lastname
                        +"</a>"
                    +"</li>";
	}
    myteamcontent=myteamcontent+"</ul>";
	document.getElementById("myteamlist").innerHTML=myteamcontent;
}

function SelectMember(userobject) {
	// start on Profile?
	//if (currenttab == "Results")
	//	{currenttab = 'Profile';}
	
	// ???
	memberindex = userobject.id.substring(4,userobject.id.length);
	currentmember = jsonmembers[memberindex].username;
	currentmemberid = jsonmembers[memberindex].userid;
	var currentfullname = jsonmembers[memberindex].firstname + " " + jsonmembers[memberindex].lastname;

	document.getElementById("currentmembershown").innerHTML=currentfullname;
	document.getElementById("usernameshown").innerHTML=currentmember;
	document.getElementById("firstnameshown").innerHTML=jsonmembers[memberindex].firstname;
	document.getElementById("lastnameshown").innerHTML=jsonmembers[memberindex].lastname;
	document.getElementById("emailshown").innerHTML=jsonmembers[memberindex].email;
	document.getElementById("dobshown").innerHTML=jsonmembers[memberindex].dob;
	document.getElementById("gendershown").innerHTML=jsonmembers[memberindex].gender;
	document.getElementById("phoneshown").innerHTML=jsonmembers[memberindex].phone;
	 
	document.getElementById("breadlevel2").innerHTML=currentfullname;
		
	//document.getElementById("anchor"+memberindex).setAttribute("class", "active");
	
	// ???
	//for (i=0;i<jsonmemberscount;i++)
	//{	
	//	if (i!=parseInt(memberindex))
	//	{document.getElementById("anchor"+i).setAttribute("class", "link");}
	//}
	
	//dashboardbarcontent = "<div id='dashboardbar'>"+dashboardbutton+"<span id='dashmessage'>"
	//+jsonmembers[memberindex].firstname+" "+jsonmembers[memberindex].lastname+"</span></div>";
	
	//Note: UpdateMain and UpdateTabs is redundant here but necessary to avoid delay of GetJson call
	//UpdateTabs();
	//$('#middle').html("<div id='maincenter'></div>");
//	UpdateMain(currenttab);
	GetJson("Education",currentmemberid,false);
	GetJson("HistoryMine",currentmemberid,false);
	GetJson("NotesMine",currentmemberid,false);
	GetJson("AssignmentsMine",currentmemberid,false);
	GetJson("ResultsMine",currentmemberid,true);
	GetJson("MeasuresMine",currentmemberid,false);
}