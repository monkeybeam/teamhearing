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
		document.getElementById("msgbox").innerHTML="Logging in..";
		switch (loginversion)
		{
		case "professional":
			document.location='pro.php';
			break;
		case "legacy":			
			document.location='legacyhome.php';
			break;
		case "shell":
			document.location='shellonly.php';
			break;
		case "mobile":
			alert("at mobile");
			document.location='index.html#page3';				
			break;
		default:
			document.location='pro.php';
		}		
	});
	
	return false; //not to post the  form physically
}