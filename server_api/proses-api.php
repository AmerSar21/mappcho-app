<?php 

	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Credentials: true");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
	header("Content-Type: application/json; charset=utf-8");

	include "library/config.php";

	$postjson = json_decode(file_get_contents('php://input'),true);
	$today = date('Y-m-d');

	//login query 
	if($postjson['action'] == 'login'){
		// $password = md5($postjson['password']);
		$sql = mysqli_query($mysqli, "SELECT us.userid as userid, us.uname as uname, us.upass as upass, us.usertype as usertype, us.status as status, CONCAT(per.fname, ' ', per.lname) as fullname, per.bdate as bdate, per.gender as gender, per.email as email, per.address as address FROM useraccount us inner join person per on per.personid = us.personid where uname = '$postjson[username]' and upass ='$postjson[password]'");
		$check = mysqli_num_rows($sql);

		if($check>0){
			$data = mysqli_fetch_array($sql);
			$datauser = array(
				'userid' => $data['userid'],
				'uname' => $data['uname'],
				'upass' => $data['upass'],
				'usertype' => $data['usertype'],
				'fullname' => $data['fullname'],
				'bdate' => $data['bdate'],				
				'gender' => $data['gender'],
				'email' => $data['email'],
				'address' => $data['address']								
			);

			if($data['status'] == 'Active'){
				$result = json_encode(array('success' => true, 'result' => $datauser));				
			}else if($data['status'] == 'Inactive'){
				$result = json_encode(array('success' => false, 'msg' => 'Account Inactive'));	
			}

		}else{
			$result = json_encode(array('success' => false, 'msg' => 'Account doesnt Exist'));					
		}
		echo $result;

	}else if($postjson['action'] == 'getFullName'){
		$sql = mysqli_query($mysqli, "SELECT CONCAT(per.fname, ' ', per.lname) as fullname FROM useraccount us inner join person per on per.personid = us.personid where us.userid = '$postjson[userid]'");
		$count = mysqli_num_rows($sql);

		 if($count>0){
		 	$row = mysqli_fetch_array($sql);
		 	$fullname = $row['fullname'];
		 	$result = json_encode(array('success' => true, 'fullname' => $fullname));
		 }else{
			$result = json_encode(array('success' => false, 'msg' => '0'));								 	
		 }

		echo $result;
	}else if($postjson['action'] == 'getNewUser'){
		
		$sql = mysqli_query($mysqli, "SELECT count(*) as accno FROM useraccount WHERE status='Pending'");
		$count = mysqli_num_rows($sql);

		 if($count>0){
		 	$row = mysqli_fetch_array($sql);
		 	$number = $row['accno'];
		 	$result = json_encode(array('success' => true, 'number' => $number));
		 }else{
			$result = json_encode(array('success' => false, 'msg' => '0'));								 	
		 }

		echo $result;

	}else if($postjson['action'] == 'checkPatId'){
		
		$sql = mysqli_query($mysqli, "SELECT * from patient_enrollment where patient_id = '$postjson[patid]'");
		$check = mysqli_num_rows($sql);

		if($check>0){
			
			$sqlgetName = mysqli_query($mysqli, "SELECT concat(n.lname, ', ', n.fname, ' ', n.mname) as fullname
			from (patient_enrollment pe inner join name n on n.n_id = pe.n_id) where pe. patient_id = '$postjson[patid]'");
			$row = mysqli_fetch_array($sqlgetName);
			$fullname = $row['fullname'];

			$result = json_encode(array('success' => true, 'msg' => $fullname));

		}else{
			$result = json_encode(array('success' => false, 'msg' => 'Patient doesnt exist. Please enrol first'));							
		}
		echo $result;

	}else if($postjson['action'] == 'getPatInfo') {

		$sql = mysqli_query($mysqli, "SELECT * from patient_enrollment where patient_id = '$postjson[patid]'");
		$check = mysqli_num_rows($sql);

		if($check>0){
			
			$sqlgetName = mysqli_query($mysqli, "SELECT concat(n.lname, ', ', n.fname, ' ', n.mname) as fullname, pe.family_serial_no as family_serial_no
			from (patient_enrollment pe inner join name n on n.n_id = pe.n_id) where pe. patient_id = '$postjson[patid]'");

			$data = mysqli_fetch_array($sqlgetName);
			$datauser = array(
				'fname' => $data['fullname'],
				'fcode' => $data['family_serial_no']
			);
			$fullname = $data['fullname'];

			$result = json_encode(array('success' => true, 'result' => $datauser, 'msg' => $fullname));

		}else{
			$result = json_encode(array('success' => false, 'msg' => 'Patient doesnt exist. Please enrol first'));							
		}
		echo $result;

	}else if($postjson['action'] == 'getAcc') {
		
		$data = array();

		$sql = mysqli_query($mysqli, "SELECT us.userid, us.uname, us.upass, us.usertype, us.status, per.fname, per.lname, per.bdate, per.gender, per.email, per.address FROM useraccount us inner join person per on per.personid = us.personid ORDER BY us.userid ASC");

		while ($row = mysqli_fetch_array($sql)) {
			$data[] = array(
				'accid' => $row['userid'],
				'uname' => $row['uname'],
				'upass' => $row['upass'],
				'usertype' => $row['usertype'],
				'status' => $row['status'],
				'fname' => $row['fname'],
				'lname' => $row['lname'],	
				'bdate' => $row['bdate'],
				'gender' => $row['gender'],
				'email' => $row['email'],
				'address' => $row['address']			
			);
		}

		if ($sql){
			$result = json_encode(array('success'=>true, 'result' => $data));
		}else{
			$result = json_encode(array('success'=>false, 'msg' => 'Record Failed to Load'));	
		} 
		
		echo $result;		

	}else if($postjson['action'] == 'delAcc') {
		
		$sqlcheckPer = mysqli_query($mysqli, "SELECT * from useraccount where userid = '$postjson[accid]'");
		$row = mysqli_fetch_array($sqlcheckPer);
		$personid = $row['personid'];

		$sqldelUser = mysqli_query($mysqli, "DELETE from useraccount where userid = '$postjson[accid]'");

		$sqldelAcc = mysqli_query($mysqli, "DELETE from person where personid = '$personid'");

		if(($sqldelAcc) && ($sqldelUser)){
			$result = json_encode(array('success' => true, 'msg' => "Account Succesfully Deleted"));
		}else{
			$result = json_encode(array('success' => true, 'msg' => "Account Failed to Delete"));
		}	

		echo $result;			

	}else if($postjson['action'] == 'checkAcc'){


		$sql = mysqli_query($mysqli, "SELECT * from useraccount where uname = '$postjson[uname]'");
		$check = mysqli_num_rows($sql);

		if($check>0){

			$result = json_encode(array('success' => true, 'msg' => 'username exist'));

		}else{
			$result = json_encode(array('success' => false, 'msg' => 'username not exist'));							
		}

		echo $result;

	}else if($postjson['action'] == 'addAcc') {

		if(($postjson['uname'] == '') || ($postjson['upass'] == '') || ($postjson['usertype'] == '') || ($postjson['fname'] == '') || ($postjson['lname'] == '') || ($postjson['address'] == '') || ($postjson['bdate'] == '') || ($postjson['gender'] == '') || ($postjson['email'] == '') || ($postjson['contnum'] == ''))
		{

			$result = json_encode(array('success' => false, 'msg' => 'Please Complete the fields above'));			
		}else{

			$sql = mysqli_query($mysqli, "SELECT * from useraccount where uname = '$postjson[uname]'");
			$check = mysqli_num_rows($sql);

			if($check>0){

				$result = json_encode(array('success' => false, 'msg' => 'Username already exist'));

			}else{

				$sqlper = mysqli_query($mysqli, "INSERT INTO person SET 
					fname = '$postjson[fname]',
					lname = '$postjson[lname]',
					bdate = '$postjson[bdate]',
					gender = '$postjson[gender]',
					email = '$postjson[email]',
					contact_no = '$postjson[contnum]',
					address = '$postjson[address]'");

				$personid = mysqli_insert_id($mysqli);
				
				if(!$sqlper){
					$result = json_encode(array('success' => false, 'msg' => 'Account Failed to Add'));
				}else {
					
					$sql = mysqli_query($mysqli, "SELECT CONCAT(p.fname, ' ', p.lname) as fullname from useraccount us inner join person p on p.personid = us.personid where us.userid = '$postjson[uid]'");
					$data = mysqli_fetch_array($sql);
					$fullname = $data['fullname'];				

					$sqlacc = mysqli_query($mysqli, "INSERT INTO useraccount SET 
						uname = '$postjson[uname]',
						upass = '$postjson[upass]',
						usertype = '$postjson[usertype]',
						personid = '$personid',
						added_by = '$fullname',
						status = 'Active',
						archived_by = 'none'");

					$userid = mysqli_insert_id($mysqli);

					if(!$sqlacc){

						$result = json_encode(array('success' => false, 'msg' => 'Account Failed to Add'));
					}else{

						$result = json_encode(array('success'=>true, 'userid' => $userid));					
					}
				}
				
			}

		}
		echo $result;
	}else if($postjson['action'] == 'regAcc') {

		if(($postjson['uname'] == '') || ($postjson['upass'] == '') || ($postjson['fname'] == '') || ($postjson['lname'] == '') || ($postjson['bdate'] == '') || ($postjson['gender'] == '') || ($postjson['email'] == '') ||($postjson['contnum'] == ''))
		{
			$result = json_encode(array('success' => false, 'msg' => 'Please Complete the fields above'));	
		}else{

			$contnum = "+639" + $postjson['contnum'];
			$sqlper = mysqli_query($mysqli, "INSERT INTO person SET 
				fname = '$postjson[fname]',
				lname = '$postjson[lname]',
				bdate = '$postjson[bdate]',
				gender = '$postjson[gender]',
				email = '$postjson[email]',
				contact_no = '$contnum',
				address = '$postjson[address]'");

			$personid = mysqli_insert_id($mysqli);
			
			if(!$sqlper){
				$result = json_encode(array('success' => false, 'msg' => 'Account Failed to Add'));
			}else {

				$sqlacc = mysqli_query($mysqli, "INSERT INTO useraccount SET 
					uname = '$postjson[uname]',
					upass = '$postjson[upass]',
					usertype = 'User',
					personid = '$personid',
					added_by = 'none',
					status = 'Active',
					archived_by = 'none'");

				$userid = mysqli_insert_id($mysqli);

				if(!$sqlacc){
					$result = json_encode(array('success' => false, 'msg' => 'Account Failed to Add'));
				}else{
					$result = json_encode(array('success'=>true, 'userid' => $userid));					
				}
			}
		}
		echo $result;
	}else if($postjson['action'] == 'updateAcc'){

		$sqlgetPer = mysqli_query($mysqli, "SELECT personid FROM useraccount WHERE userid = '$postjson[accid]'");
		$data = mysqli_fetch_array($sqlgetPer);
		$personid = $data['personid'];

		if($postjson['status'] == 'Inactive'){

			$sqlgetUser = mysqli_query($mysqli, "SELECT CONCAT(p.fname, ' ', p.lname) as fullname from useraccount us inner join person p on p.personid = us.personid where us.userid = '$postjson[uid]'");
			$data = mysqli_fetch_array($sqlgetUser);
			$fullname = $data['fullname'];

			$sqlUpdateUser = mysqli_query($mysqli, "UPDATE useraccount SET
				uname = '$postjson[uname]',
				upass = '$postjson[upass]',
				usertype = '$postjson[usertype]',
				added_by = 'none',
				status = '$postjson[status]',
				archived_by = '$fullname' WHERE userid = '$postjson[accid]'");

			$sqlUpdatePerson = mysqli_query($mysqli, "UPDATE person SET
				fname = '$postjson[fname]',
				lname = '$postjson[lname]',
				bdate = '$postjson[bdate]',
				gender = '$postjson[gender]',
				email = '$postjson[email]', 
				address = '$postjson[address]' WHERE personid = '$personid'");				

		}else{

			$sqlUpdateUser = mysqli_query($mysqli, "UPDATE useraccount SET
				uname = '$postjson[uname]',
				upass = '$postjson[upass]',
				usertype = '$postjson[usertype]',
				status = '$postjson[status]' WHERE userid = '$postjson[accid]'");

			$sqlUpdatePerson = mysqli_query($mysqli, "UPDATE person SET
				fname = '$postjson[fname]',
				lname = '$postjson[lname]',
				bdate = '$postjson[bdate]',
				gender = '$postjson[gender]',
				email = '$postjson[email]',
				address = '$postjson[address]' WHERE personid = '$personid'");			

		}

		if(($sqlUpdateUser) && ($sqlUpdatePerson)){
			$result = json_encode(array('success'=>true, 'msg'=> 'Successfully Updated'));
		}else{
			$result = json_encode(array('success' => false, 'msg' => 'Failed to Update'));
		}

		echo $result;	
	
	}else if($postjson['action'] == 'getAct'){

		$data = array();

		$sql = mysqli_query($mysqli, "SELECT * FROM activity WHERE added_by = '$postjson[added_by]' ORDER BY act_id ASC");

		while ($row = mysqli_fetch_array($sql)) {
			$data[] = array(
				'act_id' => $row['act_id'],
				'name' => $row['name'],
				'description' => $row['description'],
				'actdate' => $row['actdate'],
				'status' => $row['status']
			);
		}

		if ($sql){
			$result = json_encode(array('success'=>true, 'result'=>$data));
		}else{
			$result = json_encode(array('success'=>false, 'msg' => 'Record Failed to Load'));	
		} 

		echo $result;

	}else if($postjson['action'] == 'getActAll'){

		$data = array();

		$sql = mysqli_query($mysqli, "SELECT * FROM activity WHERE status = 'Active' ORDER BY act_id ASC");

		while ($row = mysqli_fetch_array($sql)) {
			$data[] = array(
				'act_id' => $row['act_id'],
				'name' => $row['name'],
				'description' => $row['description'],
				'actdate' => $row['actdate'],
				'status' => $row['status']
			);
		}

		if ($sql){
			$result = json_encode(array('success'=>true, 'result'=>$data));
		}else{
			$result = json_encode(array('success'=>false, 'msg' => 'Record Failed to Load'));	
		} 

		echo $result;

	}else if($postjson['action'] == 'addAct'){
		
		if(($postjson['name'] == '') || ($postjson['actdate'] == '') || ($postjson['description'] == '')){

			$result = json_encode(array('success' => false, 'msg' => 'Please Complete the fields above'));

		}else {

			$sqlact = mysqli_query($mysqli, "INSERT INTO activity SET 
				name = '$postjson[name]',
				actdate = '$postjson[actdate]',
				description = '$postjson[description]',
				status = 'active',
				added_by = '$postjson[fullname]'");

			$act_id = mysqli_insert_id($mysqli);

			if(!$sqlact){

				$result = json_encode(array('success' => false, 'msg' => 'Event Failed to Add'));

			}else{

				$result = json_encode(array('success'=>true, 'actid' => $act_id));	

			}

		}

		echo $result;

	}else if($postjson['action'] == 'checkDate'){

		if($postjson['actdate'] == ''){
			$result = json_encode(array('success' => false, 'msg' => 'Input Date to Verify'));			
		}else{

			$sql = mysqli_query($mysqli, "SELECT * from activity where actdate = '$postjson[actdate]'");
			$check = mysqli_num_rows($sql);

			if($check>0){

				$result = json_encode(array('success' => true, 'msg' => 'Event Date Unavailable'));

			}else{
				$result = json_encode(array('success' => false, 'msg' => 'Event Date Available'));							
			}

		}

		echo $result;
		
	}else if($postjson['action'] == 'delAct'){
		
		$sqldelact = mysqli_query($mysqli, "DELETE from activity where act_id = '$postjson[act_id]'");

		if($sqldelact){
			$result = json_encode(array('success'=>true, 'msg'=> 'Successfully Deleted'));	
		}else{
			$result = json_encode(array('success' => false, 'msg' => 'Failed to Delete'));
		}

		echo $result;

	}else if($postjson['action'] == 'updateAct'){
		
		$sql = mysqli_query($mysqli, "UPDATE activity SET
			name = '$postjson[name]',
			description = '$postjson[description]',
			actdate = '$postjson[actdate]',
			status = '$postjson[status]' where act_id = '$postjson[act_id]'");

		if($sql){
			$result = json_encode(array('success'=>true, 'msg'=> 'Successfully Updated'));	
		}else{
			$result = json_encode(array('success' => false, 'msg' => 'Failed to Update'));
		}

		echo $result;
		
	}else if($postjson['action'] == 'addPer'){

		if(($postjson['lname'] == '') || ($postjson['fname'] == '') || ($postjson['mname'] == '') || ($postjson['suffix'] == '') || ($postjson['gender'] == '') || ($postjson['bplace'] == '') || ($postjson['bdate'] == '') || ($postjson['bltype'] == '') || ($postjson['cstat'] == '') || ($postjson['spname'] == '') || ($postjson['motname'] == '') || ($postjson['fampos'] == '') || ($postjson['homeno'] == '') || ($postjson['brgy'] == '') || ($postjson['street'] == '') || ($postjson['city'] == '') || ($postjson['prov'] == '') || ($postjson['contnum'] == '') || ($postjson['edatt'] == '') || ($postjson['empstat'] == '') || ($postjson['fhno'] == '') || ($postjson['nhts'] == '') || ($postjson['fcode'] == '') || ($postjson['pat_id'] == '')) {

			$result = json_encode(array('success' => false, 'msg' => 'Please fill out all details accurately'));
		}else if(($postjson['lname'] == '') && ($postjson['fname'] == '') && ($postjson['mname'] == '') && ($postjson['suffix'] == '') && ($postjson['gender'] == '') && ($postjson['bplace'] == '') && ($postjson['bdate'] == '') && ($postjson['bltype'] == '') && ($postjson['cstat'] == '') && ($postjson['spname'] == '') && ($postjson['motname'] == '') && ($postjson['fampos'] == '') && ($postjson['homeno'] == '') && ($postjson['brgy'] == '') && ($postjson['street'] == '') && ($postjson['city'] == '') && ($postjson['prov'] == '') && ($postjson['contnum'] == '') && ($postjson['edatt'] == '') && ($postjson['empstat'] == '') && ($postjson['fhno'] == '') && ($postjson['nhts'] == '') && ($postjson['fcode'] == '') && ($postjson['pat_id'] == '')){

			$result = json_encode(array('success' => false, 'msg' => 'Complete Empty fields'));

		}else{

			$sqlnameinfo = mysqli_query($mysqli, "INSERT INTO name SET
			lname = '$postjson[lname]',
			fname = '$postjson[fname]',
			mname = '$postjson[mname]',
			suffix = '$postjson[suffix]'");

			$n_id = mysqli_insert_id($mysqli);

			$sqloi = mysqli_query($mysqli, "INSERT INTO other_info SET
				sex = '$postjson[gender]',
				b_date = '$postjson[bdate]',
				b_place = '$postjson[bplace]',
				bloodtype = '$postjson[bltype]',
				civil_stat = '$postjson[cstat]'");

			$oi_id = mysqli_insert_id($mysqli);

			$sqlrinfo = mysqli_query($mysqli, "INSERT INTO related_info SET
				spouse_name = '$postjson[spname]',
				mothers_name = '$postjson[motname]',
				fam_position = '$postjson[fampos]'");

			$ri_id = mysqli_insert_id($mysqli);

			$sqlcninfo = mysqli_query($mysqli, "INSERT INTO contact_info SET
				home_no = '$postjson[homeno]',
				barangay = '$postjson[brgy]',
				street = '$postjson[street]',
				city = '$postjson[city]',
				province = '$postjson[prov]',
				contact_no = '$postjson[contnum]'");

			$ci_id = mysqli_insert_id($mysqli);

			$sqledemp = mysqli_query($mysqli, "INSERT INTO educ_employ SET
				educ_attainment = '$postjson[edatt]',
				employ_status = '$postjson[empstat]'");

			$ee_id = mysqli_insert_id($mysqli);

			if($postjson['phmem'] == 'No'){
				$sqlphinfo = mysqli_query($mysqli, "INSERT INTO phil_info SET
				ph_member = '$postjson[phmem]',
				ph_no = '0',
				member_category = 'none',
				facility_no = '$postjson[fhno]',
				dswdnhts = '$postjson[nhts]'");

				$pi_id = mysqli_insert_id($mysqli);
			}else{			
				$sqlphinfo = mysqli_query($mysqli, "INSERT INTO phil_info SET
				ph_member = '$postjson[phmem]',
				ph_no = '$postjson[phnum]',
				member_category = '$postjson[ctgry]',
				facility_no = '$postjson[fhno]',
				dswdnhts = '$postjson[nhts]'");

				$pi_id = mysqli_insert_id($mysqli);
			}

			$sql = mysqli_query($mysqli, "SELECT CONCAT(p.fname, ' ', p.lname) as fullname from useraccount us inner join person p on p.personid = us.personid where us.userid = '$postjson[uid]'");
			$data = mysqli_fetch_array($sql);
			$fullname = $data['fullname'];

			$sqlper = mysqli_query($mysqli, "INSERT INTO patient_enrollment SET
				family_serial_no = '$postjson[fcode]',
				n_id = '$n_id',
				oi_id = '$oi_id',
				ri_id = '$ri_id',
				ci_id = '$ci_id',
				ee_id = '$ee_id',
				pi_id = '$pi_id',
				added_by = '$fullname',
				status = 'active',
				archived_by = 'none',
				patient_id = '$postjson[pat_id]'"); 

			$pe_id = mysqli_insert_id($mysqli);

			if((!$sqlnameinfo) && (!$sqloi) && (!$sqlrinfo) && (!$sqlcninfo) && (!$sqledemp) && (!$sqlphinfo) && (!$sqlper)) {
				$result = json_encode(array('success' => false, 'msg' => 'Record Failed to Add'));
			}else{
				$result = json_encode(array('success'=>true, 'pe_id' => $pe_id));	
			}

		}

		echo $result; 				

	}else if($postjson['action'] == 'getPer'){

		$data = array();

		$sql = mysqli_query($mysqli, "SELECT pe.pe_id, n.lname, n.fname, n.mname, n.suffix, oi.sex, oi.b_date,
		 	oi.b_place, oi.bloodtype, oi.civil_stat, ri.spouse_name, ri.mothers_name, ri.fam_position,
		 	ci.home_no, ci.barangay, ci.street, ci.city, ci.province, ci.contact_no,
			ee.educ_attainment, ee.employ_status, pi.ph_member, pi.ph_no, pi.member_category, pi.facility_no, pi.dswdnhts, 
			pe.family_serial_no, pe.added_by, pe.status, pe.archived_by, pe.patient_id
			from ((((((patient_enrollment pe inner join name n on n.n_id = pe.n_id)
        	inner join other_info oi on oi.oi_id = pe.oi_id)
	        inner join related_info ri on ri.ri_id = pe.ri_id)
	       	inner join contact_info ci on ci.ci_id = pe.ci_id)
	      	inner join educ_employ ee on ee.ee_id = pe.ee_id)
	      	inner join phil_info pi on pi.pi_id = pe.pi_id) where pe.status = 'active' AND pe.added_by LIKE '$postjson[added_by]' ORDER BY pe.pe_id ASC");

		while ($row = mysqli_fetch_array($sql)) {
			$data[] = array(
				'family_serial_no' => $row['family_serial_no'],	
				'lname' => $row['lname'],
				'fname' => $row['fname'],
				'mname' => $row['mname'],
				'suffix' => $row['suffix'],
				'sex' => $row['sex'],
				'b_place' => $row['b_place'],				
				'b_date' => $row['b_date'],
				'bloodtype' => $row['bloodtype'],		
				'civil_stat' => $row['civil_stat'],			
				'spouse_name' => $row['spouse_name'],
				'educ_attainment' => $row['educ_attainment'],
				'employ_status' => $row['employ_status'],
				'fam_position' => $row['fam_position'],
				'patient_id' => $row['patient_id'],
				'home_no' => $row['home_no'],
				'barangay' => $row['barangay'],
				'street' => $row['street'],
				'city' => $row['city'],
				'province' => $row['province'],
				'mothers_name' => $row['mothers_name'],				
				'contact_no' => $row['contact_no'],
				'dswdnhts' => $row['dswdnhts'],
				'facility_no' => $row['facility_no'],
				'ph_member' => $row['ph_member'],
				'ph_no' => $row['ph_no'],						
				'member_category' => $row['member_category'],
				'pe_id' => $row['pe_id'],
				'added_by' => $row['added_by'],
				'status' => $row['status'],			
				'archived_by' => $row['archived_by']
			);
		}

		if ($sql){
			$result = json_encode(array('success'=>true, 'result'=>$data));
		}else{
			$result = json_encode(array('success'=>false, 'msg' => 'Record Failed to Load'));	
		} 
		echo $result;

	}else if($postjson['action'] == 'insertPer') {
		
		$data = $postjson['perArray'];
		$currentDate = $postjson['cDate'];

		if(!empty($data)){

			foreach ($data as $item) {
				$sqltemp_per = mysqli_query($mysqli, "INSERT INTO temp_per(family_serial_no,lname,fname,mname,sex,b_date,b_place,bloodtype,civil_stat,spouse_name,mothers_name,fam_position,home_no,barangay,street,city,province,contact_no,educ_attainment,employ_status,ph_member,ph_no,member_category,facility_no,dswdnhts,suffix,added_by,submitted_by,patient_id,date_submitted) VALUES ('".$item['family_serial_no']."','".$item['lname']."','".$item['fname']."','".$item['mname']."','".$item['sex']."','".$item['b_date']."','".$item['b_place']."','".$item['bloodtype']."','".$item['civil_stat']."','".$item['spouse_name']."','".$item['mothers_name']."','".$item['fam_position']."','".$item['home_no']."','".$item['barangay']."','".$item['street']."','".$item['city']."','".$item['province']."','".$item['contact_no']."','".$item['educ_attainment']."','".$item['employ_status']."','".$item['ph_member']."','".$item['ph_no']."','".$item['member_category']."','".$item['facility_no']."','".$item['dswdnhts']."','".$item['suffix']."','userMobile','".$item['added_by']."','".$item['patient_id']."','$currentDate')");
			}
		}

		if(!$sqltemp_per){
			$result = json_encode(array('success'=>false, 'msg' => 'Record Failed to Transfer'));
		}else{
			$result = json_encode(array('success'=>true, 'result'=>$data));
		}

		echo $result;

	}else if($postjson['action'] == 'getTempPer'){
		$data = array();
		$sqlgetTemp = mysqli_query($mysqli, "SELECT family_serial_no,lname,fname,mname,suffix,sex,b_date,b_place,bloodtype,civil_stat,spouse_name,mothers_name,fam_position,home_no,barangay,street,city,province,contact_no,educ_attainment,employ_status,ph_member,ph_no,member_category,facility_no,dswdnhts,added_by,patient_id,submitted_by,date_submitted from temp_per where submitted_by LIKE '$postjson[added_by]'");

		while ($row = mysqli_fetch_array($sqlgetTemp)) {
			$data[] = array(
				'family_serial_no' => $row['family_serial_no'],	
				'lname' => $row['lname'],
				'fname' => $row['fname'],
				'mname' => $row['mname'],
				'sex' => $row['sex'],
				'b_date' => $row['b_date'],
				'b_place' => $row['b_place'],				
				'bloodtype' => $row['bloodtype'],		
				'civil_stat' => $row['civil_stat'],			
				'spouse_name' => $row['spouse_name'],
				'mothers_name' => $row['mothers_name'],				
				'fam_position' => $row['fam_position'],
				'home_no' => $row['home_no'],
				'street' => $row['street'],
				'barangay' => $row['barangay'],
				'city' => $row['city'],
				'province' => $row['province'],
				'contact_no' => $row['contact_no'],
				'educ_attainment' => $row['educ_attainment'],
				'employ_status' => $row['employ_status'],
				'ph_member' => $row['ph_member'],
				'ph_no' => $row['ph_no'],						
				'member_category' => $row['member_category'],
				'facility_no' => $row['facility_no'],
				'dswdnhts' => $row['dswdnhts'],
				'suffix' => $row['suffix'],
				'added_by' => $row['added_by'],
				'submitted_by' => $row['submitted_by'],			
				'patient_id' => $row['patient_id'],
				'date_submitted' => $row['date_submitted']
			);
		}

		if ($sqlgetTemp){
			$result = json_encode(array('success'=>true, 'result'=>$data));
		}else{
			$result = json_encode(array('success'=>false, 'msg' => 'Record Failed to Load'));	
		} 
		echo $result;
	}else if($postjson['action'] == 'updatePer') {
		
		$sqlgetPer = mysqli_query($mysqli, "SELECT * from patient_enrollment where pe_id = '$postjson[pe_id]'");
		$row = mysqli_fetch_array($sqlgetPer);
		$n_id = $row['n_id'];
	    $oi_id = $row['oi_id'];
	    $ri_id = $row['ri_id'];
	    $ci_id = $row['ci_id'];
	    $ee_id = $row['ee_id'];
	    $pi_id = $row['pi_id'];

	    $sqlupdPe = mysqli_query($mysqli, "UPDATE patient_enrollment SET family_serial_no = '$postjson[family_serial_no]', patient_id = '$postjson[patient_id]' where pe_id = '$postjson[pe_id]'");

	    $sqlupdName = mysqli_query($mysqli, "UPDATE name SET lname = '$postjson[lname]', fname = '$postjson[fname]', mname = '$postjson[mname]', suffix = '$postjson[suffix]' where n_id = '$n_id'");

	    $sqlupdOi = mysqli_query($mysqli, "UPDATE other_info SET sex = '$postjson[sex]', b_date = '$postjson[b_date]', b_place = '$postjson[b_place]', bloodtype = '$postjson[bloodtype]', civil_stat = '$postjson[civil_stat]' where oi_id = '$oi_id'");

	    $sqlupdRi = mysqli_query($mysqli, "UPDATE related_info SET spouse_name = '$postjson[spouse_name]', mothers_name = '$postjson[mothers_name]', fam_position = '$postjson[fam_position]' where ri_id = '$ri_id'");

	    $sqlupdCon = mysqli_query($mysqli, "UPDATE contact_info SET home_no = '$postjson[home_no]', street = '$postjson[street]', barangay = '$postjson[barangay]', city = '$postjson[city]', province = '$postjson[province]', contact_no = '$postjson[contact_no]' where ci_id = '$ci_id'");

	    $sqlupdEe = mysqli_query($mysqli, "UPDATE educ_employ SET educ_attainment = '$postjson[educ_attainment]', employ_status = '$postjson[employ_status]' where ee_id = '$ee_id'");

	    if($postjson['ph_member'] == 'No'){

		    $sqlupdPi = mysqli_query($mysqli, "UPDATE phil_info SET ph_member = '$postjson[ph_member]', ph_no = '0', member_category = 'none', facility_no = '$postjson[facility_no]', dswdnhts = '$postjson[dswdnhts]' where pi_id = '$pi_id'");
	    }else{

		    $sqlupdPi = mysqli_query($mysqli, "UPDATE phil_info SET ph_member = '$postjson[ph_member]', ph_no = '$postjson[ph_no]', member_category = '$postjson[member_category]', facility_no = '$postjson[facility_no]', dswdnhts = '$postjson[dswdnhts]' where pi_id = '$pi_id'");	    	
	    }

    	if(($sqlupdPe) && ($sqlupdName) && ($sqlupdOi) && ($sqlupdRi) && ($sqlupdCon) && ($sqlupdEe) && ($sqlupdPi)){
			$result = json_encode(array('success'=>true, 'msg'=> 'Record Successfully Updated'));	
		}else{
			$result = json_encode(array('success' => false, 'msg' => 'Record Failed to Update'));
		}

		echo $result;

	}else if($postjson['action'] == 'delAllTempPer'){

		$sqldeltempPER = mysqli_query($mysqli,"DELETE FROM temp_per where submitted_by = '$postjson[submitted_by]'");

	    if($sqldeltempPER){
			$result = json_encode(array('success'=>true, 'msg'=> 'Record Successfully Deleted'));	
		}else{
			$result = json_encode(array('success' => false, 'msg' => 'Record Failed to Delete'));
		}

		echo $result;


	}else if($postjson['action'] == 'delPerRec'){

		$sqlgetPer = mysqli_query($mysqli, "SELECT * from patient_enrollment where pe_id = '$postjson[pe_id]'");
		$row = mysqli_fetch_array($sqlgetPer);
		$n_id = $row['n_id'];
	    $oi_id = $row['oi_id'];
	    $ri_id = $row['ri_id'];
	    $ci_id = $row['ci_id'];
	    $ee_id = $row['ee_id'];
	    $pi_id = $row['pi_id'];

	    $sqlcntItr = mysqli_query($mysqli, "SELECT count(*) as cntCheck from indiv_treat_rec where pe_id = '$postjson[pe_id]'");
	    $row = mysqli_fetch_array($sqlcntItr);
	    $cntCheck = $row['cntCheck'];

	    if($cntCheck > 0){

			$result = json_encode(array('success' => false, 'msg' => 'Cannot Delete data.. (Referenced)'));
		
	    }else{
		
		    $sqldelPe = mysqli_query($mysqli, "DELETE from patient_enrollment where pe_id = '$postjson[pe_id]'");

		    $sqldelName = mysqli_query($mysqli, "DELETE from name where n_id = '$n_id'");

		    $sqldelOi = mysqli_query($mysqli, "DELETE from other_info where oi_id = '$oi_id'");

		    $sqldelRi = mysqli_query($mysqli, "DELETE from related_info where ri_id = '$ri_id'");

		    $sqldelCon = mysqli_query($mysqli, "DELETE from contact_info where ci_id = '$ci_id'");

		    $sqldelEe = mysqli_query($mysqli, "DELETE from educ_employ where ee_id = '$ee_id'");

		    $sqldelPi = mysqli_query($mysqli, "DELETE from phil_info where pi_id = '$pi_id'");

		    if(($sqldelPe) && ($sqldelName) && ($sqldelOi) && ($sqldelRi) && ($sqldelCon) && ($sqldelEe) && ($sqldelPi)){
				$result = json_encode(array('success'=>true, 'msg'=> 'Record Successfully Deleted'));	
			}else{
				$result = json_encode(array('success' => false, 'msg' => 'Record Failed to Delete'));
			}
	    }

		echo $result;

	}else if($postjson['action'] == 'addItr'){

		$date = date('Y-m-d');
		$time = time();

		$sql = mysqli_query($mysqli, "SELECT CONCAT(p.fname, ' ', p.lname) as fullname from useraccount us inner join person p on p.personid = us.personid where us.userid = '$postjson[uid]'");
		$data = mysqli_fetch_array($sql);
		$fullname = $data['fullname'];

		$sqlgetPe = mysqli_query($mysqli, "SELECT pe_id,family_serial_no as fcode from patient_enrollment where patient_id = '$postjson[patid]'");
		$row = mysqli_fetch_array($sqlgetPe);
		$peid = $row['pe_id'];
		$fcode = $row['fcode'];		

		if(($postjson['modeoftrans'] == '') || ($postjson['bloodp'] == '') || ($postjson['height'] == '') || ($postjson['temp'] == '') || ($postjson['weight'] == '') || ($postjson['attofficer'] == '') || ($postjson['age'] == '') || ($postjson['natofvis'] == '') || ($postjson['compl'] == '') || ($postjson['consdate'] == '') || ($postjson['constime'] == '') || ($postjson['diagnosis'] == '') || ($postjson['medtreat'] == '') || ($postjson['labtest'] == '') || ($postjson['hcprov'] == '') || ($postjson['labfindings'] == '') || ($postjson['patid'] == '')) {

			$result = json_encode(array('success' => false, 'msg' => 'Please fill out all details accurately'));

		}else if(($postjson['modeoftrans'] == '') && ($postjson['bloodp'] == '') && ($postjson['height'] == '') && ($postjson['temp'] == '') && ($postjson['weight'] == '') && ($postjson['attofficer'] == '') && ($postjson['age'] == '') && ($postjson['natofvis'] == '') && ($postjson['compl'] == '') && ($postjson['consdate'] == '') && ($postjson['constime'] == '') && ($postjson['diagnosis'] == '') && ($postjson['medtreat'] == '') && ($postjson['labtest'] == '') && ($postjson['hcprov'] == '') && ($postjson['labfindings'] == '') && ($postjson['patid'] == '')){

			$result = json_encode(array('success' => false, 'msg' => 'Complete Empty fields'));

		}else{

			$sqlfcr = mysqli_query($mysqli, "INSERT INTO for_chu_rhu SET 
				mode_transaction = '$postjson[modeoftrans]',
				date_consultation = '$postjson[consdate]', 
				time_consultation = '$postjson[constime]', 
				blood_pressure = '$postjson[bloodp]', 
				height = '$postjson[height]', 
				temperature = '$postjson[temp]', 
				weight = '$postjson[weight]', 
				name_of_attending = '$postjson[attofficer]', 
				age = '$postjson[age]'");

			$fcrid = mysqli_insert_id($mysqli);
			
			$sqltreatment = mysqli_query($mysqli, "INSERT INTO treatment SET 
				nature_of_visit = '$postjson[natofvis]', 
				chief_complaints = '$postjson[compl]', 
				diagnosis = '$postjson[diagnosis]', 
				medication = '$postjson[medtreat]', 
				lab_findings = '$postjson[labtest]', 
				name_health_careprovider = '$postjson[hcprov]', 
				performed_lab_test = '$postjson[labfindings]'");

			$treatmentid = mysqli_insert_id($mysqli);

			if($postjson['modeoftrans'] == 'Referral'){

				$sqlrefferal = mysqli_query($mysqli, "INSERT INTO referral_transaction SET 
					referred_from = '$postjson[reffrom]', 
					referred_to = '$postjson[refto]', 
					reason_of_referral = '$postjson[reason]', 
					referred_by = '$postjson[reasby]'");

				$refid = mysqli_insert_id($mysqli);

			}else{

				$sqlrefferal = mysqli_query($mysqli, "INSERT INTO referral_transaction SET 
					referred_from = 'none', 
					referred_to = 'none', 
					reason_of_referral = 'none', 
					referred_by = 'none'");

				$refid = mysqli_insert_id($mysqli);

	 		}

			$sqlitr = mysqli_query($mysqli, "INSERT INTO indiv_treat_rec SET 
				fcr_id = '$fcrid', 
				treatment_id = '$treatmentid', 
				ref_tran_id = '$refid', 
				pe_id = '$peid', 
				added_by = '$fullname', 
				status = 'active', 
				archived_by = 'none'");

			$itrid = mysqli_insert_id($mysqli);

			if((!$sqlfcr) && (!$sqltreatment) && (!$sqlrefferal) && (!$sqlitr)){
				$result = json_encode(array('success' => false, 'msg' => 'Record Failed to Add'));
			}else{
				$result = json_encode(array('success' => true, 'itrid' => $itrid));	
			}
		}
				
		echo $result; 			

	}else if($postjson['action'] == 'getItr'){

		$data = array();

		$sqlgetItr = mysqli_query($mysqli, "SELECT indiv_treat_rec.itr_id, patient_enrollment.pe_id, CONCAT(name.lname, ', ' ,name.fname, ' ', name.mname) as fullname, CONCAT(contact_info.home_no, ' ', contact_info.barangay, ' ', contact_info.street,' ', contact_info.city) as address, patient_enrollment.family_serial_no, for_chu_rhu.age, for_chu_rhu.mode_transaction, for_chu_rhu.blood_pressure, for_chu_rhu.height, for_chu_rhu.weight, for_chu_rhu.date_consultation, for_chu_rhu.time_consultation, for_chu_rhu.temperature, for_chu_rhu.name_of_attending, treatment.nature_of_visit, treatment.chief_complaints, treatment.diagnosis, treatment.medication, treatment.lab_findings, treatment.name_health_careprovider, treatment.performed_lab_test, referral_transaction.referred_from, referral_transaction.referred_to, referral_transaction.reason_of_referral, referral_transaction.referred_by, indiv_treat_rec.added_by, patient_enrollment.patient_id from ((((((indiv_treat_rec inner join patient_enrollment on patient_enrollment.pe_id = indiv_treat_rec.pe_id) 
			inner join name on name.n_id = patient_enrollment.n_id) 
			inner join contact_info on contact_info.ci_id = patient_enrollment.ci_id) 
			inner join referral_transaction on referral_transaction.ref_tran_id = indiv_treat_rec.ref_tran_id)
			inner join for_chu_rhu on for_chu_rhu.fcr_id = indiv_treat_rec.fcr_id) 
			inner join treatment on treatment.treatment_id = indiv_treat_rec.treatment_id) where indiv_treat_rec.status='active' AND indiv_treat_rec.added_by LIKE '$postjson[added_by]' ORDER BY indiv_treat_rec.itr_id ASC");

		while ($row = mysqli_fetch_array($sqlgetItr)) {
			$data[] = array(
				'itr_id' => $row['itr_id'],
				'fullname' => $row['fullname'],
				'address' => $row['address'],
				'family_serial_no' => $row['family_serial_no'],				
				'age' => $row['age'],
				'mode_transaction' => $row['mode_transaction'],
				'blood_pressure' => $row['blood_pressure'],
				'height' => $row['height'],
				'temperature' => $row['temperature'],
				'weight' => $row['weight'],
				'date_consultation' => $row['date_consultation'],
				'time_consultation' => $row['time_consultation'],
				'name_of_attending' => $row['name_of_attending'],
				'nature_of_visit' => $row['nature_of_visit'],
				'referred_from' => $row['referred_from'],
				'referred_to' => $row['referred_to'],
				'reason_of_referral' => $row['reason_of_referral'],
				'referred_by' => $row['referred_by'],
				'name_health_careprovider' => $row['name_health_careprovider'],
				'chief_complaints' => $row['chief_complaints'],
				'diagnosis' => $row['diagnosis'],
				'performed_lab_test' => $row['performed_lab_test'],
				'medication' => $row['medication'],
				'lab_findings' => $row['lab_findings'],
				'added_by' => $row['added_by'],
				'patient_id' => $row['patient_id']
			);
		}

		if ($sqlgetItr){
			$result = json_encode(array('success'=>true, 'result'=>$data));
		}else{
			$result = json_encode(array('success'=>false, 'msg' => 'Record Failed to Load'));	
		} 
		echo $result;

	}else if($postjson['action'] == 'getTempItr'){

		$data = array();
		$sqlgetTemp = mysqli_query($mysqli, "SELECT family_serial_no,age,mode_transaction,date_consultation,time_consultation,blood_pressure,temperature,height,weight,name_of_attending,nature_of_visit,chief_complaints,diagnosis,medication,lab_findings,name_health_careprovider,performed_lab_test,chronic_disease,referred_from,referred_to,reason_of_referral,referred_by,added_by,submitted_by,patient_id,date_submitted from temp_itr where submitted_by LIKE '$postjson[added_by]'");

		while ($row = mysqli_fetch_array($sqlgetTemp)) {
			$data[] = array(
				'family_serial_no' => $row['family_serial_no'],
				'age' => $row['age'],
				'mode_transaction' => $row['mode_transaction'],
				'date_consultation' => $row['date_consultation'],
				'time_consultation' => $row['time_consultation'],
				'blood_pressure' => $row['blood_pressure'],
				'temperature' => $row['temperature'],
				'height' => $row['height'],
				'weight' => $row['weight'],
				'name_of_attending' => $row['name_of_attending'],
				'nature_of_visit' => $row['nature_of_visit'],
				'chief_complaints' => $row['chief_complaints'],
				'diagnosis' => $row['diagnosis'],
				'medication' => $row['medication'],
				'lab_findings' => $row['lab_findings'],
				'name_health_careprovider' => $row['name_health_careprovider'],
				'performed_lab_test' => $row['performed_lab_test'],
				'chronic_disease' => $row['chronic_disease'],
				'referred_from' => $row['referred_from'],
				'referred_to' => $row['referred_to'],
				'reason_of_referral' => $row['reason_of_referral'],
				'referred_by' => $row['referred_by'],
				'added_by' => $row['added_by'],
				'submitted_by' => $row['submitted_by'],
				'patient_id' => $row['patient_id'],
				'date_submitted' => $row['date_submitted']
			);
		}

		if ($sqlgetTemp){
			$result = json_encode(array('success'=>true, 'result'=>$data));
		}else{
			$result = json_encode(array('success'=>false, 'msg' => 'Record Failed to Load'));	
		} 
		echo $result;
	}else if($postjson['action'] == 'updateItr') {
		
		$sqlgetItr = mysqli_query($mysqli, "SELECT * from indiv_treat_rec where itr_id = '$postjson[itr_id]'");
		$row = mysqli_fetch_array($sqlgetItr);
		$fcr_id = $row['fcr_id'];
		$treatment_id = $row['treatment_id'];
		$ref_tran_id = $row['ref_tran_id'];

		$sqlupdfcr = mysqli_query($mysqli, "UPDATE for_chu_rhu SET mode_transaction = '$postjson[mode_transaction]', date_consultation = '$postjson[date_consultation]', time_consultation = '$postjson[time_consultation]', blood_pressure = '$postjson[blood_pressure]', temperature = '$postjson[temperature]', height = '$postjson[height]', weight = '$postjson[weight]', name_of_attending = '$postjson[name_of_attending]', age = '$postjson[age]' where fcr_id = '$fcr_id' ");

		if($postjson['mode_transaction'] == 'Referral'){

			$sqlupdrti = mysqli_query($mysqli, "UPDATE referral_transaction SET referred_from = '$postjson[referred_from]', referred_to = '$postjson[referred_to]', reason_of_referral = '$postjson[reason_of_referral]', referred_by = '$postjson[referred_by]' where ref_tran_id = '$ref_tran_id'");

		}else {
			
			$sqlupdrti = mysqli_query($mysqli, "UPDATE referral_transaction SET referred_from = 'none', referred_to = 'none', reason_of_referral = 'none', referred_by = 'none' where ref_tran_id = '$ref_tran_id'");			

		}

		$sqlupdTr = mysqli_query($mysqli, "UPDATE treatment SET nature_of_visit = '$postjson[nature_of_visit]', chief_complaints = '$postjson[chief_complaints]', diagnosis = '$postjson[diagnosis]', medication = '$postjson[medication]', lab_findings = '$postjson[lab_findings]', name_health_careprovider = '$postjson[name_health_careprovider]', performed_lab_test = '$postjson[performed_lab_test]' where treatment_id = '$treatment_id'");

		if(($sqlupdfcr) && ($sqlupdrti) && ($sqlupdTr)){
			$result = json_encode(array('success'=>true, 'msg'=> 'Record Successfully Updated'));	
		}else{
			$result = json_encode(array('success' => false, 'msg' => 'Record Failed to Update'));
		}

		echo $result;

	}else if($postjson['action'] == 'delItrRec'){

		$sqlcnt = mysqli_query($mysqli, "SELECT count(*) as cntCheck from indiv_treat_rec where itr_id = '$postjson[itr_id]'");
		$row = mysqli_fetch_array($sqlcnt);
		$cntCheck = $row['cntCheck'];

		if($cntCheck > 0){
			$sqlgetItr = mysqli_query($mysqli, "SELECT * from indiv_treat_rec where itr_id = '$postjson[itr_id]'");
			$row = mysqli_fetch_array($sqlgetItr);
			$fcr_id = $row['fcr_id'];
			$treatment_id = $row['treatment_id'];
			$ref_tran_id = $row['ref_tran_id'];

			$sqldelItr = mysqli_query($mysqli, "DELETE from indiv_treat_rec where itr_id = '$postjson[itr_id]'");

			$sqldelfcr = mysqli_query($mysqli, "DELETE from for_chu_rhu where fcr_id = '$fcr_id'");

			$sqldelrti = mysqli_query($mysqli, "DELETE from referral_transaction where ref_tran_id = '$ref_tran_id'");

			$sqldelTr = mysqli_query($mysqli, "DELETE from treatment where treatment_id = '$treatment_id'");

			if(($sqldelItr) && ($sqldelfcr) && ($sqldelrti) && ($sqldelTr)){
				$result = json_encode(array('success'=>true, 'msg'=> 'Record Successfully Deleted'));	
			}else{
				$result = json_encode(array('success' => false, 'msg' => 'Record Failed to Delete'));
			}	
		}else{
			$result = json_encode(array('success' => false, 'msg' => 'Record does not exist.'));
		}
		
		echo $result;

	}else if($postjson['action'] == 'delAllTempItr') {
		
		$sqldeltempITR = mysqli_query($mysqli, "DELETE FROM temp_itr where submitted_by = '$postjson[submitted_by]'");

		if($sqldeltempITR){
			$result = json_encode(array('success'=>true, 'msg'=> 'Record Successfully Deleted'));	
		}else{
			$result = json_encode(array('success' => false, 'msg' => 'Record Failed to Delete'));
		}

		echo $result;

	}else if($postjson['action'] == 'insertItr'){

		$data = $postjson['itrArray'];
		$currentDate = $postjson['cDate'];

		if(!empty($data)){

			foreach ($data as $item) {
				$sqltemp_itr = mysqli_query($mysqli, "INSERT INTO temp_itr(family_serial_no,age,mode_transaction,date_consultation,time_consultation,blood_pressure,temperature,height,weight,name_of_attending,nature_of_visit,chief_complaints,diagnosis,medication,lab_findings,name_health_careprovider,performed_lab_test,chronic_disease,referred_from,referred_to,reason_of_referral,referred_by,added_by,submitted_by,patient_id,date_submitted) VALUES ('".$item['family_serial_no']."','".$item['age']."','".$item['mode_transaction']."','".$item['date_consultation']."','".$item['time_consultation']."','".$item['blood_pressure']."','".$item['temperature']."','".$item['height']."','".$item['weight']."','".$item['name_of_attending']."','".$item['nature_of_visit']."','".$item['chief_complaints']."','".$item['diagnosis']."','".$item['medication']."','".$item['lab_findings']."','".$item['name_health_careprovider']."','".$item['performed_lab_test']."','none','".$item['referred_from']."','".$item['referred_to']."','".$item['reason_of_referral']."','".$item['referred_by']."','userMobile','".$item['added_by']."','".$item['patient_id']."','$currentDate')");
			}
		}

		if(!$sqltemp_itr){
			$result = json_encode(array('success'=>false, 'msg' => 'Record Failed to Transfer'));
		}else{
			$result = json_encode(array('success'=>true, 'result'=>$data));
		}

		echo $result;

	}
?>