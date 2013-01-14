function StartLogin()
{
	alert("at login form");
	//get variables
	var loginusername=document.getElementById("username").value;
	var loginpassword=document.getElementById("password").value;
	var loginversion=document.getElementById("version").value;
	alert(loginusername);
	//remove all the class add the messagebox classes and start fading
	//document.getElementById("msgbox").removeClass().addClass('messagebox').text('Validating....').fadeIn(1000);
	document.getElementById("msgbox").innerHTML="Validating...";
	alert(loginpassword);
	//check the username exists or not from ajax
	$.post("https://www.teamaudiology.org/phonegap/php/dbcontrol.php",{ action:'login',username:loginusername,password:loginpassword,version:loginversion,rand:Math.random() } ,function(data)
	{
	  if(data=='no')  //login failed
	  {
		alert("login failed");
		document.getElementById("msgbox").innerHTML="Your login detail failed..";
	  }
	  else //the login detail is correct
	  {
		alert("login worked");
		document.location='#page3';
	  }
	});
	
	return false; //not to post the  form physically
}