import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostProvider } from '../../providers/post-provider';
import { ToastController, MenuController, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ApiWatcherService } from '../api-watcher.service';

@Component({
  selector: 'app-activity-all',
  templateUrl: './activity-all.page.html',
  styleUrls: ['./activity-all.page.scss'],
})
export class ActivityAllPage implements OnInit {

  fullname: string;
  anggota: any;

  actvlists: any = [];
  limit: number = 4;
  start: number = 0;	

  constructor(
  	private router: Router,
    private postPvdr: PostProvider,
    public menuCtrl: MenuController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public events: Events,    
    public toastCtrl: ToastController,
    private apiwatcher: ApiWatcherService,
    private storage: Storage 
    ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){ 
      this.actvlists = [];
      this.start = 0;
      this.loadActInfo();
      this.menuCtrl.enable(true); 
  		this.storage.get('session_storage').then((res)=>{
			this.anggota = res;
			this.fullname = this.anggota.fullname;
  		});
  }

  loadActInfo(){
    return new Promise(resolve => {
      try{
        this.apiwatcher.loadingPresent();
        let body = {
          action : 'getActAll',
          limit : this.limit,
          start : this.start        
        };

        this.postPvdr.postData(body, 'proses-api.php').subscribe(data => {
          for(let actvlist of data.result){
            this.actvlists.push(actvlist);
          }
          console.log('Array: ', this.actvlists);
          resolve(true);
          this.apiwatcher.loadingDismiss();
        });
      }catch(e){
        this.apiwatcher.loadingDismiss();
        console.log('Error Message:',e);
      }
    });
  }

  viewActivity(act_id, name, description, actdate, status){
    this.router.navigate(['/view-act-all/' + act_id + '/' + name + '/' + description + '/' + actdate + '/' + status]);
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
        this.storage.clear();
        this.actvlists = [];
        this.router.navigate(['/login']);
        const toast = await this.toastCtrl.create({
          message: 'Logout Successful',
          duration: 2000
        });
        toast.present();      
      }catch(e){
        console.log('Error Message:',e);

      }
    }else{
      console.log('Canceled');
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

}
