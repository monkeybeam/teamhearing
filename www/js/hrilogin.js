function StartLogin()
{
	alert("at login form");
	//get variables
	var loginusername=document.getElementById("username");
	var loginpassword=document.getElementById("password");
	var loginversion=document.getElementById("version");
	//remove all the class add the messagebox classes and start fading
	document.getElementById("msgbox").removeClass().addClass('messagebox').text('Validating....').fadeIn(1000);
	//check the username exists or not from ajax
	$.post("dbcontrol.php",{ action:'login',username:loginusername,password:loginpassword,version:loginversion,rand:Math.random() } ,function(data)
	{
	  if(data=='no')  //login failed
	  {
		document.getElementById("msgbox").fadeTo(200,0.1,function() //start fading the messagebox
		{ 
		  //add message and change the class of the box and start fading
		  document.getElementById("msgbox").html('Your login detail failed...').addClass('messageboxerror').fadeTo(900,1);
		});		
	  }
	  else //the login detail is correct
	  {
		document.getElementById("msgbox").fadeTo(200,0.1,function()  //start fading the messagebox
		{ 
		  //add message and change the class of the box and start fading
		  document.getElementById("msgbox").html('Logging in.....').addClass('messageboxok').fadeTo(900,1,
		 function()
		  { 
			//redirect to secure homepage
			alert(loginversion);
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
				document.location='http://www.teamaudiology.org/lite/index.html#page3';				
				break;
			default:
				document.location='pro.php';
			}
		  });			  
		});
	  }
			
	});
	
	return false; //not to post the  form physically
}