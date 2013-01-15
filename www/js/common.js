var DDSPEED = 10;
var DDTIMER = 15;

// main function to handle the mouse events //
function ddMenu(id,d){
  var h = document.getElementById(id + '-ddheader');
  var c = document.getElementById(id + '-ddcontent');
  clearInterval(c.timer);
  if(d == 1){
    clearTimeout(h.timer);
    if(c.maxh && c.maxh <= c.offsetHeight){return}
    else if(!c.maxh){
      c.style.display = 'block';
      c.style.height = 'auto';
      c.maxh = c.offsetHeight;
      c.style.height = '0px';
    }
    c.timer = setInterval(function(){ddSlide(c,1)},DDTIMER);
  }else{
    h.timer = setTimeout(function(){ddCollapse(c)},50);
  }
}

// collapse the menu //
function ddCollapse(c){
  c.timer = setInterval(function(){ddSlide(c,-1)},DDTIMER);
}

// cancel the collapse if a user rolls over the dropdown //
function cancelHide(id){
  var h = document.getElementById(id + '-ddheader');
  var c = document.getElementById(id + '-ddcontent');
  clearTimeout(h.timer);
  clearInterval(c.timer);
  if(c.offsetHeight < c.maxh){
    c.timer = setInterval(function(){ddSlide(c,1)},DDTIMER);
  }
}

// incrementally expand/contract the dropdown and change the opacity //
function ddSlide(c,d){
  var currh = c.offsetHeight;
  var dist;
  if(d == 1){
    dist = (Math.round((c.maxh - currh) / DDSPEED));
  }else{
    dist = (Math.round(currh / DDSPEED));
  }
  if(dist <= 1 && d == 1){
    dist = 1;
  }
  c.style.height = currh + (dist * d) + 'px';
  c.style.opacity = currh / c.maxh;
  c.style.filter = 'alpha(opacity=' + (currh * 100 / c.maxh) + ')';
  if((currh < 2 && d != 1) || (currh > (c.maxh - 2) && d == 1)){
    clearInterval(c.timer);
  }
}

//Administration Variables (moved from pro.php on 1/13/2012 Dennis
//These are used globally including pro.php and common.php for the desktop and mobile versions

var currentmember="";
var currentmemberid="";
var guestname="";
var guestpassword="";
var guestid="";
var guestrole="";
var version="";
var myteamleader="";
var mymentorsarray= new Array();
var mymentorschanged=false;
var loadtime=2000;  //delay on initial Pro loading
var jsontime=400;	//delay before GetJson call to refresh

//Json Specific Javascript Functions

var jsonrelations;
var jsonmembers;
var jsonmembersall;
var jsonmembersonly;
var jsoneducation;
var jsonactivities;
var jsonactivityshellonly;
var jsonmessages;
var jsonfiles;
var jsonaudiogram;
var jsonassignments;
var jsonassignmentsmine;
var jsonhistorymine;
var jsonnotesmine;
var jsonmeasuresmine;
var jsonresults;
var jsonresultsmine;
var jsonresultsminestringed;
var jsonprotocols;
var jsonprotocolsstringed;
var jsoncustomsettings;
var jsonrelationscount;
var jsonmemberscount;
var jsonmembersallcount;
var jsonmembersonlycount;
var jsoneducationcount;
var jsonfilescount;
var jsonaudiogramcount;
var jsonassignmentscount;
var jsonassignmentsminecount;
var jsonhistoryminecount;
var jsonnotesminecount;
var jsonmeasuresminecount;
var jsonactivitiescount;
var jsonactivityshellonlycount;
var jsonmessagescount=0;
var jsonresultscount;
var jsonresultsminecount;
var jsonprotocolscount;
var jsoncustomsettingscount;
var jsonbelmaterials;
var jsonbelmaterialscount;
var jsonshsmaterials;
var jsonshsmaterialscount;

// return the value of the radio button that is checked
// return an empty string if none are checked, or
// there are no radio buttons
function getCheckedValue(radioname) {
	var radioButtons = document.getElementsByName(radioname);
	var selectedobject;
	for (var x = 0; x < radioButtons.length; x ++) {
		if (radioButtons[x].checked) {
			selectedobject=radioButtons[x];
		}
	}
	return selectedobject.value;
}

// set the radio button with the given value as being checked
// do nothing if there are no radio buttons
// if the given value does not exist, all the radio buttons
// are reset to unchecked
function setCheckedValue(radioObj, newValue) {
	if(!radioObj)
		return;
	var radioLength = radioObj.length;
	if(radioLength == undefined) {
		radioObj.checked = (radioObj.value == newValue.toString());
		return;
	}
	for(var i = 0; i < radioLength; i++) {
		radioObj[i].checked = false;
		if(radioObj[i].value == newValue.toString()) {
			radioObj[i].checked = true;
		}
	}
}

function isinarray(arr,obj) {
    return (arr.indexOf(obj) != -1);
}

function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

function count(obj) {
  var i = 0;
  for (var x in obj)
  {
	if (obj.hasOwnProperty(x))
	  i++;
  }
  return i;
}

function include(arr, obj) {
    for(var i=0; i<arr.length; i++) {
        if (arr[i] == obj) return true;
    }
}

function GetJsonIndex(req, user)
{
	var index=999999;  //user has no custom settings
	switch (req)
	{
		case "CustomSettings":
			for (i=0;i<jsoncustomsettingscount;i++) 
			{	
				if (jsoncustomsettings[i].username==user)
				{index=i;}
			}
			break;
	}
	return index;
}

function GetJson(req, user, doafter) {
	var jsondata;
	var projsonurl='projson.php';
	if (version=="mobile")
	{
		//IMPORTANT: for the mobile version, the full path is essential
		projsonurl='http://www.teamaudiology.org/projson.php';	
	}
	$.ajax({  
		type: 'POST',       
		url: projsonurl,         
		data: "requested="+req+"&user="+user,  
		dataType: 'json',
		cache: false,                           
		success: function(data)
		{
			if(data.success == 'n')
			{   
				alert(req + ' data not available: ' + data.msg_status);
			}  
			else  
			{  
				jsondata=jQuery.extend({}, data);
				//alert('There are ' + count(jsondata) + ' ' + req + ' data available.');
				//jsonmembers=jQuery.extend(true, {}, jsondata);  THIS DOES NOT WORK IN COPYING OBJECT OUTSIDE OF THIS FUNCTION
				if (req=="Relations")
				{
					jsonrelations=jsondata;
					jsonrelationscount=count(jsonrelations);
				}
				if (req=="MembersAll")
				{
					jsonmembersall=jsondata;
					jsonmembersallcount=count(jsonmembersall);
				}
				if (req=="MembersOnly")
				{
					jsonmembers=jsondata;
					jsonmemberscount=count(jsonmembers);
					if (doafter)
					{
						//this part is different from the common.js in pro
						if (version=="mobile")
						{
							if (isPhoneGapReady) 
								{
									showDatabaseStats();
								}
						}
						else
						{
							//version is Pro
							ShowDashboard();
						}
					}
				}
				if (req=="Education")
				{
					jsoneducation=jsondata;
					jsoneducationcount=count(jsoneducation);
				}
				if (req=="Activities")
				{
					jsonactivities=jsondata;
					jsonactivitiescount=count(jsonactivities);
				}
				if (req=="ActivityShellOnly")
				{	
					jsonactivityshellonly=jsondata;
					jsonactivityshellonlycount=count(jsonactivityshellonly);
					jsonactivities=jsonactivityshellonly;
					jsonactivitiescount=count(jsonactivities);
				}
				if (req=="Messages")
				{
					jsonmessages=jsondata;
					jsonmessagescount=count(jsonmessages);
					if (doafter)
					{
						ProInitialize(false);
					}
				}
				if (req=="Files")
				{
					jsonfiles=jsondata;
					jsonfilescount=count(jsonfiles);
				}
				if (req=="Audiogram")
				{
					jsonaudiogram=jsondata;
					jsonaudiogramcount=count(jsonaudiogram);
				}
				if (req=="Results")
				{
					jsonresults=jsondata;
					jsonresultscount=count(jsonresults);
				}
				if (req=="ResultsMine")
				{
					jsonresultsmine=jsondata;
					jsonresultsminecount=count(jsonresultsmine);
					//Post Processing in CallBack Function
					if (doafter)
					{
						UpdateTabs();
						UpdateMain(currenttab);
					}
				}
				if (req=="Protocols")
				{
					jsonprotocols=jsondata;
					jsonprotocolscount=count(jsonprotocols);
				}
				if (req=="HistoryMine")
				{
					jsonhistorymine=jsondata;
					jsonhistoryminecount=count(jsonhistorymine);
				}		
				if (req=="NotesMine")
				{
					jsonnotesmine=jsondata;
					jsonnotesminecount=count(jsonnotesmine);
				}		
				if (req=="MeasuresMine")
				{
					jsonmeasuresmine=jsondata;
					jsonmeasuresminecount=count(jsonmeasuresmine);
					//Post Processing in CallBack Function
					if (doafter)
					{
						setTimeout("LoadArchivedMeasure()",1000);
						setTimeout("CancelMeasure()",1200);
					}
				}		
				if (req=="CustomSettings")
				{
					jsoncustomsettings=jsondata;
					jsoncustomsettingscount=count(jsoncustomsettings);
				}
				if (req=="Assignments")
				{
					jsonassignments=jsondata;
					jsonassignmentscount=count(jsonassignments);
				}				
				if (req=="AssignmentsMine")
				{
					jsonassignmentsmine=jsondata;
					jsonassignmentsminecount=count(jsonassignmentsmine);
					//Post Processing in CallBack Function
					if (doafter)
					{
						testcount=jsonassignmentsminecount;
						UpdateTabs();
						UpdateMain(currenttab);
					}
				}		
				if (req=="BELmaterials")
				{
					jsonbelmaterials=jsondata;
					jsonbelmaterialscount=count(jsonbelmaterials);
				}	
				if (req=="SHSmaterials")
				{
					jsonshsmaterials=jsondata;
					jsonshsmaterialscount=count(jsonshsmaterials);
				}	
			}     
		}
	}); 
}

function Decoder(akey, tkey, displaytype)
{
	var mkey=akey.substr(1,2); //module key is 2nd and 3rd position of activity key
	var ender="\n";
	var translation="";
	var translationhtml="";
	
	switch (displaytype)
	{
		case "alert":
			ender="\n";
			break;
		case "html":
			ender="<br />";
			break;
		case "htmllong":
			ender="<br />";
			break;
		case "htmlshort":
			ender="<br />";
			break;
		case "htmlline":
			ender=", ";
			break;
		default:
			ender="\n";
	}

	switch (mkey)
	{
		case "01": //Percept Module
			//position0
				pos0=parseInt(tkey.substr(0,1));
				if (akey=="10100")
				{
					translationhtml="Harmonic Pitch, "
					translation="Activity: Harmonic Pitch" + ender + "Frequency Level: ";
					switch(pos0)
					{
							case 0: translation=translation + "110 Hz";  translationhtml=translationhtml + "110 Hz"; break;
							case 1: translation=translation + "220 Hz";  translationhtml=translationhtml + "220 Hz";  break;
							case 2: translation=translation + "440 Hz";  translationhtml=translationhtml + "440 Hz";  break;
					}
				}
				else
				{
					translationhtml="Tonal Pitch, "
					translation="Activity: Tonal Pitch" + ender + "Frequency Level: ";
					switch(pos0)
					{
							case 0: translation=translation + "250 Hz";  translationhtml=translationhtml + "250 Hz"; break;
							case 1: translation=translation + "500 Hz";  translationhtml=translationhtml + "500 Hz"; break;
							case 2: translation=translation + "1000 Hz";  translationhtml=translationhtml + "1000 Hz"; break;
							case 3: translation=translation + "2000 Hz";  translationhtml=translationhtml + "2000 Hz"; break;
							case 4: translation=translation + "4000 Hz";  translationhtml=translationhtml + "4000 Hz"; break;
					}					
				}
				translation=translation + ender;
			//position1
				translation=translation + "Frequency Rove? ";
				pos1=parseInt(tkey.substr(1,1));
				switch(pos1)
				{
					case 0: translation=translation + "off"; break;
					case 1: translation=translation + "on"; break;
					default: translation=translation + "off"; break;
				}
				translation=translation + ender;	
			//position2
				translation=translation + "Amplitude Rove? ";
				pos2=parseInt(tkey.substr(2,1));
				switch(pos2)
				{
					case 0: translation=translation + "off"; break;
					case 1: translation=translation + "on"; break;
					default: translation=translation + "off"; break;
				}
				translation=translation + ender;	
			break;
		case "02": //CARE Module
				switch (akey)
				{
					case "10200":
						translationhtml="Familiarization, "; 
						translation="Activity: Familiarization";
						break;
					case "10201":
						translationhtml="Gender Discrimination, "; 
						translation="Activity: Gender Discrimination";
						break;
					case "10202":
						translationhtml="Identification, "; 
						translation="Activity: Identification";
						break;
					case "10203":
						translationhtml="Pattern Memory, "; 
						translation="Activity: Pattern Memory";
						break;
					case "10204":
						translationhtml="Voice Recording, "; 
						translation="Activity: Voice Recording";
						break;
				}
			//position0
				translation=translation + ender + "Material: ";
				pos0=parseInt(tkey.substr(0,1));
				switch(pos0)
				{
					case 0: translation=translation + "Consonants"; translationhtml=translationhtml+"Consonants, "; break;
					case 1: translation=translation + "Vowels"; translationhtml=translationhtml+"Vowels, "; break;
				}
				translation=translation + ender;
			//position1
				translation=translation + ender + "Material Set: ";
				pos1=parseInt(tkey.substr(1,1));
				switch(pos1)
				{
					case 0: translation=translation + "Full Set"; translationhtml=translationhtml+"Full Set, "; break;
					case 1: translation=translation + "Comparisons"; translationhtml=translationhtml+"Comparisons, "; break;
					case 2: translation=translation + "Plosives"; translationhtml=translationhtml+"Plosives, "; break;
				}
				translation=translation + ender;
			//position2
				translation=translation + ender + "Noise Type: ";
				pos2=parseInt(tkey.substr(2,1));
				switch(pos2)
				{
					case 0: translation=translation + "Quiet"; translationhtml=translationhtml+"Quiet"; break;
					case 1: translation=translation + "Static Noise"; translationhtml=translationhtml+"Static Noise"; break;
					case 2: translation=translation + "Gated Noise"; translationhtml=translationhtml+"Gated Noise"; break;
				}
				translation=translation + ender;
			//position3
				translation=translation + "Noise Behaviour: ";
				pos3=parseInt(tkey.substr(3,1));
				switch(pos3)
				{
					case 1: translation=translation + "Adaptive"; break;
					case 2: translation=translation + "Constant"; break;
					default: translation=translation + "n/a"; break;
				}
				translation=translation + ender;						 
			//position4
				translation=translation + "SNR Level: ";
				pos4=parseInt(tkey.substr(4,1));
				switch(pos4)
				{
					case 1: translation=translation + "12"; break;
					case 2: translation=translation + "6"; break;
					case 3: translation=translation + "0"; break;
					case 4: translation=translation + "-6"; break;
					case 5: translation=translation + "-12"; break;
					default: translation=translation + "n/a"; break;
				}
				translation=translation + ender;
			//position5
				translation=translation + "SRT Convergence: ";
				pos5=parseInt(tkey.substr(5,1));
				switch(pos5)
				{
					case 1: translation=translation + "75%"; break;
					case 2: translation=translation + "50%"; break;
					case 3: translation=translation + "25%"; break;
					default: translation=translation + "n/a"; break;
				}
				translation=translation + ender;						 
			//position6
				translation=translation + "Adaptive Volume: ";
				pos6=parseInt(tkey.substr(6,1));
				switch(pos6)
				{
					case 1: translation=translation + "combined volume is constant"; break;
					case 2: translation=translation + "speech volume is constant"; break;
					case 3: translation=translation + "noise volume is constant"; break;
					default: translation=translation + "n/a"; break;
				}
				translation=translation + ender;		
			break;
		case "03": //SHS Module
			//position0
				pos0=parseInt(tkey.substr(0,2),10); //material is first 2 positions
				switch (akey)
				{
				case "10300":
					translationhtml="SHS Identification, "
					translation="SHS Activity: Identification" + ender + "Material: ";
					switch(pos0)
					{
							case 3: translation=translation + "consonants";  translationhtml=translationhtml + "consonants"; break;
							case 4: translation=translation + "vowels";  translationhtml=translationhtml + "vowels";  break;
							case 13: translation=translation + "comparisons";  translationhtml=translationhtml + "comparisons";  break;
					}
					break;
				case "10301":
					translationhtml="SHS Stress and Intonation, "
					translation="SHS Activity: Stress and Intonation" + ender + "Material: ";
					switch(pos0)
					{
							case 5: translation=translation + "word stress only";  translationhtml=translationhtml + "word stress only"; break;
							case 6: translation=translation + "intonation only";  translationhtml=translationhtml + "intonation only";  break;
							case 7: translation=translation + "word stress and intonation";  translationhtml=translationhtml + "word stress and intonation";  break;
							case 8: translation=translation + "syllable stress";  translationhtml=translationhtml + "syllable stress";  break;
					}
					break;
				case "10302":
					translationhtml="SHS Contextual, "
					translation="SHS Activity: Contextual" + ender + "Material: ";
					switch(pos0)
					{
							case 9: translation=translation + "numbers";  translationhtml=translationhtml + "numbers"; break;
							case 10: translation=translation + "people names";  translationhtml=translationhtml + "people names";  break;
							case 11: translation=translation + "geographic words";  translationhtml=translationhtml + "geographic words";  break;
							case 12: translation=translation + "everyday words";  translationhtml=translationhtml + "everyday words";  break;
					}
					break;
				case "10303":
					translationhtml="SHS Expansions, expansions"
					translation="SHS Activity: Expansions" + ender + "Material: expansions";
					break;
				}
			break;
		case "08": //CRISP Module
			//position0
				pos0=parseInt(tkey.substr(0,1));
				if (akey=="10801")
				{
					translationhtml="Identification, "
					translation="Activity: Identification" + ender + "Material: ";
					switch(pos0)
					{
							case 0: translation=translation + "CRISP";  translationhtml=translationhtml + "CRISP"; break;
							case 1: translation=translation + "CRISP Junior";  translationhtml=translationhtml + "CRISP Junior";  break;
					}
				}
				translation=translation + ender;
			break;
		case "11": //HeLPS module
			translationhtml="HeLPS Recording";
			translation="HeLPS Recording";
			break;
		default:
			translationhtml="";
			translation="";
	}
	
	switch (displaytype)
	{
		case "alert":
			return translation;
			break;
		case "html":
			return translation;
			break;
		case "htmllong":
			return translation;
			break;
		case "htmlshort":
			return translationhtml;
			break;
		case "htmlline":
			return translation;
			break;
		default:
			return translation;
	}
}
