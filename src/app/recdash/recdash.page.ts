import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostProvider } from '../../providers/post-provider';
import { ToastController, AlertController, Events} from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-recdash',
  templateUrl: './recdash.page.html',
  styleUrls: ['./recdash.page.scss'],
})
export class RecdashPage implements OnInit {

  constructor(
  	private router: Router,
    private postPvdr: PostProvider,
    public alertController: AlertController,
    public toastCtrl: ToastController,
    public events: Events,
    private storage: Storage 
  ) { }

  ngOnInit() {
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
        this.storage.clear();
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

  indivtreatRec() {
 	  this.router.navigate(['/indivtreatrec'])
  }

  patenrRec() {
 	  this.router.navigate(['/patientrecords'])
  }

}
