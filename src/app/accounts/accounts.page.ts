import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostProvider } from '../../providers/post-provider';
import { ToastController, MenuController, AlertController, Events, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ApiWatcherService } from '../api-watcher.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss'],
})
export class AccountsPage implements OnInit {

  fullname: string;	
  userid: string;	
  anggota: any;

  acclists: any = [];
  acntlist: any = [];
  isLoading = false;
  start: number = 40;
  accid: string;
  uname: string= "";
  upass: string = "";
  usertype: string = "";
  status: string = "";
  fname: string = "";
  lname: string = "";
  bdate: string = "";
  gender: string = "";
  email: string = "";

  constructor (
   	private router: Router,
    private postPvdr: PostProvider,
    public toastCtrl: ToastController,
    public alertController: AlertController,
    public menuCtrl: MenuController, 
    public loadingController: LoadingController,
    public events: Events,  
    private apiwatcher: ApiWatcherService,   
    private ionStorage: Storage 
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){ 
    this.acclists = [];
    this.start = 0;
    this.loadAccInfo();
    this.menuCtrl.enable(true); 
  	this.ionStorage.get('session_storage').then((res)=>{
	    this.fullname = res.fullname;
      this.userid = res.userid;
    });
  }

  loadAccInfo(){
    return new Promise(resolve => {
      try{
        this.apiwatcher.loadingPresent();
        let body = {
          action : 'getAcc'        
        };
        this.postPvdr.postData(body, 'proses-api.php').subscribe(data => {
          for(let acclist of data.result){
            this.acclists.push(acclist);
          }
          this.acntlist = this.acclists;
          resolve(true);
          this.apiwatcher.loadingDismiss();
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
        console.log('Error Message: ', e);
      }
    });
  }

  searchFiltered(ev:any){ 
    try{
      if(ev.target.value == ''){
        this.ionViewWillEnter();
      }
      let val = ev.target.value;
      if(val && val.trim() != ''){
        this.acntlist = this.acclists.filter((acclist) => {
          let record: any = acclist;
          return (record.lname.toLowerCase().indexOf(val.toLowerCase()) > -1 || record.fname.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
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

  async delAcc(id){
    const confirm = await this.confirmAlert('Are you sure to Delete?');
    if(confirm){
      this.apiwatcher.loadingPres2();
      try{
        if(this.userid == id){
          this.apiwatcher.loadingDismiss();
          const toast = await this.toastCtrl.create({
            message: 'Cannot deleted logged user.',
            duration: 2000
          }); 
          toast.present();
        }else{
          let body = {
            action : 'delAcc',
            accid: id
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
          }, async err => {
            this.apiwatcher.loadingDismiss();
            const toast = await this.toastCtrl.create({
              message: 'Server timed out.',
              duration: 2000
            });
            toast.present();  
          });
        }
      }catch(e){
        console.log('Error Message: ',e);
      }
    }else{
      console.log('Canceled');
    }
  }
  
  doRefresh(event) {
    try{
      this.ionViewWillEnter();
      console.log('Begin async operation');
      setTimeout(() => {
        console.log('Async operation has ended');
        event.target.complete();
      }, 2000);
    }catch(e){
      console.log('Error: ', e.message);
    }
  } 

  private async confirmLogOut(message: string): Promise<boolean> { 
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
    const confirm = await this.confirmLogOut('Are you sure to Log Out?');
    if(confirm){
      try{
        this.events.publish('user: isLoggedOut');              
        this.ionStorage.clear();
        this.router.navigate(['/login']);
        const toast = await this.toastCtrl.create({
          message: 'Logout Successful',
          duration: 2000
        });
        toast.present();      
      }catch(e){
        console.log('Error Message: ', e);
      }
    }else{
      console.log('Canceled');
    }
  }

  addAccount(){
    this.router.navigate(['/add-acc'])    
  }

  viewAccount(accid,uname,upass,usertype,status,fname,lname,bdate,gender,email,address){
    this.router.navigate(['/view-acc/' + accid + '/' + uname + '/' + upass + '/' + usertype + '/' + status + '/' + fname + '/' + lname + '/' + bdate + '/' + gender + '/' + email + '/' + address])
  }


}
