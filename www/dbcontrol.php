<?php session_start();

function genpwd($cnt)  
{  
// characters to be included for randomization, here you can add or delete the characters   
$pwd = str_shuffle('abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#%$*');  
// here specify the 2nd parameter as start position, it can be anything, default 0   
return substr($pwd,0,$cnt);   
}  

function GetErrorMessage($code){
	switch($code)
	{
		case "0":
			$message="SUCCESS";
			break;
		case "101":
			$message="The value is null.";
			break;
		case "201":
			$message="No username was provided.  ";
			break;
		case "202":
			$message="The username provided already exists in the system.  ";
			break;
		case "203":
			$message="Invalid username.  It must be a minimum of 6 characters.  ";
			break;
		case "301":
			$message="No password was provided.  ";
			break;
		case "302":
			$message="Invalid password.  It must be a minimum of 8 characters.  ";
			break;
		case "303":
			$message="Invalid password.  Not alphanumeric.  ";
			break;
		case "304":
			$message="Password should contain atleast one numeric character.  ";
			break;
		case "305":
			$message="Password should contain atleast one alphabetic character.  ";
			break;
		case "399":
			$message="New passwords entered did not match.  ";
			break;
		case "401":
			$message="No email was provided.  ";
			break;
		case "402":
			$message="Invalid email was provided.  Missing @ sign. ";
			break;
		case "403":
			$message="Invalid email was provided.  Missing a period.  ";
			break;
		default:
			$message="ERROR CODE $code is UNKNOWN";
	}
	return $message;
}

function Validate($field, $value){
	$checkcode="0";
	//do general check for value
	if(strlen($value)<1){
		$checkcode="101";
	}
	//do field specific check for value
	switch ($field)
	{
		case "username":
			//check if value is not null
			if(strlen($value)<1)
			{$checkcode="201";}		
			//check if already exists in the system
			$sql="SELECT DISTINCT username FROM tbl_user WHERE username LIKE '".$value."' LIMIT 1";
			$result=mysql_query($sql);
			if(mysql_num_rows($result)>0)
			{$checkcode="202";}
			if (strlen($value)<6)
			{$checkcode="203";}
			break;
		case "password":
			if(0 === preg_match('~[abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ]~', $value))
			{$checkcode="305";}
			if(0 === preg_match('~[0-9]~', $value))
			{$checkcode="304";}
			if (ctype_alnum($value)==0)
			{$checkcode="303";}
			if (strlen($value)<8)
			{$checkcode="302";}
			if (strlen($value)<1)
			{$checkcode="301";}		
			break;
		case "email":
			//check if value is not null
			if(strlen($value)<1)
			{$checkcode="401";}		
			else
			{
				//check if @ sign is in the string
				if (strlen(stristr($value,"@"))==0)
				{$checkcode="402";}		
				//check if . is in the string
				if (strlen(stristr($value,"."))==0)
				{$checkcode="403";}
			}
			break;
		default:
			$checkcode="0"; //zero means successfully validated
	}
	return $checkcode;  
}

	
//Connect to database from here
$link = mysql_connect('teamaudiologydev.db.8271327.hostedresource.com', 'teamaudiologydev', 'mango11A'); 
if (!$link) {
    die('Could not connect: ' . mysql_error());
}
//select the database
mysql_select_db('teamaudiologydev'); 


//determine action requested
$action=htmlspecialchars($_POST['action'],ENT_QUOTES);
$nowtime=time();
$today=date('Y-m-d H:i:s', $nowtime); 
$loginid=$_SESSION['u_loginid'];
$word="";
$answer="";

switch ($action)
{
	case "login":
			//get the posted values
			$username=htmlspecialchars($_POST['username'],ENT_QUOTES);
			$pass=md5($_POST['password']);
			$version=htmlspecialchars($_POST['version'],ENT_QUOTES);
			//now validating the username and password
			$sql="SELECT userid, username, role, password FROM tbl_user WHERE username LIKE '".$username."'";
			$result=mysql_query($sql);
			$row=mysql_fetch_array($result);
			$logincorrect="yes";
			$success="yes";
			//if username exists
			if(mysql_num_rows($result)>0)
			{
				//compare the password
				if(strcmp($row['password'],$pass)==0)
				{
					$logincorrect="yes";
					//now set the session from here if needed
					$_SESSION['u_name']=$row['username'];  //Note: username from the database is better than $username because it is how the variable was stored so that also has a value that has the exact case for each character (as opposed to the case insensitive username typed in during login
					$_SESSION['u_id']=$row['userid']; 
					$_SESSION['u_role']=$row['role']; 
					$_SESSION['u_viewstate']="normal";
					//change the session version from professional to athome if version is professional already but the role is client or tester
					if ($version=="professional")
					{
						if(($row['role']=="client") || ($row['role']=="tester"))
						{$version="athome";}
					}
					$_SESSION['u_version']=$version; 
					
				}
				else
				{
					$logincorrect="no";
					$success="no";
				}
			}
			else
			{
				$logincorrect="no";
				$success="no";
			}
			//save login attempt to tbl_login
			$urole=$_SESSION['u_role'];
			$uipad=$_SESSION['iPaduser'];
			$uversion=$version;
			$uplatform=$_SERVER['HTTP_USER_AGENT'];
			$udomain=$_SERVER['SERVER_NAME'];
			$uremoteaddress=$_SERVER['REMOTE_ADDR'];
			$uremotehost=gethostbyaddr($uremoteaddress);
			$sql2="INSERT INTO tbl_login (loginname, role, isipad, version, platform, domain, remotehost, success, logindate) VALUES ('$username', '$urole', '$uipad', '$uversion', '$uplatform', '$udomain', '$uremotehost', '$success', '$today')";
			$result2=mysql_query($sql2);
			$lastloginid=mysql_insert_id();
			if ($logincorrect=="yes")
				{
				echo("$lastloginid");
				$_SESSION['u_loginid']=$lastloginid; 
				$_SESSION['u_domain']=$udomain; 
				}
			else
				{echo("$logincorrect");}			
			break;
	case "reportbug":
			//get the posted values
			$username=htmlspecialchars($_POST['username'],ENT_QUOTES);
			$currentmodule=htmlspecialchars($_POST['currentmodule'],ENT_QUOTES);
			$currentactivity=htmlspecialchars($_POST['currentactivity'],ENT_QUOTES);
			$currentmaterial=htmlspecialchars($_POST['currentmaterial'],ENT_QUOTES);
			$currentvideo=htmlspecialchars($_POST['currentvideo'],ENT_QUOTES);
			$bugdescription=htmlspecialchars($_POST['bugdescription'],ENT_QUOTES);
			$severity=htmlspecialchars($_POST['severity'],ENT_QUOTES);
			if (isset($severity))
			{
				$severity=intval($severity);
			}
			else
			{
				$severity=0;
			}
			//save bug reported
			$sql="INSERT INTO tbl_bugs (username, module, activityname, materialitem, videoname, bugdescription, severity, reportdate) VALUES ('$username', '$currentmodule', '$currentactivity', '$currentmaterial', '$currentvideo', '$bugdescription', $severity, '$today')";
			$status = mysql_query($sql) or die("A MySQL error has occurred.<br />Your Query: " . $sql . "<br /> Error: (" . mysql_errno() . ") " . mysql_error());
			echo "$status";
			break;
	case "updatesettings":
			//get the posted values
			$username=htmlspecialchars($_POST['settingsfor'],ENT_QUOTES);
			$carecategoryview=intval(htmlspecialchars($_POST['carecategoryview'],ENT_QUOTES));
			$careunlocked=intval(htmlspecialchars($_POST['careunlocked'],ENT_QUOTES));
			$perceptunlocked=intval(htmlspecialchars($_POST['perceptunlocked'],ENT_QUOTES));
			$setby=htmlspecialchars($_POST['setby'],ENT_QUOTES);
			//check if username already has a record in tbl_usercustom
			$sql1="SELECT * FROM tbl_usercustom WHERE username LIKE '$username' LIMIT 1";
			$result1=mysql_query($sql1);
			$numofrecords=mysql_num_rows($result1);
			if ($numofrecords>0)
			{
				$sql="UPDATE tbl_usercustom SET carecategoryview=$carecategoryview, careunlocked=$careunlocked, perceptunlocked=$perceptunlocked, setby='$setby', setdate='$today' WHERE username LIKE '$username'";
				$result=mysql_query($sql);
			}
			else
			{
				$sql="INSERT INTO tbl_usercustom (username, carecategoryview, careunlocked, perceptunlocked, setby, setdate) VALUES ('$username', $carecategoryview, $careunlocked, $perceptunlocked, '$setby', '$today')";
				$result=mysql_query($sql);
			}
			$validationcode=0;  //always valid
			$status=$validationcode;
			echo "$status";			
			break;
	case "changepassword":
			//get the posted values
			$username=htmlspecialchars($_POST['username'],ENT_QUOTES);
			$newpassword1=htmlspecialchars($_POST['newpassword1'],ENT_QUOTES);
			$newpassword2=htmlspecialchars($_POST['newpassword2'],ENT_QUOTES);
			//validate entries
			$validationcode = Validate("password", $newpassword1);
			if ($validationcode=="0")
			{$validationcode = Validate("password", $newpassword2);}
			if ($newpassword1<>$newpassword2)
			{$validationcode = "399"; } //force an error
			if ($validationcode=="0")
			{
				$encryptedpass=md5($newpassword1);
				//save newly generated password for username
				$sql="UPDATE tbl_user SET password='$encryptedpass' WHERE username LIKE '$username'";
				$result=mysql_query($sql);
				//get the email address of the user account with the password reset
				$sql2="SELECT * FROM tbl_user WHERE username LIKE '$username' LIMIT 1";
				$result2=mysql_query($sql2);
				$row2=mysql_fetch_array($result2);
				$email=$row2['email'];
				//email new password to the user
				$to = $email;
				$subject = "Team Hearing password changed";
				$message = $username . ", \n\nThe password for your Team Hearing account has been changed.  Below is the new password you provided (do not share to anyone): \n\n       " . $newpassword1;
				$from = "noreply@teamhearing.org";
				$headers = "From: $from";
				mail($to,$subject,$message,$headers);			
				$status=$validationcode;
			}
			else
			{
				$errormessage=GetErrorMessage($validationcode);
				$status=$errormessage;
			}
			echo "$status";			
			break;
	case "resetpassword":
			//get the posted values
			$username=htmlspecialchars($_POST['username'],ENT_QUOTES);
			$randompass=genpwd(10);
			$encryptedpass=md5($randompass);
			//save newly generated password for username
			$sql="UPDATE tbl_user SET password='$encryptedpass' WHERE username LIKE '$username'";
			$result=mysql_query($sql);
			//get the email address of the user account with the password reset
			$sql2="SELECT * FROM tbl_user WHERE username LIKE '$username' LIMIT 1";
			$result2=mysql_query($sql2);
			$row2=mysql_fetch_array($result2);
			$email=$row2['email'];
			//email new password to the user
			$to = $email;
			$subject = "Team Hearing password reset";
			$message = $username . ", \n\nThe password for your Team Hearing account has been reset.  Below is the new password provided to you (do not share to anyone): \n\n       " . $randompass;
			$from = "noreply@teamhearing.org";
			$headers = "From: $from";
			mail($to,$subject,$message,$headers);			
			echo "$username";
			break;
	case "marksessionview":
			//get the posted values
			$viewstate=htmlspecialchars($_POST['viewstate'],ENT_QUOTES);
			//change session to the new view state
			$_SESSION['u_viewstate']=$viewstate;
			echo "$viewstate";
			break;
	case "markmessagesread":
			//get the posted values
			$messageto=htmlspecialchars($_POST['messageto'],ENT_QUOTES);
			//mark all messages of user $messageto as read
			$sql="UPDATE tbl_messages SET status='read' WHERE messageto='$messageto'";
			$result=mysql_query($sql);
			echo "$messageto";
			break;
	case "sendmessage":
			//get the posted values
			$messagetoid=htmlspecialchars($_POST['messagetoid'],ENT_QUOTES);
			$messagefromid=htmlspecialchars($_POST['messagefromid'],ENT_QUOTES);
			$messagetext=htmlspecialchars($_POST['messagetext'],ENT_QUOTES);
			$status="unread";
			//get email
			$sqluser="SELECT email FROM tbl_user WHERE userid LIKE '$messagetoid' LIMIT 1";
			$resultuser=mysql_query($sqluser);
			$row=mysql_fetch_array($resultuser);
			$email=$row['email'];
			
			//save new message
			$sql="INSERT INTO tbl_messages (messagetoid, messagefromid, messagetext, status, messagedate) VALUES ('$messagetoid', '$messagefromid', '$messagetext', '$status', '$today')";
			$result=mysql_query($sql);

			//forward IM to email
			// $from = "noreply@teamhearing.org";
			// $headers = "From: $from";			
			// $subject="Message regarding TeamHearing.org";	
			// $message="You have received the following message from $messagefrom...\n\n\n$messagetext\n\n\nLogin to www.teamhearing.org using your $messageto account to reply.  ";
			// mail($email,$subject,$message,$headers);		

			echo "0";  //for success
			break;
	case "saveaudiogram":
			//get the posted values
			$userid=htmlspecialchars($_POST['userid'],ENT_QUOTES);
			$right_ac=htmlspecialchars($_POST['right_ac'],ENT_QUOTES);
			$right_bc=htmlspecialchars($_POST['right_bc'],ENT_QUOTES);
			$right_acm=htmlspecialchars($_POST['right_acm'],ENT_QUOTES);
			$right_bcm=htmlspecialchars($_POST['right_bcm'],ENT_QUOTES);
			$left_ac=htmlspecialchars($_POST['left_ac'],ENT_QUOTES);
			$left_bc=htmlspecialchars($_POST['left_bc'],ENT_QUOTES);
			$left_acm=htmlspecialchars($_POST['left_acm'],ENT_QUOTES);
			$left_bcm=htmlspecialchars($_POST['left_bcm'],ENT_QUOTES);
			//save new message
			$sql="INSERT INTO tbl_audiogram (audiogramuserid, right_ac, right_bc, right_acm, right_bcm, left_ac, left_bc, left_acm, left_bcm, testdate) VALUES ('$userid', '$right_ac', '$right_bc', '$right_acm', '$right_bcm', '$left_ac', '$left_bc', '$left_acm', '$left_bcm', '$today')";
			$result=mysql_query($sql);
			echo "0";  //for success
			break;
	case "register":
			//get the posted values
			$registrationstatus="0";
			$username=htmlspecialchars($_POST['username'],ENT_QUOTES);
			$password=htmlspecialchars($_POST['password'],ENT_QUOTES);
			$email=htmlspecialchars($_POST['email'],ENT_QUOTES);
			$gender=htmlspecialchars($_POST['gender'],ENT_QUOTES);
			$role=htmlspecialchars($_POST['role'],ENT_QUOTES);
			$fname=htmlspecialchars($_POST['firstname'],ENT_QUOTES);
			$lname=htmlspecialchars($_POST['lastname'],ENT_QUOTES);
			$dob=htmlspecialchars($_POST['dob'],ENT_QUOTES);
			$regby=htmlspecialchars($_POST['registeredby'],ENT_QUOTES);
			
			if ($regby=="")
			{$regby="SELF";}
			if ($role=="")
			{$role="client";}

			//validate entries
			$validationcode = Validate("username", $username);
			if ($validationcode=="0")
			{$validationcode = Validate("password", $password);}
			if ($validationcode=="0")
			{$validationcode = Validate("email", $email);}
			if ($validationcode=="0")
			{
				$encryptedpass=md5($password);
				//save new registration information
				$sql="INSERT INTO tbl_user (username, password, email, gender, role, firstname, lastname, dob, regby, regdate) VALUES ('$username', '$encryptedpass', '$email', '$gender', '$role', '$fname', '$lname','$dob','$regby','$today')";
				$result=mysql_query($sql);
				//email password to the new user
				$to = $email;
				$subject = "Team Hearing registration confirmed";
				$message = $username . ", \n\nThe registration for your Team Hearing account is confirmed.  Below is the password you provided (do not share to anyone): \n\n       " . $password;
				if ($regby!="SELF")
				{
					$message = $message . "\n\nNote: Your account was registered for you by your teamleader, $regby";
				}
				$from = "noreply@teamhearing.org";
				$headers = "From: $from";
				mail($to,$subject,$message,$headers);		
				$registrationstatus=$validationcode;
				if ($regby!="SELF")
				{	
					//get userid of new user
					$sqluser="SELECT * FROM tbl_user WHERE username LIKE '$username'";
					$resultuser=mysql_query($sqluser);
					$row=mysql_fetch_array($resultuser);
					$newuserid=$row['userid'];
					//get userid of new leader
					$sqluser="SELECT * FROM tbl_user WHERE username LIKE '$regby'";
					$resultuser=mysql_query($sqluser);
					$row=mysql_fetch_array($resultuser);
					$newleaderid=$row['userid'];
					//SINCE registration is not SELF administered
					//automatically create a relationship with registered by as team leader of new user account
					$sql="INSERT INTO tbl_relations VALUES ($newuserid, $newleaderid, 'team', '$today', '$today')";
					$result=mysql_query($sql);
				}
			}
			else
			{
				$errormessage=GetErrorMessage($validationcode);
				$registrationstatus=$errormessage;
			}
			echo "$registrationstatus";
			break;
	case "savescore":
			//get the posted values
			$userid=htmlspecialchars($_POST['userid'],ENT_QUOTES);
			$module='Percept';
			$activity=htmlspecialchars($_POST['activity'],ENT_QUOTES);
			$volume=htmlspecialchars($_POST['volume'],ENT_QUOTES);
			$duration=htmlspecialchars($_POST['duration'],ENT_QUOTES);
			$pause=htmlspecialchars($_POST['pause'],ENT_QUOTES);
			$standardfrequency=htmlspecialchars($_POST['standardfrequency'],ENT_QUOTES);
			$score=htmlspecialchars($_POST['score'],ENT_QUOTES);
			$scorecorrect=htmlspecialchars($_POST['scorecorrect'],ENT_QUOTES);
			$scoretotal=htmlspecialchars($_POST['scoretotal'],ENT_QUOTES);
			$currentlevel=htmlspecialchars($_POST['currentlevel'],ENT_QUOTES);
			$protocolinstance=htmlspecialchars($_POST['protocolinstance'],ENT_QUOTES);
			$protocolid=htmlspecialchars($_POST['protocolid'],ENT_QUOTES);
			$activitykey=htmlspecialchars($_POST['activitykey'],ENT_QUOTES);
			$testkey=htmlspecialchars($_POST['testkey'],ENT_QUOTES);
			$diffseries=htmlspecialchars($_POST['diffseries'],ENT_QUOTES);
			$standardseries=htmlspecialchars($_POST['standardseries'],ENT_QUOTES);
			$starttime=htmlspecialchars($_POST['starttime'],ENT_QUOTES);
			$completiontime=htmlspecialchars($_POST['completiontime'],ENT_QUOTES);
			//save the score info
			$sql="INSERT INTO tbl_result (resultuserid, module, activity, level, volume, duration, pause, standardfrequency, score, scorecorrect, scoretotal, protocolinstance, protocolid, activitykey, testkey, diffseries, standardseries, starttime, completion, loginid) VALUES ('$userid', '$module', '$activity', '$currentlevel', '$volume','$duration', '$pause', '$standardfrequency', '$score', '$scorecorrect', '$scoretotal', '$protocolinstance', '$protocolid', '$activitykey', '$testkey', '$diffseries', '$standardseries', FROM_UNIXTIME($starttime), FROM_UNIXTIME($completiontime), '$loginid')";
			$result=mysql_query($sql);
			echo "currentlevel: $currentlevel  sql: $sql";
			break;
	case "savemask":
			//get the posted values
			//NOTE: for Percept Advanced, module variable is actually the activity
			$username=htmlspecialchars($_POST['username'],ENT_QUOTES);
			$truemodule='Percept';
			$activity=htmlspecialchars($_POST['module'],ENT_QUOTES);  //this is actually the activity
			$volume=htmlspecialchars($_POST['volume'],ENT_QUOTES);
			$duration=htmlspecialchars($_POST['duration'],ENT_QUOTES);
			$standardduration=htmlspecialchars($_POST['standardduration'],ENT_QUOTES);
			$targetduration=htmlspecialchars($_POST['targetduration'],ENT_QUOTES);
			$rampduration=htmlspecialchars($_POST['rampduration'],ENT_QUOTES);
			$pause=htmlspecialchars($_POST['pause'],ENT_QUOTES);
			$standardfrequency=htmlspecialchars($_POST['standardfrequency'],ENT_QUOTES);
			$targetfrequency=htmlspecialchars($_POST['targetfrequency'],ENT_QUOTES);
			$score=htmlspecialchars($_POST['score'],ENT_QUOTES);
			$scorecorrect=htmlspecialchars($_POST['scorecorrect'],ENT_QUOTES);
			$scoretotal=htmlspecialchars($_POST['scoretotal'],ENT_QUOTES);
			$currentlevel=htmlspecialchars($_POST['currentlevel'],ENT_QUOTES);
			//save the score info
			$sql="INSERT INTO tbl_result (username, module, activity, level, volume, duration, standardduration, targetduration, rampduration, pause, standardfrequency, targetfrequency, score, scorecorrect, scoretotal, completion, loginid) VALUES ('$username', '$truemodule', '$activity', '$currentlevel', '$volume', '$duration', '$standardduration', '$targetduration', '$rampduration', '$pause', '$standardfrequency', '$targetfrequency', '$score', '$scorecorrect', '$scoretotal', '$today', '$loginid')";
			$result=mysql_query($sql);
			echo "currentlevel: $currentlevel  sql: $sql";
			break;
	case "savespeech":
			//get the posted values
			$userid=htmlspecialchars($_POST['userid'],ENT_QUOTES);
			$module=htmlspecialchars($_POST['module'],ENT_QUOTES);
			if (($module=="CARE") || ($module=="SHS") || ($module=="Environmental") || ($module=="UWM") || ($module=="BEL")  || ($module=="SPIN")  || ($module=="CRISP"))
			{
				$activity=htmlspecialchars($_POST['activityname'],ENT_QUOTES);
				$word=htmlspecialchars($_POST['word'],ENT_QUOTES);
				$response=htmlspecialchars($_POST['response'],ENT_QUOTES);
				$answer=htmlspecialchars($_POST['answer'],ENT_QUOTES);
				$gender=htmlspecialchars($_POST['gender'],ENT_QUOTES);
				$talker=htmlspecialchars($_POST['talker'],ENT_QUOTES);
				$currentlevel=htmlspecialchars($_POST['currentlevel'],ENT_QUOTES);
				$newlevel=htmlspecialchars($_POST['newlevel'],ENT_QUOTES);
				//convert to array
				$wordlist = explode(",", $word);
				$responselist = explode(",", $response);
				$answerlist = explode(",", $answer);
				$genderlist = explode(",", $gender);
				$talkerlist = explode(",", $talker);
				//pro related
				$protocolinstance=htmlspecialchars($_POST['protocolinstance'],ENT_QUOTES);
				$protocolid=htmlspecialchars($_POST['protocolid'],ENT_QUOTES);
				$activitykey=htmlspecialchars($_POST['activitykey'],ENT_QUOTES);
				$testkey=htmlspecialchars($_POST['testkey'],ENT_QUOTES);
				$snrseries=htmlspecialchars($_POST['snrseries'],ENT_QUOTES);
				$correctseries=htmlspecialchars($_POST['correctseries'],ENT_QUOTES);
			}
			else
			{	
				$activity=$_SESSION['u_material'];
			}
			$score=htmlspecialchars($_POST['score'],ENT_QUOTES);
			$scorecorrect=htmlspecialchars($_POST['scorecorrect'],ENT_QUOTES);
			$scoretotal=htmlspecialchars($_POST['scoretotal'],ENT_QUOTES);
			$adaptedat=htmlspecialchars($_POST['adaptedat'],ENT_QUOTES);
			$adaptedcorrect=htmlspecialchars($_POST['adaptedcorrect'],ENT_QUOTES);
			$starttime=htmlspecialchars($_POST['starttime'],ENT_QUOTES);
			$completiontime=htmlspecialchars($_POST['completiontime'],ENT_QUOTES);
			//save the score info
			$sql="INSERT INTO tbl_result (resultuserid, module, activity, level, score, scorecorrect, scoretotal, adaptedat, adaptedcorrect, protocolinstance, protocolid, activitykey, testkey, snrseries, correctseries, wordlist, responselist, genderlist, talkerlist, starttime, completion, loginid) VALUES ('$userid', '$module', '$activity', '$currentlevel', '$score', '$scorecorrect', '$scoretotal', '$adaptedat', '$adaptedcorrect', '$protocolinstance', '$protocolid', '$activitykey', '$testkey', '$snrseries', '$correctseries', '$word', '$response', '$gender', '$talker', FROM_UNIXTIME($starttime), FROM_UNIXTIME($completiontime), '$loginid')";
			$result=mysql_query($sql);
			$lastresultid=mysql_insert_id();
			//save the individual answer info
			if (($module=="SHS") || ($module=="Environmental"))
			{
				for ($i=0;$i<sizeof($wordlist);$i++) {
					$sqlanswer="INSERT INTO tbl_answers (resultid, word, answer) VALUES ('$lastresultid', '$wordlist[$i]', '$answerlist[$i]')";
					$resultanswer=mysql_query($sqlanswer);			
				}
			}
			if ((($module=="CARE") && (strlen(stristr($activity,"Practice"))==0)) || ($module=="BEL") || ($module=="SPIN"))
			{
				//For CARE, also include gender and talker info with answers
				//BUT only for Gender Identification, Vowel Test and Consonant Test activities
				for ($i=0;$i<sizeof($wordlist);$i++) {
					$genderchar="";
					if($genderlist[$i]=="0")
						{$genderchar="M";}
					if($genderlist[$i]=="1")
						{$genderchar="W";}
					$sqlanswer="INSERT INTO tbl_answers (resultid, word, answer, gender, talker) VALUES ('$lastresultid', '$wordlist[$i]', '$answerlist[$i]', '$genderchar', '$talkerlist[$i]')";
					$resultanswer=mysql_query($sqlanswer);			
				}
				$result=mysql_query($sqlanswer);
			}
			
			//echo "userid:$userid  module:$module  activity:$activity score:$score";
			echo ("$sql");
			break;
	case "updatementors":
			//get the posted values, all from pro
			$userid=htmlspecialchars($_POST['userid'],ENT_QUOTES);
			$mentors=htmlspecialchars($_POST['mentorslist'],ENT_QUOTES);
			$mentorslist = explode(",", $mentors);
			$sqlclear="DELETE FROM tbl_relations WHERE userid='$userid' and relationtype='mentor'";
			$resultclear=mysql_query($sqlclear);
			for ($i=0;$i<sizeof($mentorslist);$i++) {
				$sql="INSERT INTO tbl_relations (userid, relationid, relationtype, relationdate, revisiondate) VALUES ('$userid', '$mentorslist[$i]', 'mentor', '$today', '$today')";
				$result=mysql_query($sql);
			}
			echo ("$sql");
			break;
	case "savenewhistory":
			//get the posted values, all from pro
			$userid=htmlspecialchars($_POST['userid'],ENT_QUOTES);
			$symmetry=htmlspecialchars($_POST['symmetry'],ENT_QUOTES);
			$right_status=htmlspecialchars($_POST['right_status'],ENT_QUOTES);
			$right_onsetyr=htmlspecialchars($_POST['right_onsetyr'],ENT_QUOTES);
			$right_onsetmo=htmlspecialchars($_POST['right_onsetmo'],ENT_QUOTES);
			$right_diagnosisyr=htmlspecialchars($_POST['right_diagnosisyr'],ENT_QUOTES);
			$right_diagnosismo=htmlspecialchars($_POST['right_diagnosismo'],ENT_QUOTES);
			$right_cause=htmlspecialchars($_POST['right_cause'],ENT_QUOTES);
			
			$left_status=htmlspecialchars($_POST['left_status'],ENT_QUOTES);
			$left_onsetyr=htmlspecialchars($_POST['left_onsetyr'],ENT_QUOTES);
			$left_onsetmo=htmlspecialchars($_POST['left_onsetmo'],ENT_QUOTES);
			$left_diagnosisyr=htmlspecialchars($_POST['left_diagnosisyr'],ENT_QUOTES);
			$left_diagnosismo=htmlspecialchars($_POST['left_diagnosismo'],ENT_QUOTES);
			$left_cause=htmlspecialchars($_POST['left_cause'],ENT_QUOTES);

			$right_device=htmlspecialchars($_POST['right_device'],ENT_QUOTES);
			$right_hafityr=htmlspecialchars($_POST['right_hafityr'],ENT_QUOTES);
			$right_hafitmo=htmlspecialchars($_POST['right_hafitmo'],ENT_QUOTES);
			$right_hafityr=htmlspecialchars($_POST['right_hafityr'],ENT_QUOTES);
			$right_hamanufacturer=htmlspecialchars($_POST['right_hamanufacturer'],ENT_QUOTES);
			$right_cifityr=htmlspecialchars($_POST['right_cifityr'],ENT_QUOTES);
			$right_cifitmo=htmlspecialchars($_POST['right_cifitmo'],ENT_QUOTES);
			$right_cifityr=htmlspecialchars($_POST['right_cifityr'],ENT_QUOTES);
			$right_cimanufacturer=htmlspecialchars($_POST['right_cimanufacturer'],ENT_QUOTES);
			$right_electrodes=htmlspecialchars($_POST['right_electrodes'],ENT_QUOTES);
			$right_strategy=htmlspecialchars($_POST['right_strategy'],ENT_QUOTES);		
			
			$left_device=htmlspecialchars($_POST['left_device'],ENT_QUOTES);
			$left_hafityr=htmlspecialchars($_POST['left_hafityr'],ENT_QUOTES);
			$left_hafitmo=htmlspecialchars($_POST['left_hafitmo'],ENT_QUOTES);
			$left_hafityr=htmlspecialchars($_POST['left_hafityr'],ENT_QUOTES);
			$left_hamanufacturer=htmlspecialchars($_POST['left_hamanufacturer'],ENT_QUOTES);
			$left_cifityr=htmlspecialchars($_POST['left_cifityr'],ENT_QUOTES);
			$left_cifitmo=htmlspecialchars($_POST['left_cifitmo'],ENT_QUOTES);
			$left_cifityr=htmlspecialchars($_POST['left_cifityr'],ENT_QUOTES);
			$left_cimanufacturer=htmlspecialchars($_POST['left_cimanufacturer'],ENT_QUOTES);
			$left_electrodes=htmlspecialchars($_POST['left_electrodes'],ENT_QUOTES);
			$left_strategy=htmlspecialchars($_POST['left_strategy'],ENT_QUOTES);					
			//$historyarray = json_decode($_POST['historystring']);
			$sql="INSERT INTO tbl_hearinginfo (hearinginfoid, hearingdate, symmetry, 
			right_status, right_onsetyr, right_onsetmo, right_diagnosisyr, right_diagnosismo, right_cause, 
			left_status, left_onsetyr, left_onsetmo, left_diagnosisyr, left_diagnosismo, left_cause, 
			right_device, 
			right_hafityr, right_hafitmo, right_hamanufacturer, right_cifityr, right_cifitmo, right_cimanufacturer, right_electrodes, right_strategy, 
			left_device, 
			left_hafityr, left_hafitmo, left_hamanufacturer, left_cifityr, left_cifitmo, left_cimanufacturer, left_electrodes, left_strategy) 
			VALUES ('$userid', '$today', '$symmetry', 
			'$right_status', '$right_onsetyr', '$right_onsetmo', '$right_diagnosisyr', '$right_diagnosismo', '$right_cause', 
			'$left_status', '$left_onsetyr', '$left_onsetmo', '$left_diagnosisyr', '$left_diagnosismo', '$left_cause', 
			'$right_device', 
			'$right_hafityr', '$right_hafitmo', '$right_hamanufacturer', '$right_cifityr', '$right_cifitmo', '$right_cimanufacturer', '$right_electrodes', '$right_strategy', 
			'$left_device', 
			'$left_hafityr', '$left_hafitmo', '$left_hamanufacturer', '$left_cifityr', '$left_cifitmo', '$left_cimanufacturer', '$left_electrodes', '$left_strategy')";
			$result=mysql_query($sql);
			echo ("$sql");
			break;			
	case "savenewnotes":
			//get the posted values, all from pro
			$userid=htmlspecialchars($_POST['userid'],ENT_QUOTES);
			$logchart=htmlspecialchars($_POST['logchart'],ENT_QUOTES);
			$sql="INSERT INTO tbl_logchart (loguserid, logchart, lastupdate) VALUES ('$userid', '$logchart', '$today')";
			$result=mysql_query($sql);
			echo ("$sql");
			break;		
	case "createdemoaccounts":
			//get the posted values, all from pro
			$regby=htmlspecialchars($_POST['regby'],ENT_QUOTES);
			$fname=htmlspecialchars($_POST['fname'],ENT_QUOTES);
			$lname=htmlspecialchars($_POST['lname'],ENT_QUOTES);
			$demopassword="6e9bece1914809fb8493146417e722f6";  //this is hashed password for demo1234
			$demoemail="demo@teamhearing.org";
						
			//create one account for clinician/team leader
			$clinicianuname="clinician" . strtolower($fname);
			$clinicianfname=$fname;
			$clinicianlname=$lname;
			$sql="INSERT INTO `tbl_user` (username, firstname, lastname, password, role, email, phone, dob, gender, status, regby, regdate) VALUES('$clinicianuname', '$clinicianfname', '$clinicianlname', '$demopassword', 'team leader', '$demoemail', '111-111-1111', '1980-04-01', 'female', 'registered', '$regby', '$today')";
			$result=mysql_query($sql);
			
			//get userid of registered by person
			$sqluser="SELECT * FROM tbl_user WHERE username LIKE '$regby'";
			$resultuser=mysql_query($sqluser);
			$row=mysql_fetch_array($resultuser);
			$newregisteredby=$row['userid'];
			
			//get userid of new clinician/team leader
			$sqluser="SELECT * FROM tbl_user WHERE username LIKE '$clinicianuname'";
			$resultuser=mysql_query($sqluser);
			$row=mysql_fetch_array($resultuser);
			$newleaderid=$row['userid'];

			//automatically create a relationship with registered by as team leader of demo team leader account
			$sql="INSERT INTO tbl_relations VALUES ($newleaderid, $newregisteredby, 'team', '$today', '$today')";
			$result=mysql_query($sql);			
				
			//create five accounts for members
			$memberslist= array("Jack","Jenny","Jill","Joe","Judy");
			for ($i = 0; $i < 5; $i++) {
				$memberfname=$memberslist[$i];
				$memberlname=$lname;
				$memberuname="member" . strtolower($memberfname) . strtolower($memberlname);
				$memberdob="1980-01-01";  //all demo members are born in 1980
				$sqlmember="INSERT INTO `tbl_user` (username, firstname, lastname, password, role, email, phone, dob, gender, status, regby, regdate) VALUES('$memberuname', '$memberfname', '$memberlname', '$demopassword', 'client', '$demoemail', '111-111-1111', '$memberdob', 'female', 'registered', '$regby', '$today')";
				$resultmember=mysql_query($sqlmember);
				
				//get userid of new user
				$sqluser="SELECT * FROM tbl_user WHERE username LIKE '$memberuname' AND lastname LIKE '$memberlname'";
				$resultuser=mysql_query($sqluser);
				$row=mysql_fetch_array($resultuser);
				$newuserid=$row['userid'];

				//automatically create a relationship with registered by as team leader of demo member account
				$sqlrel="INSERT INTO tbl_relations VALUES ($newuserid, $newleaderid, 'team', '$today', '$today')";
				$resultrel=mysql_query($sqlrel);				

				//automatically create a relationship with dennis and Ray as mentor of demo member account
				//EXCLUDED FOR NOW
				//$sql="INSERT INTO tbl_relations VALUES ($newuserid, 2, 'mentor', '$today', '$today')";
				//$result=mysql_query($sql); //2 is userid for dennis
				//$sql="INSERT INTO tbl_relations VALUES ($newuserid, 22, 'mentor', '$today', '$today')";
				//$result=mysql_query($sql); //22 is userid for Ray
			}
			echo ("0"); //0 for successful
			break;
	case "updateprofile":
			//get the section being updated
			$section=htmlspecialchars($_POST['section'],ENT_QUOTES);
			//get the posted values, all from pro
			switch ($section)
			{
				case "Personal":
					$userid=htmlspecialchars($_POST['userid'],ENT_QUOTES);
					$firstname=htmlspecialchars($_POST['firstname'],ENT_QUOTES);
					$lastname=htmlspecialchars($_POST['lastname'],ENT_QUOTES);
					$email=htmlspecialchars($_POST['email'],ENT_QUOTES);
					$phone=htmlspecialchars($_POST['phone'],ENT_QUOTES);
					$gender=htmlspecialchars($_POST['gender'],ENT_QUOTES);
					$dob=htmlspecialchars($_POST['dob'],ENT_QUOTES);
					$sql="UPDATE tbl_user SET firstname='$firstname', lastname='$lastname', email='$email', phone='$phone', gender='$gender', dob='$dob' WHERE userid='$userid'";
					$result=mysql_query($sql);
					break;
				case "Access":
					$userid=htmlspecialchars($_POST['userid'],ENT_QUOTES);
					$role=htmlspecialchars($_POST['role'],ENT_QUOTES);
					$sql="UPDATE tbl_user SET role='$role' WHERE userid='$userid'";
					$result=mysql_query($sql);
					break;
				case "Education":
					$educationid=htmlspecialchars($_POST['educationid'],ENT_QUOTES);
					$userid=htmlspecialchars($_POST['userid'],ENT_QUOTES);
					$schoolsetting=htmlspecialchars($_POST['schoolsetting'],ENT_QUOTES);
					$classroomsetting=htmlspecialchars($_POST['classroomsetting'],ENT_QUOTES);
					$therapy=htmlspecialchars($_POST['therapy'],ENT_QUOTES);
					$hoursperweek=htmlspecialchars($_POST['hoursperweek'],ENT_QUOTES);
					$communicationmode=htmlspecialchars($_POST['communicationmode'],ENT_QUOTES);
					$edunotes=htmlspecialchars($_POST['edunotes'],ENT_QUOTES);
					if($educationid=="0")
					{
						$sql="INSERT INTO tbl_education (userid, schoolsetting, classroomsetting, therapy, hoursperweek, communicationmode, edunotes) VALUES ('$userid', '$schoolsetting', '$classroomsetting', '$therapy', '$hoursperweek', '$communicationmode', '$edunotes')";
					}
					else
					{
						$sql="UPDATE tbl_education SET schoolsetting='$schoolsetting', classroomsetting='$classroomsetting', therapy='$therapy', hoursperweek='$hoursperweek', communicationmode='$communicationmode', edunotes='$edunotes' WHERE educationid='$educationid'";
					}
					$result=mysql_query($sql);
					break;
				default:
					$sql="Error: invalid section";
			}
			echo ("$sql");
			break;
	case "updatemeasure":
			//get the section being updated
			$section=htmlspecialchars($_POST['section'],ENT_QUOTES);
			$measureuserid=htmlspecialchars($_POST['measureuserid'],ENT_QUOTES);			
			$measureid=htmlspecialchars($_POST['measureid'],ENT_QUOTES);
			$alpha1=htmlspecialchars($_POST['alpha1'],ENT_QUOTES);
			$numeric1=htmlspecialchars($_POST['numeric1'],ENT_QUOTES);
			$numeric2=htmlspecialchars($_POST['numeric2'],ENT_QUOTES);
			$numeric3=htmlspecialchars($_POST['numeric3'],ENT_QUOTES);
			$numeric4=htmlspecialchars($_POST['numeric4'],ENT_QUOTES);
			$numeric5=htmlspecialchars($_POST['numeric5'],ENT_QUOTES);
			$numeric6=htmlspecialchars($_POST['numeric6'],ENT_QUOTES);
			$numeric7=htmlspecialchars($_POST['numeric7'],ENT_QUOTES);
			$numeric8=htmlspecialchars($_POST['numeric8'],ENT_QUOTES);
			
			if ($measureid<0) //this is a new measure
			{
				$sql="INSERT INTO tbl_measures (measureuserid, measurename, alpha1, numeric1, numeric2, numeric3, numeric4, numeric5, numeric6, numeric7, numeric8, measuredate) VALUES ('$measureuserid', '$section', '$alpha1', '$numeric1', '$numeric2', '$numeric3', '$numeric4', '$numeric5', '$numeric6', '$numeric7', '$numeric8', '$today')";
			}
			else //update an existing measure
			{
				$sql="UPDATE tbl_measures SET alpha1='$alpha1', numeric1='$numeric1', numeric2='$numeric2', numeric3='$numeric3', numeric4='$numeric4', numeric5='$numeric5', numeric6='$numeric6', numeric7='$numeric7', numeric8='$numeric8' WHERE measureid='$measureid'";
			}
			$result=mysql_query($sql);
			echo ("$sql");
			break;
	case "deleteassignment":
			//get the posted values, all from pro
			$type=htmlspecialchars($_POST['type'],ENT_QUOTES);
			$id=htmlspecialchars($_POST['id'],ENT_QUOTES);
			$userid=htmlspecialchars($_POST['index'],ENT_QUOTES);
			switch($type)
			{
				case "1":  //delete single assignment
					$sql="UPDATE tbl_assignment SET assignstatus='deleted' WHERE assignmentid='$id'";
					$result=mysql_query($sql);
					break;
				case "2":  //delete protocol set
					$sql="UPDATE tbl_assignment SET assignstatus='deleted' WHERE protocolid='$id' AND assignedto='$userid' AND assignstatus='assigned'";
					$result=mysql_query($sql);
					break;
				case "3":  //delete all assignments by user
					$sql="UPDATE tbl_assignment SET assignstatus='deleted' WHERE assignedto='$id' AND assignstatus='assigned'";
					$result=mysql_query($sql);
					break;
			}
			echo ("$sql");
			break;
	case "saveassignment":
			//get the posted values, all from pro
			$assignmentid=htmlspecialchars($_POST['assignmentid'],ENT_QUOTES);
			$protocolset=htmlspecialchars($_POST['protocolset'],ENT_QUOTES);
			$protocolid=htmlspecialchars($_POST['protocolid'],ENT_QUOTES);
			$assignedto=htmlspecialchars($_POST['assignedto'],ENT_QUOTES);
			$assignedby=htmlspecialchars($_POST['assignedby'],ENT_QUOTES);
			$activitykey=htmlspecialchars($_POST['activitykey'],ENT_QUOTES);
			$testkey=htmlspecialchars($_POST['testkey'],ENT_QUOTES);
			$assignstatus="assigned";
			
			if ($assignmentid=="0")
			{
				if ($protocolset=="1")
				{
					//get the next protocol instance id
					$sql0="INSERT INTO tbl_protocolinstance (instancedate, instancestatus) VALUES ('$today', 'active')";
					$result0=mysql_query($sql0);
					$protocolinstance=mysql_insert_id();
					//get array of tests definitions in protocol set of the protocol id
					$sql1="SELECT * FROM tbl_protocoldef WHERE protocolid='$protocolid'";
					$result1=mysql_query($sql1);
					$numofrecords=mysql_num_rows($result1);
					for ($i=0;$i<$numofrecords;$i++) {
						$row=mysql_fetch_array($result1);
						$activitykey=$row['activitykey'];
						$testkey=$row['testkey'];
						$sql2="INSERT INTO tbl_assignment (protocolinstance, protocolid, assignedto, assignedby, activitykey, testkey, assigndate, assignstatus) VALUES ($protocolinstance, $protocolid, $assignedto, '$assignedby', '$activitykey', '$testkey', '$today', '$assignstatus')";
						$result2=mysql_query($sql2);		
					}
					echo($numofrecords);
				}
				else
				{
					//save the new assignment info
					$sql3="INSERT INTO tbl_assignment (protocolinstance, protocolid, assignedto, assignedby, activitykey, testkey, assigndate, assignstatus) VALUES ($protocolinstance, $protocolid, $assignedto, '$assignedby', '$activitykey', '$testkey', '$today', '$assignstatus')";
					$result3=mysql_query($sql3);
					echo($sql3);
				}
			}
			else
			{
				//mark the assignment as complete
				$sql="UPDATE tbl_assignment SET assignstatus='completed', completiondate='$today' WHERE assignmentid='$assignmentid'";
				$result=mysql_query($sql);
			}
			//echo ("$sql");
			break;
	default:
			echo "no action was requested";
}
mysql_close();

?>