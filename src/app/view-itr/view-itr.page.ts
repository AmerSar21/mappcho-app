import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-view-itr',
  templateUrl: './view-itr.page.html',
  styleUrls: ['./view-itr.page.scss'],
})
export class ViewItrPage implements OnInit {

  userid: string;	
  anggota: any;	

  itr_id: number;
  uid: string = "";
  patid: string = "";
  age: string = "";
  mode_transaction: string;
  blood_pressure: string = "";
  height: string = "";
  temperature: string = "";
  weight: string = "";
  date_consultation: string = "";
  time_consultation: string = "";
  name_of_attending: string = "";
  nature_of_visit: string = "";
  referred_from: string;
  referred_to: string = "";
  reason_of_referral: string = "";
  referred_by: string = "";
  name_health_careprovider: string = "";
  chief_complaints: string = "";
  performed_lab_test: string = "";
  medication: string = "";
  diagnosis: string = "";
  lab_findings: string = "";
  added_by: string = "";
  status: string = "";
  archived_by: string = "";  

  fullname: string = "";
  address: string = "";
  family_serial_no: string = "";

  constructor(
  	private postPvdr: PostProvider,
  	private router: Router,
    private actRoute: ActivatedRoute,
    private storage: Storage
  ) { }


  ionViewWillEnter(){
  		this.storage.get('session_storage').then((res)=>{
  			this.anggota = res;
        	this.userid = this.anggota.userid;
  		})
  }

  ngOnInit() {
  	this.actRoute.params.subscribe((data: any) => {
      this.itr_id = data.itr_id;
  		this.fullname = data.fullname;
		  this.address = data.address;
		  this.family_serial_no = data.family_serial_no;
  		this.age = data.age;
  		this.mode_transaction = data.mode_transaction;
  		this.blood_pressure = data.blood_pressure;
  		this.height = data.height;
  		this.temperature = data.temperature;
  		this.weight = data.weight;
		  this.date_consultation = data.date_consultation;
		  this.time_consultation = data.time_consultation;
  		this.name_of_attending = data.name_of_attending;
  		this.nature_of_visit = data.nature_of_visit;
  		this.referred_from = data.referred_from;
  		this.referred_to = data.referred_to;
  		this.reason_of_referral = data.reason_of_referral;
  		this.referred_by = data.referred_by;
  		this.name_health_careprovider = data.name_health_careprovider;
  		this.chief_complaints = data.chief_complaints;
  		this.diagnosis = data.diagnosis;
  		this.performed_lab_test = data.performed_lab_test;
  		this.medication = data.medication;
  		this.lab_findings = data.lab_findings;
	});  	
  }

  updateItrRec(itr_id, fullname, address, family_serial_no, age, mode_transaction, blood_pressure, height, temperature, weight, date_consultation, time_consultation, name_of_attending, nature_of_visit, referred_from, referred_to, reason_of_referral, referred_by, name_health_careprovider, chief_complaints, diagnosis, performed_lab_test, medication, lab_findings){
    this.router.navigate(['/upd-itr/' + itr_id + '/' + fullname + '/' + address + '/' + family_serial_no + '/' + age + '/' + mode_transaction + '/' + blood_pressure + '/' + height + '/' + temperature + '/' + weight + '/' + date_consultation + '/' + time_consultation + '/' + name_of_attending + '/' + nature_of_visit + '/' + referred_from + '/' + referred_to + '/' + reason_of_referral + '/' + referred_by + '/' + name_health_careprovider + '/' + chief_complaints + '/' + diagnosis + '/' + performed_lab_test + '/' + medication + '/' + lab_findings]); 
  }


}
