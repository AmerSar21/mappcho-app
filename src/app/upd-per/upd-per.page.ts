import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { format } from 'date-fns';
import { ApiWatcherService } from '../api-watcher.service';

@Component({
  selector: 'app-upd-per',
  templateUrl: './upd-per.page.html',
  styleUrls: ['./upd-per.page.scss'],
})
export class UpdPerPage implements OnInit {

  userid: string;
  pe_id: number;

  uid: string = "";
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
    public toastCtrl: ToastController,
    private storage: Storage,
    private apiwatcher: ApiWatcherService 
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

  updatePer() {
    this.apiwatcher.loadingPres2(); 
    return new Promise(resolve => {
      try{
        let body = {
          action : 'updatePer',
          pe_id: this.pe_id,
          family_serial_no: this.family_serial_no,
          lname: this.lname,
          fname: this.fname,
          mname: this.mname,
          suffix: this.suffix,
          sex: this.sex,
          b_place: this.b_place,
          b_date: this.b_date = format(new Date(this.b_date), "yyyy-MM-dd"),
          bloodtype: this.bloodtype,
          civil_stat: this.civil_stat,
          spouse_name: this.spouse_name,
          educ_attainment: this.educ_attainment,
          employ_status: this.employ_status,
          fam_position: this.fam_position,
          patient_id: this.patient_id,
          home_no: this.home_no,
          street: this.street,
          barangay: this.barangay,
          city: this.city,
          province: this.province,
          mothers_name: this.mothers_name,
          contact_no: this.contact_no,
          dswdnhts: this.dswdnhts,
          facility_no: this.facility_no,
          ph_member: this.ph_member,
          ph_no: this.ph_no,
          member_category: this.member_category
        };
        console.log('Input Body: ', body);
        this.postPvdr.postData(body, 'proses-api.php').subscribe(async data => {
          var alertmsg = data.msg;
          if(data.success){
            this.apiwatcher.loadingDismiss();
            this.router.navigate(['/patientrecords']);
            const toast = await this.toastCtrl.create({
              message: alertmsg,
              duration: 2000
            }); 
            toast.present();                  
          }else{
            this.apiwatcher.loadingDismiss();
            const toast = await this.toastCtrl.create({
              message: alertmsg,
              duration: 2000
            }); 
            toast.present();                  
          }
          console.log('OK');
        },async err => {
            this.apiwatcher.loadingDismiss();
            const toast = await this.toastCtrl.create({
              message: 'Server timed out.',
              duration: 2000
            });
            toast.present();
        });
      }catch(e){
        this.apiwatcher.loadingDismiss();
        console.log('Error Message: ',e);
      }
    });
  }

}
