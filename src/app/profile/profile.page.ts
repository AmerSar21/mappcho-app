import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostProvider } from '../../providers/post-provider';
import { ToastController, MenuController, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  
  userid: string;
  fullname: string;
  bdate: string;
  gender: string;
  usertype: string;
  email: string;
  anggota: any;

  constructor(
  	private router: Router,
    private postPvdr: PostProvider,
    public alertController: AlertController,
    public toastCtrl: ToastController,
    public events: Events,
    private ionStorage: Storage 
  ) { }

  ionViewWillEnter(){
		this.ionStorage.get('session_storage').then((res) => {
      this.anggota = res;
      this.userid = this.anggota.userid;
      this.fullname = this.anggota.fullname;
      this.bdate = this.anggota.bdate;
      this.gender = this.anggota.gender;
      this.usertype = this.anggota.usertype;
      this.email = this.anggota.email;
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
        console.log('Error message: ',e);
      }
    }else{
      console.log('Canceled');
    }
  }

  ngOnInit() {
  }

}
