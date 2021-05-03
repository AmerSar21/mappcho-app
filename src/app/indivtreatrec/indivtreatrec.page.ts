import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostProvider } from '../../providers/post-provider';
import { ToastController, AlertController, Events } from '@ionic/angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { formatDate } from '@angular/common';
import { format } from 'date-fns';
import { Parser } from 'json2csv';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { ApiWatcherService } from '../api-watcher.service';

const { Filesystem } = Plugins;

@Component({
  selector: 'app-indivtreatrec',
  templateUrl: './indivtreatrec.page.html',
  styleUrls: ['./indivtreatrec.page.scss'],
})
export class IndivtreatrecPage implements OnInit {
  
  itrlists: any = [];
  ilist: any = [];
  templist: any = [];

  netdata: any = {};
  anggota: any;
  itr_id: string;
  fullname: string;  
  currentDate: string = "";
  msg: string;

  constructor(
  	private router: Router,
    private postPvdr: PostProvider,
    public alertController: AlertController,
    public http: Http,
    public toastCtrl: ToastController,
    public events: Events,
    private ionStorage: Storage,
    private apiwatcher: ApiWatcherService 
  ) { 
    this.http = http;
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getItrStorageValue();
    this.itrlists = [];
    this.templist = [];
    this.netdata.response = '';
  } 

  getItrStorageValue(){
    this.ionStorage.get('session_storage').then((res) => {
     this.loadItrInfo(res.fullname);
    });
  }

  async getTempItrStorage(){
    const res = await this.ionStorage.get('session_storage');
      const data = await this.apiwatcher.getTempItrList(res.fullname);
      console.log("data: ", data);
      return data;
  }

  delTempItrStorage(){
    this.ionStorage.get('session_storage').then((res) => {
     this.deleteAllRecord(res.fullname);
    });
  }

  loadItrInfo(fullname){
    return new Promise(resolve => {
      const fullName = fullname;      
      try{
        this.apiwatcher.loadingPresent();
        let body = {
          action : 'getItr',
          added_by: fullName
        };

        this.postPvdr.postData(body, 'proses-api.php').subscribe(data => {
          this.apiwatcher.loadingDismiss();          
          for(let itrlist of data.result){
            this.itrlists.push(itrlist);
          }
          this.ilist = this.itrlists;
          resolve(true);
        });
      }catch(e){
        this.apiwatcher.loadingDismiss();        
        console.log('Error Message: ',e);
      }
    });
  }

  async fileWrite() {
    try {
      if(this.itrlists === undefined || this.itrlists.length === 0){
        const toast = await this.toastCtrl.create({
          message: "Cannot Download Empty Records.",
          duration: 2000
        }); 
        toast.present();    
      }else{
        this.apiwatcher.loadingPres2();
        const myData = this.itrlists;
        const parser = new Parser();
        const csv = parser.parse(myData);
        const result = await Filesystem.writeFile({
          path: 'ItrDataList.csv',
          data: csv,
          directory: FilesystemDirectory.Documents,
          encoding: FilesystemEncoding.UTF8        
        })
        this.apiwatcher.loadingDismiss();
        const toast = await this.toastCtrl.create({
          message: 'ITR List Download Successful.',
          duration: 2000
        }); 
        toast.present();    
        console.log('Wrote file', result);
      }
    }catch(e) {
      this.apiwatcher.loadingDismiss();      
      var alertmsg = e.message;
      const toast = await this.toastCtrl.create({
          message: alertmsg,
          duration: 2000
      }); 
      toast.present();    
      console.error('Unable to write file', e);
    }
  }

  //delete all record after upload
  deleteAllRecord(fullname){
    const fullName = fullname;
    return new Promise(resolve => {
      try{
        let body = {
          action : 'delAllTempItr',
          submitted_by: fullName
        };
        this.postPvdr.postData(body, 'proses-api.php').subscribe(data => {
          if(data.success){
            console.log("Deleted Successful");
          }else{
            console.log("failed");
          }
        });
      }catch(e){
        console.log('Error Message: ',e);
      }
    }); 
  }

  async uploadViaOnline(){
    if(this.itrlists === undefined || this.itrlists.length === 0){
      const toast = await this.toastCtrl.create({
        message: "Cannot Upload Empty Records.",
        duration: 2000
      }); 
      toast.present();    
    }else{
      this.apiwatcher.setItrList(this.ilist);
      const confirm = await this.confirmAlert('Are you sure to Upload?');
      if(confirm){
        this.apiwatcher.loadingPres2();
        try{
          let type = "application/json; charset=UTF-8";
          let headers = new Headers({ 'Content-Type': type });
          let options = new RequestOptions({ headers: headers });

          var link = 'https://mcho-ims.herokuapp.com/www/itrapi.php';
          var link2 = 'http://localhost/mchoims/www/itrapi.php';            
          const data = await this.getTempItrStorage();   
          var myData = JSON.stringify({itrlist: data});
          this.http.post(link,myData,options).subscribe(async (itrlist) => {
            this.apiwatcher.loadingDismiss();            
            this.netdata.response = itrlist["_body"];
            console.log('callback: ', this.netdata.response);
            this.delTempItrStorage();
            const toast = await this.toastCtrl.create({
              message: "Successfully Uploaded.",
              duration: 2000
            }); 
            toast.present(); 
          }, async error => {
            this.apiwatcher.loadingDismiss();
            this.delTempItrStorage();            
            console.log("Message error: ", error); 
            const toast = await this.toastCtrl.create({
              message: "Failed to upload. Try again",
              duration: 2000
            }); 
            toast.present(); 
          });
        }catch(e){      
          this.apiwatcher.loadingDismiss();          
          this.delTempItrStorage();                
          console.log('Error Message: ',e);
        }
      }else{
        this.delTempItrStorage();      
        console.log('Canceled');
      }
    }
  }

  searchFiltered(ev:any){ 
    try{
      if(ev.target.value == ''){
        this.ionViewWillEnter();
      }
      console.log('old array', this.ilist);
      let val = ev.target.value;
      console.log('event: ', val);
      if(val && val.trim() != ''){
        this.ilist = this.itrlists.filter((itrlist) => {
          let record: any = itrlist;
          return (record.fullname.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
      console.log('new array', this.ilist);
    }catch(e){
      console.log('Error Message:',e);
    }
  }

  private async confirmAlert(message: string): Promise<boolean> { 
    let resolveFunction: (confirm: boolean) => void;
    const promise = new Promise<boolean>(resolve => {
      resolveFunction = resolve;
    });
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmation.',
      message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => resolveFunction(false)
        },
        {
          text: 'Confirm',
          handler: () => resolveFunction(true)
        }
      ]
    });
    await alert.present();
    return promise;
  }

  async prosesLogout(){
    const confirm = await this.confirmAlert('Are you sure to Log Out?');
    if(confirm){
      try{
        this.events.publish('user: isLoggedOut');
        this.ionStorage.clear();
        this.itrlists = [];
        this.ilist = [];
        this.templist = [];        
        this.router.navigate(['/login']);
        const toast = await this.toastCtrl.create({
          message: 'Logout Successful',
          duration: 2000
        });
        toast.present();      
      }catch(e){
        console.log('Error Message: ',e);
      }
    }else{
      console.log('Canceled');
    }
  }

  async delItrRec(id){
    const confirm = await this.confirmAlert('Are you sure to Delete?');
      if(confirm){
        this.apiwatcher.loadingPres2();
        try{
          let body = {
            action : 'delItrRec',
            itr_id: id
          };
          console.log('body: ', body);
          this.postPvdr.postData(body, 'proses-api.php').subscribe(async data => {
            var alertmsg = data.msg;
            if(data.success){
              this.apiwatcher.loadingDismiss();
              this.ionViewWillEnter();
              const toast = await this.toastCtrl.create({
                message: alertmsg,
                duration: 2000
              }); 
              toast.present();                  
            }else{
              this.apiwatcher.loadingDismiss();
              console.log(alertmsg);
              const toast = await this.toastCtrl.create({
                message: alertmsg,
                duration: 2000
              }); 
              toast.present();                  
            }
          }, async error =>{
            this.apiwatcher.loadingDismiss();
            console.log('Message: ',error);
            const alert = await this.alertController.create({
              cssClass: 'my-custom-class',
              header: 'Warning!',
              message: error,
              backdropDismiss: true
            });
            await alert.present();
          });
        }catch(e){
          console.log('Error Message: ',e);
        }
      }else{
        console.log('Canceled');
      }
  }

  addtreatRec() {
  	this.router.navigate(['/add-itr'])
  }

  viewItrRec(itr_id, fullname, address, family_serial_no, age, mode_transaction, blood_pressure, height, temperature, weight, date_consultation, time_consultation, name_of_attending, nature_of_visit, referred_from, referred_to, reason_of_referral, referred_by, name_health_careprovider, chief_complaints, diagnosis, performed_lab_test, medication, lab_findings){
    this.router.navigate(['/view-itr/' + itr_id + '/' + fullname + '/' + address + '/' + family_serial_no + '/' + age + '/' + mode_transaction + '/' + blood_pressure + '/' + height + '/' + temperature + '/' + weight + '/' + date_consultation + '/' + time_consultation + '/' + name_of_attending + '/' + nature_of_visit + '/' + referred_from + '/' + referred_to + '/' + reason_of_referral + '/' + referred_by + '/' + name_health_careprovider + '/' + chief_complaints + '/' + diagnosis + '/' + performed_lab_test + '/' + medication + '/' + lab_findings]); 
  }

}
