import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostProvider } from '../../providers/post-provider';
import { ApiWatcherService } from '../api-watcher.service';
import { ToastController, MenuController, AlertController, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {

  fullname:string;
  anggota: any;
  actvlists: any = [];
  actlist: any = [];
  act_id: string;

  constructor (
  	private router: Router,
    private postPvdr: PostProvider,
    public alertController: AlertController,
    public toastCtrl: ToastController,
    public menuCtrl: MenuController, 
    public events: Events,           
    private apiwatcher: ApiWatcherService,
    private ionStorage: Storage 
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){ 
      this.actvlists = [];
      this.getStorageValue();
      this.menuCtrl.enable(true); 
  }

  getStorageValue(){
  		this.ionStorage.get('session_storage').then((res)=>{
  			this.loadActInfo(res.fullname);
  		});
  }

  loadActInfo(fullname){
    const fullName = fullname;
    return new Promise(resolve => {
      try{
        this.apiwatcher.loadingPresent();
        let body = {
          action : 'getAct',     
          added_by: fullName
        };
        this.postPvdr.postData(body, 'proses-api.php').subscribe(data => {
          this.apiwatcher.loadingDismiss();
          for(let actvlist of data.result){
            this.actvlists.push(actvlist);
          }
          this.actlist = this.actvlists;
          resolve(true);
        });
      }catch(e){
        this.apiwatcher.loadingDismiss();
        console.log('Error Message: ', e);
      }
    });
  }

  searchFiltered(ev:any){ 
    try{
      let val = ev.target.value;
      if(val && val.trim() != ''){
        this.actlist = this.actvlists.filter((actvlist) => {
          let record: any = actvlist;
          return (actvlist.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
    }catch(e){
      console.log('Error Message: ', e);
    }
    if(ev.target.value == ''){
      this.ionViewWillEnter();
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


  async prosesLogout(){
    const confirm = await this.confirmLogOut('Are you sure to Log Out?');
    if(confirm){
      try{
        this.events.publish('user: isLoggedOut');
        this.ionStorage.clear();
        this.actvlists = [];
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

  async delAct(id){
    const confirm = await this.confirmAlert('Are you sure to Delete?');
      if(confirm){
        this.apiwatcher.loadingPres2();
        try{
          let body = {
            action : 'delAct',
            act_id: id
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
          }, async err => {
            this.apiwatcher.loadingDismiss();
            const toast = await this.toastCtrl.create({
              message: 'Server timed out.',
              duration: 2000
            });
            toast.present();
          }); 
        }catch(e){
          console.log('Error Message: ',e);
        }
      }else{
        console.log('Canceled');
      }
  }

  addActivity(){
    this.router.navigate(['/add-act'])    
  }

  viewActivity(act_id, name, description, actdate, status){
    this.router.navigate(['/view-act/' + act_id + '/' + name + '/' + description + '/' + actdate + '/' + status]);
  }

}
