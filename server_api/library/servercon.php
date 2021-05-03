<?php 

	$userver = '192.168.1.1';
	$username = 'meme';
	$password ='1';
	$con = mysqli_connect($userver,$username,$password, 'mchoims_database');
	if (mysqli_connect_error())
	{
	  $message =  "Connection Failure";
	  echo "<script type='text/javascript'>alert('$message');</script>";
	  die('Connection Error('.mysqli_connect_errno().')' .mysqli_connect_error());

?>