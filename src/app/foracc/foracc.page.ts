import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { MenuController, ToastController } from '@ionic/angular';
import { ApiWatcherService } from '../api-watcher.service';
import { CustomValidatorsService } from '../custom-validators.service';
import { PostProvider } from '../../providers/post-provider';
import { SmsApiService } from '../sms-api.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-foracc',
  templateUrl: './foracc.page.html',
  styleUrls: ['./foracc.page.scss'],
})

export class ForaccPage implements OnInit {

  public slideOneForm: FormGroup;
  public submitAttempt: boolean = false;
  public passValid: boolean = false;  
  public unameVal: boolean = false;    

  userValue: any;

  constructor(
  	private postPvdr: PostProvider,
    private router: Router,
    private menuCtrl: MenuController,
    private apiwatcher: ApiWatcherService,
    private storage: Storage,
    public smsapi: SmsApiService,
    public formBuilder: FormBuilder, 
    public toastCtrl: ToastController        
  ) { 
    this.slideOneForm = formBuilder.group({
        lname: ['',Validators.compose([Validators.required])],
        fname: ['',Validators.compose([Validators.required])],
        email: ['',Validators.compose([Validators.email,Validators.required])],
        bdate: ['',Validators.compose([Validators.required])],
        address: ['',Validators.compose([Validators.required])],
        contnum: [
        '',
        Validators.compose([Validators.maxLength(10),
        Validators.minLength(10),
        Validators.required])],     
        gender: ['',Validators.compose([Validators.required])],
        uname: ['',Validators.compose([Validators.required,Validators.pattern('[a-zA-Z]*')])],
        upass: ['',Validators.compose([Validators.required])],
        cpass: ['',Validators.compose([Validators.required])]        
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }  

  login(){
  		this.router.navigate(['/login']);
      this.storage.clear();
  }


  getUsernameValid(username){
    const usern = username;
    try{
      let body = {
        action : 'checkAcc',
        uname: usern
      };
      console.log('post body: ', body);
      this.postPvdr.postData(body, 'proses-api.php').subscribe(data => {
        if(data.success){ 
          this.userValue = "exists";
          console.log('msg' , this.userValue);
        }else{
          console.log('Error!');            
        }
      },err => {
        console.log('Message Error: ',err);
      });  
    }catch(e){
      console.log('Error Message: ',e);
    }
  }

  checkUsername(uname): any {
    return new Promise(resolve => {
      try{
        let body = {
          action : 'checkAcc',
          uname: username
        };
        console.log('post body: ', body);
        this.postPvdr.postData(body, 'proses-api.php').subscribe(async data => {
          if(data.success){ 
            resolve(data.msg);
          }else{
            resolve(data.msg);            
          }
        },err => {
          console.log('Message Error: ',err);
        });  
      }catch(e){
        console.log('Error Message: ',e);
      }
    });
  }

  submit(){
    const phone = this.slideOneForm.value.contnum;
    const upass = this.slideOneForm.value.upass;
    const cpass = this.slideOneForm.value.cpass;
    if(!this.slideOneForm.valid){  
      this.unameVal = false;
      this.passValid = false;
      this.submitAttempt = true;
    }else{     
      this.apiwatcher.loadingPres2();
      if(cpass != upass){
        this.unameVal = false;
        this.submitAttempt = false;
        this.passValid = true;
        this.apiwatcher.loadingDismiss();
      }else{
        return new Promise(resolve => {
          try{
            let body = {
              action : 'checkAcc',
              uname: this.slideOneForm.value.uname
            };
            console.log('post body: ', body);
            this.postPvdr.postData(body, 'proses-api.php').subscribe(async data => {
              if(data.success){ 
                this.apiwatcher.loadingDismiss();
                this.submitAttempt = false;
                this.passValid = false;
                this.unameVal = true;
              }else{
                this.unameVal = false;
                this.passValid = false;
                this.submitAttempt = false;
                const userVal = this.slideOneForm.value;
                this.apiwatcher.loadingDismiss();
                this.storage.set('User_info', userVal);
                this.smsapi.sendOtp(phone).then(async () => {
                  this.router.navigate(['/con-otp']);
                  const toast = await this.toastCtrl.create({
                    message: 'Code Sent.',
                    duration: 2000
                  });
                  toast.present();       
                }).catch(async err => {
                  this.apiwatcher.loadingDismiss();
                  const toast = await this.toastCtrl.create({
                    message: 'Failed to send Code.',
                    duration: 2000
                  });
                  toast.present();       
                  console.log(err);
                });
              }
            },err => {
              this.apiwatcher.loadingDismiss();
              console.log('Message Error: ',err);
            });  
          }catch(e){
            this.apiwatcher.loadingDismiss();            
            console.log('Error Message: ',e);
          }
        });
      }
    }
  }
}
