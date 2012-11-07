<!DOCTYPE html>
<!--
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
     KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
-->
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" />
        <link rel="stylesheet" type="text/css" href="css/index.css" />
		<style type="text/css">

		#mainbody {
			background: url(images/pro/probackground.jpg);
			-webkit-background-size: cover;
			-moz-background-size: cover;
			-o-background-size: cover;
			background-size: cover;
			font-family: adobe, sans-serif;
			font-weight: bold;
			color: white;
		}
		.bglandscape {
			background-size: 100% 180%;
		}
		.bgportrait {
			background-size: 100% 320%;
		}
		#logintable {
			position:absolute;
			height:50%;
			width:80%;
			left:10%;
			top:25%;
		}
		#title {
			position:absolute;
			height:10%;
			width:80%;
			left:4%;
			top:2%;
		}
		#subtitle {
			position:absolute;
			height:10%;
			width:80%;
			left:4%;
			top:12%;
		}
		#tagline {
			position:absolute;
			height:10%;
			width:80%;
			left:4%;
			top:80%;
		}
		</style>		
        <title></title>
    </head>
    <body id='mainbody'>
            <h1>Team Hearing</h1>
            <h2>Mobile Resources for Hearing Health Care v1.04</h2>
			
			<?php echo("note: this is the php starting page..<br /><br />"); ?>
			<!-- Login Form -->
			<form action="#" method="post">
				<label>
				<span style="margin-top:15px;font-size:24px;">Username</span><br />
				<input style="margin-top:15px;font-size:24px;" type="edit" value="" size="23" />
				</label>
				<br />
				<label>
				<span style="margin-top:15px;font-size:24px;">Password</span><br />
				<input style="margin-top:15px;font-size:24px;" type="password" size="23" />
				</label>
				<br />
				<span style="margin-top:15px;font-size:24px;"> </span><br />
				<input style="margin-top:15px;font-size:24px;" type="submit" value="Login"/>
				<input type='hidden' id='version' value='professional'>
			</form>

			<div class="app">
            <div id="deviceready">
                <p class="status pending blink">Connecting to Device</p>
                <p class="status complete blink hide">Device is Ready</p>
            </div>
        </div>
        <script type="text/javascript" src="cordova-2.0.0.js"></script>
        <script type="text/javascript" src="js/index.js"></script>
        <script type="text/javascript">
            app.initialize();
        </script>
    </body>
</html>
