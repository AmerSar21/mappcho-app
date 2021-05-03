import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../providers/post-provider';
import { Router } from '@angular/router';
import { ToastController, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { ApiWatcherService } from '../api-watcher.service';

@Component({
  selector: 'app-add-act',
  templateUrl: './add-act.page.html',
  styleUrls: ['./add-act.page.scss'],
})
export class AddActPage implements OnInit {

  userid: string;
  uid: string = "";  
  anggota: any;
  fullname: string;

  // name: string = "";
  // actdate: string = "";
  // description: string = "";

  public activityForm: FormGroup;
  public submitAttempt: boolean = false;

  constructor(
  	private postPvdr: PostProvider,
  	private router: Router,
    public toastCtrl: ToastController,    
    private storage: Storage,
    public events: Events,
    public formBuilder: FormBuilder,    
    private apiwatcher: ApiWatcherService    
  ) { 
    this.activityForm = formBuilder.group({
      name: ['',Validators.compose([Validators.required])],
      actdate: ['',Validators.compose([Validators.required])],
      description: ['',Validators.compose([Validators.required])]
    })
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
      this.storage.get('session_storage').then((res)=>{
        this.anggota = res;
          this.userid = this.anggota.userid;
          this.fullname = this.anggota.fullname;
      })
  }

  checkDateID(){
    if(this.activityForm.value.actdate == '' || this.activityForm.value.actdate == null){
      this.submitAttempt = true;
    }else{
      this.submitAttempt = false;
      return new Promise(resolve => {
          if(this.activityForm.value.actdate != ""){
            try{
              let body = {
                actdate: this.activityForm.value.actdate = format(new Date(this.activityForm.value.actdate), "yyyy-MM-dd"), 
                action: 'checkDate'
              };
              this.postPvdr.postData(body, 'proses-api.php').subscribe(async data => {
                var alertmsg = data.msg;
                if(data.success){
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
  }

  createAddAct() {
    this.submitAttempt = true;
    this.apiwatcher.loadingPres2();
    if(!this.activityForm.valid){
      this.apiwatcher.loadingDismiss();
    }else{
      this.submitAttempt = false;
      var actdate = this.activityForm.value.actdate;
    	return new Promise(async resolve => {
        try{        
          let body = {
            action : 'addAct',
            name: this.activityForm.value.name,
            actdate: actdate = format(new Date(actdate), "yyyy-MM-dd"),
            description: this.activityForm.value.description,
            fullname: this.fullname,
          };
          this.postPvdr.postData(body, 'proses-api.php').subscribe(async data => {
            var alertmsg = data.msg;
            if(data.success){
              this.apiwatcher.loadingDismiss();
              this.router.navigate(['/activity']);
              const toast = await this.toastCtrl.create({
                message: 'Successfully Added',
                duration: 2000
              }); 
              toast.present();
              console.log('Success');                  
            }else{
              this.apiwatcher.loadingDismiss();            
              const toast = await this.toastCtrl.create({
                message: alertmsg,
                duration: 2000
              }); 
              toast.present();
              console.log('Failed');                  
            }
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
  }

}
