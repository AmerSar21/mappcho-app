import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostProvider } from '../../providers/post-provider';
import { ToastController, MenuController, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { ApiWatcherService } from '../api-watcher.service';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit {

  fullname: string;
  anggota: any;
  notif = '';

  constructor(
  	private router: Router,
    private postPvdr: PostProvider,
    public alertController: AlertController,
    public menuCtrl: MenuController,
    public events: Events,    
    public toastCtrl: ToastController,
    private route: ActivatedRoute,
    private apiwatcher: ApiWatcherService, 
    private ionStorage: Storage
  ) {
  }

  ngOnInit() {
    this.ionViewWillEnter();
  }

  ionViewWillEnter(){
    this.getNotifNumber();    
    this.getStorageValue(); 
    this.menuCtrl.enable(true); 
  }
  
  getStorageValue(){
    this.ionStorage.get('session_storage').then(async res =>{
			this.anggota = await res;
			this.fullname = await this.anggota.fullname;
		});
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
      this.getNotifNumber();
      console.log('Begin async operation');
      setTimeout(() => {
        console.log('Async operation has ended');
        event.target.complete();
      }, 2000);
    }catch(e){
      console.log('Error: ', e.message);
    }
  } 

  getNotifNumber(){
    return new Promise(resolve => {
      let body = {
        aksi : 'getNewUser',
      };
      this.postPvdr.postData(body, 'proses-api.php').subscribe(data => {
        if(data.success){
          this.notif = data.number;
        }else{
          this.notif = data.msg;
          console.log("failed");
        }
      });
    });
  }

  accountsPage(){
    try{
      this.router.navigate(['/accounts']);
    }catch(e){
      console.log(e.message);
    }
  }

  activityPage(){
    try{
      this.router.navigate(['/activity']);
    }catch(e){
      console.log(e.message);
    }
  }

  profilePage(){
    try{
      this.router.navigate(['/profile']);
    }catch(e){
      console.log(e.message);
    }
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
        console.log('Error Message: ',e);
      }
    }else{
      console.log('Canceled');
    }
  }

  viewActivity(act_id, name, description, actdate, status){
    this.router.navigate(['/view-act-all/' + act_id + '/' + name + '/' + description + '/' + actdate + '/' + status]);
  }

}
