import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostProvider } from '../../providers/post-provider';
import { ToastController, MenuController, Events } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ApiWatcherService } from '../api-watcher.service';
import { Plugins } from '@capacitor/core';
import { Storage } from '@ionic/storage';

// const { Storage } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  fullname: string;
  anggota: any;

  actvlists: any = [];

  constructor(
    private router: Router,
    private postPvdr: PostProvider,
    public menuCtrl: MenuController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public events: Events,    
    public toastCtrl: ToastController,
    private ionStorage: Storage,
    private apiwatcher: ApiWatcherService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getStorageValue();
    this.menuCtrl.enable(true);
  }

  getStorageValue(){
    this.ionStorage.get('session_storage').then(async res=>{
      this.anggota = await res;
      this.fullname = await this.anggota.fullname;        
    })
  }

  patientEnrolPage(){
    try{
      this.router.navigate(['/patientrecords']);
    }catch(e){
      console.log("Error: ", e.message);
    }
  }

  indivTreatPage(){
    try{
      this.router.navigate(['/indivtreatrec']);
    }catch(e){
      console.log('Error: ', e.message);
    }
  }

  profilePage(){
    try{
      this.router.navigate(['/profile']);
    }catch(e){
      console.log(e.message);
    }
  }

  activityPage(){
    try{
      this.router.navigate(['/activity-all']);
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
        console.log('Error Message:',e);

      }
    }else{
      console.log('Canceled');
    }
  }

  viewActivity(act_id, name, description, actdate, status){
    this.router.navigate(['/view-act-all/' + act_id + '/' + name + '/' + description + '/' + actdate + '/' + status]);
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