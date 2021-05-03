<?php 

	define('DB_NAME', 'qOK07O7HjJ');
	define('DB_USER', 'qOK07O7HjJ');
	define('DB_PASSWORD', 'QLEyhT5DK8');
	define('DB_HOST', 'remotemysql.com');

	$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

	if($mysqli->connect_error){
		die("Connection Failed " . $mysqli->connect_error);
	}else{
		//echo "Connected."
	}

?>