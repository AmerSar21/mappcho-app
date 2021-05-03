import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostProvider } from '../../providers/post-provider';
import { ToastController, LoadingController, AlertController, Events } from '@ionic/angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { formatDate } from '@angular/common';
import { format } from 'date-fns';
import { Parser } from 'json2csv';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { ApiWatcherService } from '../api-watcher.service';
  
const { Filesystem } = Plugins;

@Component({
  selector: 'app-patientrecords',
  templateUrl: './patientrecords.page.html',
  styleUrls: ['./patientrecords.page.scss'],
})
export class PatientrecordsPage implements OnInit {

  perlists: any = [];
  plist: any = [];
  netdata: any = {};
  templist: any = [];

  dataName: any;
  fullname: string = "";
  userid: string;
  anggota: any;
  currentDate: string = "";
  isLoading = false;

  constructor(
    private platform: Platform,
  	private router: Router,
    private postPvdr: PostProvider,
    public alertController: AlertController,
    public loadingController: LoadingController,
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
    this.getPerStorageValue();
    this.perlists = [];
    this.templist = [];
    this.netdata.response = '';
  }

  getPerStorageValue(){
    this.ionStorage.get('session_storage').then((res) => {
     this.loadPerInfo(res.fullname);
    });    
  }

  async getTempPerStorage(){
    const res = await this.ionStorage.get('session_storage');
      const data = await this.apiwatcher.getTempPerList(res.fullname);
      console.log("data: ", data);
      return data;
  }

  delTempPerStorage(){
    this.ionStorage.get('session_storage').then((res) => {
     this.deleteAllRecord(res.fullname);
    });
  }

  //capacitor working on native
  async fileWrite() {
    try {
      if(this.perlists === undefined || this.perlists.length === 0){
        const toast = await this.toastCtrl.create({
          message: "Cannot Download Empty Records.",
          duration: 2000
        }); 
        toast.present();    
      }else{
        this.apiwatcher.loadingPres2();
        const myData = this.perlists;
        const parser = new Parser();
        const csv = parser.parse(myData);
        const result = await Filesystem.writeFile({
          path: 'PERDataList.csv',
          data: csv,
          directory: FilesystemDirectory.Documents,
          encoding: FilesystemEncoding.UTF8        
        })
        this.apiwatcher.loadingDismiss();
        const toast = await this.toastCtrl.create({
          message: 'PER List Download Successful.',
          duration: 2000
        }); 
        toast.present();    
        console.log('Wrote file', result);
      }
    } catch(e) {
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

  loadPerInfo(fullname){
    const fullName = fullname;
    try{
      return new Promise(resolve => {
        this.apiwatcher.loadingPresent();          
        let body = {
          action : 'getPer',
          added_by : fullName
        };
        this.postPvdr.postData(body, 'proses-api.php').subscribe(data => {
          this.apiwatcher.loadingDismiss();
          for(let perlist of data.result){
            this.perlists.push(perlist);
          }
          this.plist = this.perlists;
          resolve(true);
        });
      });
    }catch(e){
      this.apiwatcher.loadingDismiss();
      console.error('Null table: ', e.message);
    }
  }

  //for upload transfer
  getPerList(){
    return new Promise(resolve => {
      try{
        let body = {
          action : 'insertPer',
          perArray : this.perlists,
          cDate: this.currentDate = format(new Date(), "yyyy-MM-dd")
        };
        this.postPvdr.postData(body, 'proses-api.php').subscribe(data => {
          if(data.success){
            console.log("Transfer Successful");
          }else{
            console.log("failed");
          }
        });
      }catch(e){
        console.log('Error Message: ',e);
      }
    }); 
  }

  //delete all record after upload
  deleteAllRecord(fullname){
    const fullName = fullname;
    return new Promise(resolve => {
      try{
        let body = {
          action : 'delAllTempPer',
          submitted_by: fullName
        };
        this.postPvdr.postData(body, 'proses-api.php').subscribe(data => {
          if(data.success){
            console.log("Deleted Successful: ", this.templist);
          }else{
            console.log("failed");
          }
        });
      }catch(e){
        console.log('Error Message: ',e);
      }
    }); 
  }

  //upload via online
  async uploadViaOnline(){
    if(this.perlists === undefined || this.perlists.length === 0){
      const toast = await this.toastCtrl.create({
        message: "Cannot Upload Empty Records.",
        duration: 2000
      }); 
      toast.present();    
    }else{
      this.apiwatcher.setPerList(this.plist);
      const confirm = await this.confirmAlert('Are you sure to Upload?');
      if(confirm){
        this.apiwatcher.loadingPres2();
        try{
          let type = "application/json; charset=UTF-8";
          let headers = new Headers({ 'Content-Type': type });
          let options = new RequestOptions({ headers: headers });

          var link = 'https://mcho-ims.herokuapp.com/www/perapi.php';
          var link2 = 'http://localhost/mchoims/www/perapi.php';    
          const data = await this.getTempPerStorage();   
          var myData = JSON.stringify({perlist: data});
          // console.log("Data: ", myData);
          this.http.post(link,myData,options).subscribe(async perlist => {
            this.apiwatcher.loadingDismiss();
            this.netdata.response = perlist["_body"];
            console.log('callback: ', this.netdata.response);
            this.delTempPerStorage();
            const toast = await this.toastCtrl.create({
              message: "Successfully Uploaded.",
              duration: 2000
            }); 
            toast.present(); 
          }, async error => {
            this.apiwatcher.loadingDismiss();
            this.delTempPerStorage();
            const toast = await this.toastCtrl.create({
              message: "Failed to Upload. Try Again.",
              duration: 2000
            }); 
            toast.present(); 
          });          
        }catch(e){                   
          this.apiwatcher.loadingDismiss();
          this.delTempPerStorage();         
          console.log('Error Message: ',e.message);
        }
      }else{
        this.apiwatcher.loadingDismiss();
        this.delTempPerStorage();
        console.log('Canceled');
      }
    }
  }

  searchFiltered(ev:any){ 
    try{
      if(ev.target.value == ''){
        this.ionViewWillEnter();
      }
      console.log('old array', this.plist);
      let val = ev.target.value;
      console.log('event: ', val);
      if(val && val.trim() != ''){
        this.plist = this.perlists.filter((perlist) => {
          let record: any = perlist;
          return (record.lname.toLowerCase().indexOf(val.toLowerCase()) > -1 || record.fname.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
      console.log('new array', this.plist);
    }catch(e){
      console.log('Error Message: ',e);
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

  async delPerRec(id){
    const confirm = await this.confirmAlert('Are you sure to Delete?');
      if(confirm){
        this.apiwatcher.loadingPres2();
        try{
          let body = {
            action : 'delPerRec',
            pe_id: id
          };
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
              const toast = await this.toastCtrl.create({
                message: alertmsg,
                duration: 2000
              }); 
              toast.present();                  
            }
            console.log('OK');
          });  
        }catch(e){
          console.log('Error Message: ',e);
        }
      }else{
        console.log('Canceled');
      }
  }

  async prosesLogout(){
    const confirm = await this.confirmAlert('Are you sure to Log Out?');
    if(confirm){
      try{
        this.events.publish('user: isLoggedOut');    
        this.ionStorage.clear();
        this.templist = [];
        this.perlists = [];
        this.plist = [];
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

  addenrolRec() {
    this.router.navigate(['/add-per']);
  }

  viewPerRec(pe_id,family_serial_no,lname,fname,mname,suffix,sex,b_place,b_date,bloodtype,civil_stat ,spouse_name, educ_attainment, employ_status, fam_position, patient_id, home_no, street, barangay, city, province, mothers_name, contact_no, dswdnhts, facility_no, ph_member, ph_no, member_category) {
    this.router.navigate(['/view-per/' + pe_id + '/' + family_serial_no + '/' + lname + '/' + fname + '/' + mname + '/' + suffix + '/' + sex + '/' + b_place + '/' + b_date + '/' + bloodtype + '/' + civil_stat + '/' + spouse_name + '/' + educ_attainment + '/' + employ_status + '/' + fam_position + '/' + patient_id + '/' + home_no + '/' + street + '/' + barangay + '/' + city + '/' + province + '/' + mothers_name + '/' + contact_no + '/' + dswdnhts + '/' + facility_no + '/' + ph_member + '/' + ph_no + '/' + member_category]);
  }  

}
