import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-view-per',
  templateUrl: './view-per.page.html',
  styleUrls: ['./view-per.page.scss'],
})
export class ViewPerPage implements OnInit {

  userid: string;
  pe_id: number;

  lname: string = "";
  fname: string = "";
  mname: string = "";
  suffix: string = "";
  sex: string = "";
  family_serial_no: string = "";
  b_place: string = "";
  b_date: string = "";
  bloodtype: string = "";
  civil_stat: string = "";
  spouse_name: string = "";
  educ_attainment: string = "";
  employ_status: string = "";
  fam_position: string = "";
  patient_id: string = "";
  home_no: string = "";
  street: string = "";
  barangay: string = "";
  city: string = "";
  province: string = "";
  mothers_name: string = "";
  contact_no: string = "";
  dswdnhts: string = "";
  facility_no: string = "";
  added_by: string = "";
  status: string = "";
  archived_by = "";
  ph_member: string = "";
  ph_no: string = "";
  member_category: string = "";
  anggota: any;		

  constructor(
	  private postPvdr: PostProvider,
  	private router: Router,
    private actRoute: ActivatedRoute,
    private storage: Storage  
  ) 
  { }

  ionViewWillEnter(){
      this.storage.get('session_storage').then((res)=>{
        this.anggota = res;
          this.userid = this.anggota.userid;
      })
  }


  ngOnInit() {
  	this.actRoute.params.subscribe((data: any) => {
  		this.pe_id = data.pe_id;      
  		this.family_serial_no = data.family_serial_no;
  		this.lname = data.lname;
  		this.fname = data.fname;
  		this.mname = data.mname;
  		this.suffix = data.suffix;
  		this.sex = data.sex;
  		this.b_place = data.b_place;
  		this.b_date = data.b_date;
  		this.bloodtype = data.bloodtype;
  		this.civil_stat = data.civil_stat;
  		this.spouse_name = data.spouse_name;
  		this.educ_attainment = data.educ_attainment;
  		this.employ_status = data.employ_status;
  		this.fam_position = data.fam_position;
  		this.patient_id = data.patient_id;
  		this.home_no = data.home_no;
  		this.street = data.street;
  		this.barangay = data.barangay;
  		this.city = data.city;
  		this.province = data.province;
  		this.mothers_name = data.mothers_name;
  		this.contact_no = data.contact_no;
  		this.dswdnhts = data.dswdnhts;        
  		this.facility_no = data.facility_no;
  		this.ph_member = data.ph_member;
  		this.ph_no = data.ph_no;
  		this.member_category = data.member_category;
	  });  	
  }
    
  updatePerRec(pe_id, family_serial_no, lname, fname, mname, suffix, sex, b_place, b_date, bloodtype, civil_stat ,spouse_name, 
    educ_attainment, employ_status, fam_position, patient_id, home_no, street, barangay, city, province, mothers_name, contact_no, 
    dswdnhts, facility_no, ph_member, ph_no, member_category) {
    this.router.navigate(['/upd-per/' + pe_id + '/' + family_serial_no + '/' + lname + '/' + fname + '/' + mname + '/' + suffix + '/' + sex + '/' + b_place + '/' + b_date + '/' + bloodtype + '/' + civil_stat + '/' + spouse_name + '/' + educ_attainment + '/' + employ_status + '/' + fam_position + '/' + patient_id + '/' + home_no + '/' + street + '/' + barangay + '/' + city + '/' + province + '/' + mothers_name + '/' + contact_no + '/' + dswdnhts + '/' + facility_no + '/' + ph_member + '/' + ph_no + '/' + member_category]);
  }

}
