import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../providers/post-provider';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { format } from 'date-fns';
import { ApiWatcherService } from '../api-watcher.service';

@Component({
  selector: 'app-add-itr',
  templateUrl: './add-itr.page.html',
  styleUrls: ['./add-itr.page.scss'],
})
export class AddItrPage implements OnInit {

  userid: string;
  anggota: any;
  value: boolean = true;

  uid: string = "";
  patid: string = "";
  age: string = "";
  modeoftrans: string = "";
  cdate: string = "";
  ctime: string = "";
  bloodp: string = "";
  height: string = "";
  temp: string = "";
  weight: string = "";
  attofficer: string = "";
  natofvis: string = "";
  reffrom: string = "";
  refto: string = "";
  reason: string = "";
  reasby: string = "";
  hcprov: string = "";
  compl: string = "";
  labtest: string = "";
  medtreat: string = "";
  diagnosis: string = "";
  labfindings: string = "";  

  fcode: string;
  fullname: string = "";
  suffix: string = "";
  address: string = "";

  infolists: any = [];
  open: boolean = false;

  constructor(
  	private postPvdr: PostProvider,
  	private router: Router,
    public toastCtrl: ToastController,    
    private storage: Storage,
    private apiwatcher: ApiWatcherService 
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
      this.storage.get('session_storage').then((res)=>{
        this.anggota = res;
          this.userid = this.anggota.userid;
      })
  }

  onChange(modeoftrans){
    if(this.modeoftrans == 'Referral'){
      this.value = false;
    }else{
      this.value = true;
    }
  }

  checkPatientID(){
    return new Promise(resolve => {
        if(this.patid != ""){
          try{
            let body = {
              patid: this.patid,
              action: 'checkPatId'
            };
            this.postPvdr.postData(body, 'proses-api.php').subscribe(async data => {
              var alertmsg = data.msg;
              if(data.success){
                this.apiwatcher.loadingDismiss();
                const toast = await this.toastCtrl.create({
                  message: alertmsg,
                  duration: 3000
                }); 
                toast.present();
              }else{
                const toast = await this.toastCtrl.create({
                  message: alertmsg,
                  duration: 2000
                }); 
                toast.present();                  
              }
            });
          }catch(e){
            console.log('Error Message: ',e);
          }
        } 
    });
  }

  getPatientInfo(){
    return new Promise(resolve => {
        if(this.patid != ""){
          try{
            let body = {
              patid: this.patid,
              action: 'getPatInfo'
            };
            this.postPvdr.postData(body, 'proses-api.php').subscribe(async data => {
              var alertmsg = data.msg;
              if(data.success){
                this.storage.set('pat_fcode', data.result);
                const toast = await this.toastCtrl.create({
                  message: alertmsg,
                  duration: 3000
                }); 
                toast.present();
              }else{
                const toast = await this.toastCtrl.create({
                  message: alertmsg,
                  duration: 2000
                }); 
                toast.present();                  
              }
            });
          }catch(e){
            console.log('Error Message: ',e);
          }
        } 
    });
  }

  async createAddItr() {
    this.apiwatcher.loadingPres2();
    if((this.cdate == '' || this.cdate == null) || (this.ctime == '' || this.ctime == null)){
      this.apiwatcher.loadingDismiss();            
      const toast = await this.toastCtrl.create({
        message: 'Please fill out all details accurately',
        duration: 2000
      }); 
      toast.present();   
    }else{
    	return new Promise(resolve => {
        try{
          let body = {
            action : 'addItr',
            uid: this.uid,
            patid : this.patid,
            age : this.age,
            modeoftrans : this.modeoftrans,
            consdate: this.cdate = format(new Date(this.cdate), "yyyy-MM-dd"),
            constime: this.ctime = format(new Date(this.ctime), "HH-mm"),
            bloodp : this.bloodp,
            temp : this.temp,
            height : this.height,
            weight : this.weight,
            attofficer : this.attofficer,
            natofvis : this.natofvis,
            reffrom : this.reffrom,
            refto : this.refto,
            reason : this.reason,
            reasby : this.reasby,
            hcprov : this.hcprov,
            compl : this.compl,
            labtest : this.labtest,
            medtreat : this.medtreat,
            diagnosis : this.diagnosis,
            labfindings : this.labfindings
          };
          console.log('Input Body: ', body);
          this.postPvdr.postData(body, 'proses-api.php').subscribe(async data => {
            var alertmsg = data.msg;
            if(data.success){
              this.apiwatcher.loadingDismiss();
              this.router.navigate(['/indivtreatrec']);
              const toast = await this.toastCtrl.create({
                message: 'ITR Successfully Added',
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
          }, async err => {
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

}
