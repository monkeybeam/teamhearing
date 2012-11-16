<?php 
//JSON Code

//Connect to database from here
$link = mysql_connect('teamaudiologydev.db.8271327.hostedresource.com', 'teamaudiologydev', 'mango11A'); 
if (!$link) {
    die('Could not connect: ' . mysql_error());
}
//select the database
mysql_select_db('teamaudiologydev'); 

$requested = $_POST['requested'];
$reportuser = $_POST['user'];
$activityid = $reportuser;  //only for SHS: the reportuser variable holds the activityid

if ($requested=="CustomSettings")
	$sql="SELECT * FROM tbl_usercustom";
if ($requested=="Relations")
	//$sql="SELECT * FROM tbl_relations LEFT JOIN tbl_user ON tbl_relations.relationid=tbl_user.userid";
	$sql="SELECT a.userid AS useridrelation, a.relationid, a.relationtype, b.* FROM tbl_relations a LEFT JOIN tbl_user b ON a.relationid=b.userid";
if ($requested=="MembersAll")
	$sql="SELECT * FROM tbl_user a WHERE a.status!='exclude'";
if ($requested=="MembersOnly")
	$sql="SELECT a.*, b.relationid, b.relationtype, c.username AS accessor FROM tbl_user a, tbl_relations b, tbl_user c WHERE a.status!='exclude' AND a.userid=b.userid AND b.relationid=c.userid AND c.username='$reportuser' AND (b.relationtype='team' || b.relationtype='mentor') ORDER BY a.firstname ASC";  
	// $sql="SELECT a.*, b.relationid, b.relationtype, c.username AS accessor FROM tbl_user a, tbl_relations b, tbl_user c WHERE a.userid=b.userid AND b.relationid=c.userid AND c.username='$reportuser' AND b.relationtype='team' ORDER BY relationtype, username ASC";  
	//$sql="SELECT a.*, b.relationid, b.relationtype, c.username AS accessor, d.* FROM tbl_user a, tbl_relations b, tbl_user c, tbl_hearinginfo d  WHERE a.userid=b.userid AND b.relationid=c.userid AND c.username='dennis' AND b.relationtype='team' AND c.userid=d.userid ORDER BY relationtype, username ASC";

if ($requested=="SHSmaterials")
	//$sql="SELECT * FROM tbl_shs WHERE activityid='3' AND settype <> '' ORDER BY RAND() LIMIT 10";
{	//get records (one from each set)
	$questiontype=0; //0 for word alone, 1 for simple sentence, 2 for complex sentence
	$itemlimit=0;
	switch ($activityid)
	{
		case 3: //Vowels
			$questiontype=2; // 0=word alone, 1=simple sentence, 2=complex sentence
			$itemlimit = 40;
			$sql="SELECT * FROM tbl_shs WHERE activityid='".$activityid."' AND settype <> '' ORDER BY RAND() LIMIT $itemlimit";
			break;
		case 4: //Consonants
			$questiontype=1; // 0=word alone, 1=simple sentence, 2=complex sentence
			$itemlimit = 40;
			$sql="SELECT * FROM tbl_shs WHERE activityid='".$activityid."' AND settype <> '' ORDER BY RAND() LIMIT $itemlimit";
			break;			
		case 5: //Word Stress
			$questiontype=0; // 0=complex sentence
			$itemlimit = 12;
			$sql="SELECT * FROM tbl_shs WHERE activityid='".$activityid."' AND settype <> '' ORDER BY RAND() LIMIT $itemlimit";
			break;			
		case 6: //Intonation
			$questiontype=1; // 1=complex sentence
			//select some materials from the randomly selected group of the Intonation set type
			$itemlimit = 12;
			$sql="SELECT * FROM tbl_shs WHERE activityid='".$activityid."' AND settype <> '' ORDER BY RAND() LIMIT $itemlimit";
			break;				
		case 7: //Word Stress and Intonation
			$questiontype=0; // 0=complex sentence
			$itemlimit = 12;
			$sql="SELECT * FROM tbl_shs WHERE activityid='".$activityid."' AND settype <> '' ORDER BY RAND() LIMIT $itemlimit";
			break;			
		case 8: //Syllable Stress
			$questiontype=2; // 2=word only
			$itemlimit = 12;
			$sql="SELECT * FROM tbl_shs WHERE activityid='".$activityid."' AND settype <> '' ORDER BY RAND() LIMIT $itemlimit";
			break;			
		case 9: //Numbers
			//randomly select a group from the Numbers set type
			$questiontype=1; //always simple sentence
			//$sqlgroupname = "SELECT DISTINCT setgroupname FROM tbl_shs WHERE activityid='".$activityid."' AND setgroupname <> '' ORDER BY RAND() LIMIT 1";
			$sqlgroupname = "SELECT DISTINCT setgroupname FROM tbl_shs WHERE setgroupname <> 'His birthday is' AND activityid='".$activityid."' AND setgroupname <> '' ORDER BY RAND() LIMIT 1";
			$resultgroupname = mysql_query($sqlgroupname);
			$rowgroupname=mysql_fetch_array($resultgroupname);
			$randomgroupchosen=$rowgroupname['setgroupname'];
			//select some materials from the randomly selected group of the Numbers set type
			$itemlimit = 6;
			$sql="SELECT * FROM tbl_shs WHERE activityid='".$activityid."' AND settype ='Numbers' AND setgroupname='$randomgroupchosen' ORDER BY RAND() LIMIT $itemlimit";
			break;		
		case 10: //People Names
			//randomly select a group from the People Names set type
			$questiontype=2; // 0=name only,1=simple sentence,2=spelling
			$sqlgroupname = "SELECT DISTINCT setgroupname FROM tbl_shs WHERE activityid='".$activityid."' AND setgroupname <> '' ORDER BY RAND() LIMIT 1";
			$resultgroupname = mysql_query($sqlgroupname);
			$rowgroupname=mysql_fetch_array($resultgroupname);
			$randomgroupchosen=$rowgroupname['setgroupname'];
			//select some materials from the randomly selected group of the People names set type
			$itemlimit = 12;
			$sql="SELECT * FROM tbl_shs WHERE activityid='".$activityid."' AND settype <> '' AND setgroupname='$randomgroupchosen' ORDER BY RAND() LIMIT $itemlimit";
			break;			
		case 11: //Geographical Words
			$questiontype=0; //1=have you been to..., 2=question without keyword
			$itemlimit = 12;
			$sql="SELECT * FROM tbl_shs WHERE activityid='".$activityid."' AND settype <> '' ORDER BY RAND() LIMIT $itemlimit";
			break;			
		case 12: //Everyday Communication
			$questiontype=0; // 0:question
			$itemlimit = 12;
			$sql="SELECT * FROM tbl_shs WHERE activityid='".$activityid."' AND settype <> '' ORDER BY RAND() LIMIT $itemlimit";
			break;			
		case 13: //Comparisons
			//randomly select a group from the Comparisons set type
			$questiontype=2; // 0=word alone, 1=simple sentence, 2=complex sentence
			$sqlgroupname = "SELECT DISTINCT setgroupname FROM tbl_shs WHERE activityid='".$activityid."' AND setgroupname <> '' ORDER BY RAND() LIMIT 1";
			$resultgroupname = mysql_query($sqlgroupname);
			$rowgroupname=mysql_fetch_array($resultgroupname);
			$randomgroupchosen=$rowgroupname['setgroupname'];
			//select some materials from the randomly selected group of the Comparisons set type
			$itemlimit = 12;
			$sql="SELECT * FROM tbl_shs WHERE activityid='".$activityid."' AND settype <> '' AND setgroupname='$randomgroupchosen' ORDER BY RAND() LIMIT $itemlimit";
			break;			
		case 14: //Expansions
			//randomly select a group from the Expansions set type
			$questiontype=1; // 1=always sentence
			$sqlgroupname = "SELECT DISTINCT setgroupname FROM tbl_shs WHERE activityid='".$activityid."' AND setgroupname <> '' ORDER BY RAND() LIMIT 1";
			$resultgroupname = mysql_query($sqlgroupname);
			$rowgroupname=mysql_fetch_array($resultgroupname);
			$randomgroupchosen=$rowgroupname['setgroupname'];
			//select some materials from the randomly selected group of the Expansions set type
			$itemlimit = 12;
			$sql="SELECT * FROM tbl_shs WHERE activityid='".$activityid."' AND setgroupname='$randomgroupchosen' ORDER BY RAND() LIMIT $itemlimit";
			break;		
		default:
			echo("No materials are available for the activity.  ");
	}	
}		
	
if ($requested=="BELmaterials")
	$sql="SELECT * FROM tbl_bel ORDER BY RAND() LIMIT 100";  	
if ($requested=="Activities")
	$sql="SELECT * FROM tbl_activity WHERE hidden='false'";  //IMPORTANT: Remove WHERE CLAUSE to show all activities
if ($requested=="ActivityShellOnly")
	$sql="SELECT * FROM tbl_activity WHERE modulescriptname='helps'";  
if ($requested=="Messages")
	$sql="SELECT * FROM tbl_messages WHERE messageto='$reportuser' OR messagefrom='$reportuser' ORDER BY messagedate ASC";
if ($requested=="Files")
	$sql="SELECT * FROM tbl_uploads LEFT JOIN tbl_user ON tbl_user.userid=tbl_uploads.userid";
if ($requested=="Results")
	$sql="SELECT * FROM tbl_result LEFT JOIN tbl_login ON tbl_result.loginid=tbl_login.loginid ORDER BY tbl_result.completion DESC";
if ($requested=="ResultsMine")
	$sql="SELECT * FROM tbl_result LEFT JOIN tbl_login ON tbl_result.loginid=tbl_login.loginid WHERE tbl_result.username='$reportuser' ORDER BY tbl_result.completion DESC";
if ($requested=="Assignments")
	$sql="SELECT * FROM tbl_assignment LEFT JOIN tbl_user ON tbl_user.userid=tbl_assignment.assignedto";
if ($requested=="AssignmentsMine")
	$sql="SELECT * FROM tbl_assignment a, tbl_user b, tbl_protocols c WHERE a.assignstatus='assigned' AND b.username='$reportuser' AND b.userid=a.assignedto AND a.protocolid=c.protocolid ORDER BY a.assigndate ASC";
if ($requested=="Protocols")
	$sql="SELECT * FROM tbl_protocoldef LEFT JOIN tbl_protocols ON tbl_protocoldef.protocolid=tbl_protocols.protocolid WHERE tbl_protocols.protocolstatus='active' ORDER BY tbl_protocols.displayorder ASC";
if ($requested=="HistoryMine")
	$sql="SELECT * FROM tbl_hearinginfo a WHERE a.username='$reportuser' ORDER BY a.hearingdate DESC";

//Run the Query	
$result = mysql_query($sql);
$items = mysql_num_rows($result);
$foilrows= array();

if ($items > 0)
{
	$success='y';
}
else
{
	if ($requested=="AssignmentsMine")
		{$success='y';}
	else
		{$success='n';}
}

if ($requested=="SHSmaterials")
{
	//Use SHS result set of materials to get 2 foils for each item
	for ($i=0;$i<$items;$i++)
	{
		$row=mysql_fetch_array($result);
		$uncleanmaterialname=$row['wordalone'];
		$materialname=str_replace("'", "$$$", $uncleanmaterialname);
		$materialid=$row['id'];
		$settype=$row['settype'];
		$uncleansetgroupname=$row['setgroupname'];
		$setgroupname=str_replace("'", "''", $uncleansetgroupname);  //specific for SQL statement use
		$videoid=$row['video'];
		$videosimpleid=$row['videosimple'];
		$videocomplexid=$row['videocomplex'];
		$nodechildtype=$row['childtype'];
		//get 2 foil words from the same set
		$sqlfoil = "SELECT * FROM tbl_shs WHERE activityid='".$activityid."' AND setgroupname='".$setgroupname."' AND id <> '$materialid' ORDER BY RAND() LIMIT 2"; 
		$resultfoil=mysql_query($sqlfoil);
		$rowfoil=mysql_fetch_array($resultfoil);
		$uncleanfoil1=$rowfoil['wordalone'];
		$foil1=str_replace("'", "$$$", $uncleanfoil1);
		$rowfoil=mysql_fetch_array($resultfoil);
		$uncleanfoil2=$rowfoil['wordalone'];
		$foil2=str_replace("'", "$$$", $uncleanfoil2);
		//$foilrows[$i][0]=$materialid;
		$foilrows[$i][foil1]=$foil1;
		$foilrows[$i][foil2]=$foil2;
	}	
	//return resultset to first position pointer
	mysql_data_seek($result, 0);
}

if($success=='y')
{
	$msg_status = 'Data for $requested retrieved.  ';
	$allrows = array(); //container for original results set
	while($r = mysql_fetch_assoc($result)) {
		$allrows[] = $r;
	}
	//add foils to allrows array if request is for SHS materials
	$allrowswithfoil = array();
	if ($requested=="SHSmaterials")
	{
		for ($j=0;$j<$items;$j++)
		{
			$allrowswithfoil[$j]=$allrows[$j]+$foilrows[$j];
		}
		print json_encode($allrowswithfoil);	
	}
	else
	{
		//convert array to json
		print json_encode($allrows);	
	}
}
else
{
	$msg_status = 'Error in retrieving $requested data.  ';
	print json_encode(array('success' => $success, 'carecategoryview' => $carecategoryview, 'msg_status' => $msg_status)); 
}
?>