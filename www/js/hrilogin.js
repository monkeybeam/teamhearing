$(document).ready(function()
{

	$("#reportbug_form").submit(function()
	{
		//check the username exists or not from ajax
		$.post("dbcontrol.php",{ action:'reportbug',username:$('#guestname').val(),currentmodule:$('#currentmodule').val(),currentactivity:$('#currentactivity').val(),currentmaterial:$('#currentmaterial').val(),currentvideo:$('#currentvideo').val(),severity:$('#severity').val(),bugdescription:$('#bugdescription').val() } ,function(data)
        {
			if (data=='1')
			{
				alert("Your comment for the current material items has been sent.  Thank you!");
				document.getElementById('bugdescription').value="";
			}
			else
			{
				alert(data);
			}
        });
 		return false; //not to post the  form physically
	});

	$("#resetpassword_form").submit(function()
	{
		//check the username exists or not from ajax
		$.post("dbcontrol.php",{ action:'resetpassword',username:$('#signup').val() } ,function(data)
        {
		  if(data=='yes') //if correct login detail
		  {
			alert("register data is yes");
		  }
		  else 
		  {
			alert("Your account password has been reset.   \nCheck your email account for the new password for " + data + ".");
			//redirect to login page
			document.location='index.php';
          }
        });
 		return false; //not to post the  form physically
	});

	$("#changepassword_form").submit(function()
	{
		//check the username exists or not from ajax
		$.post("dbcontrol.php",{ action:'changepassword',username:$('#username').val(),newpassword1:$('#newpassword1').val(),newpassword2:$('#newpassword2').val() } ,function(data)
        {
		  if(data=='0') //if correct login detail
		  {
			//alert("Your account password has been changed.   \nCheck your email account for the new password for " + data + ".");
			ToggleDialog();  //hide the Change Password dialog box
			document.getElementById("updatemessage").innerHTML="The password for " + document.getElementById('username').value + " has been changed";
		  }
		  else 
		  {
			alert("Password Change Failed: " + data);
          }
        });
 		return false; //not to post the  form physically
	});

	$("#register_form").submit(function()
	{
		//check the username exists or not from ajax
		$.post("dbcontrol.php",{ action:'register',username:$('#signup').val(),password:$('#passcode').val(),email:$('#email').val(),firstname:$('#firstname').val(),lastname:$('#lastname').val(),dob:$('#dob').val(),registeredby:$('#registeredby').val() } ,function(data)
        {
		  if(data=='0') //if correct login detail
		  {
			alert("The account has been successfully registered.   \n" + document.getElementById('signup').value + " can now log in.");
			document.getElementById('signup').value="";
			document.getElementById('passcode').value="";
			document.getElementById('email').value="";
			document.getElementById('firstname').value="";
			document.getElementById('lastname').value="";
			document.getElementById('dob').value="";
		  }
		  else 
		  {
			alert("Registration Failed: " + data);
          }
        });
 		return false; //not to post the  form physically
	});

	$("#settings_form").submit(function()
	{
		$.post("dbcontrol.php",{ action:'updatesettings',settingsfor:$('#settingsfor').val(),carecategoryview:$('#carecategoryview').val(),careunlocked:$('#caretunlocked').val(),perceptunlocked:$('#perceptunlocked').val(),setby:$('#setby').val() } ,function(data)
        {
		  if(data=='0') //if message delivery is successful
		  {
			alert("Settings have been updated.  ");
			ToggleSettings();  //hide the Settings dialog box
		  }
		  else 
		  {
			alert("Update Failed: " + data);
          }
        });
 		return false; //not to post the  form physically
	});

	$("#message_form").submit(function()
	{
		$.post("dbcontrol.php",{ action:'sendmessage',messageto:$('#messageto').val(),messagefrom:$('#messagefrom').val(),messagetext:$('#messagetext').val() } ,function(data)
        {
		  if(data=='0') //if message delivery is successful
		  {
			alert("Your message has been sent.  ");
			document.getElementById('messagetext').value="";
		  }
		  else 
		  {
			alert("Message Delivery Failed: " + data);
          }
        });
 		return false; //not to post the  form physically
	});

	$("#login_form").submit(function()
	{
		alert("at login form");
		//remove all the class add the messagebox classes and start fading
		$("#msgbox").removeClass().addClass('messagebox').text('Validating....').fadeIn(1000);
		//check the username exists or not from ajax
		$.post("dbcontrol.php",{ action:'login',username:$('#username').val(),password:$('#password').val(),version:$('#version').val(),rand:Math.random() } ,function(data)
        {
		  if(data=='no')  //login failed
		  {
		  	$("#msgbox").fadeTo(200,0.1,function() //start fading the messagebox
			{ 
			  //add message and change the class of the box and start fading
			  $(this).html('Your login detail failed...').addClass('messageboxerror').fadeTo(900,1);
			});		
		  }
		  else //the login detail is correct
		  {
			$("#msgbox").fadeTo(200,0.1,function()  //start fading the messagebox
			{ 
			  //add message and change the class of the box and start fading
			  $(this).html('Logging in.....').addClass('messageboxok').fadeTo(900,1,
			 function()
			  { 
			  	//redirect to secure homepage
				var thisversion=$('#version').val();
				alert(thisversion);
				switch (thisversion)
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
				default:
					document.location='pro.php';
				}
			  });			  
			});
          }
				
        });
		
 		return false; //not to post the  form physically
	});
	//now call the ajax also focus move from 
	$("#password").blur(function()
	{
		$("#login_form").trigger('submit');
	});
	
});