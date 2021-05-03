import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { format } from 'date-fns';
import { ApiWatcherService } from '../api-watcher.service';

@Component({
  selector: 'app-upd-itr',
  templateUrl: './upd-itr.page.html',
  styleUrls: ['./upd-itr.page.scss'],
})
export class UpdItrPage implements OnInit {
	
  userid: string;
  pe_id: number;	
  anggota: any;	
  value: number;
  itr_id: number;
  uid: string = "";
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
    public toastCtrl: ToastController,    
    private storage: Storage,
    private apiwatcher: ApiWatcherService 
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

  onChange(mode_transaction){
    if(this.mode_transaction == 'Referral'){
      this.value = 1;
    }else{
      this.value = 0;
    }
  }

  updateItr(){
    this.apiwatcher.loadingPres2();
    return new Promise(resolve => {
      try{
        let body = {
          action : 'updateItr',
          itr_id: this.itr_id,    
          age : this.age,
          mode_transaction : this.mode_transaction,
          blood_pressure : this.blood_pressure,
          height : this.height,
          temperature : this.temperature,
          weight : this.weight,
          date_consultation : this.date_consultation = format(new Date(this.date_consultation), "yyyy-MM-dd"),
          time_consultation : this.time_consultation,        
          name_of_attending : this.name_of_attending,
          nature_of_visit : this.nature_of_visit,
          referred_from : this.referred_from,
          referred_to : this.referred_to,
          reason_of_referral : this.reason_of_referral,
          referred_by : this.referred_by,
          name_health_careprovider : this.name_health_careprovider,
          chief_complaints : this.chief_complaints,
          performed_lab_test : this.performed_lab_test,
          medication : this.medication,
          diagnosis : this.diagnosis,
          lab_findings : this.lab_findings
        };
        
        this.postPvdr.postData(body, 'proses-api.php').subscribe(async data => {
          var alertmsg = data.msg;
          if(data.success){
            this.apiwatcher.loadingDismiss();
            this.router.navigate(['/indivtreatrec']);
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
        });  
      }catch(e){
        this.apiwatcher.loadingDismiss();        
        console.log('Error Message: ',e);
      }
    });
  }

}
