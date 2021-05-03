import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../providers/post-provider';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { format } from 'date-fns';
import { ApiWatcherService } from '../api-watcher.service';
import { MenuController, ToastController } from '@ionic/angular';
import { SmsApiService } from '../sms-api.service';

@Component({
  selector: 'app-con-otp',
  templateUrl: './con-otp.page.html',
  styleUrls: ['./con-otp.page.scss'],
})
export class ConOtpPage implements OnInit {

  code: string;
  codeGen: string;
  phonenum: string;

  public codeVal: boolean = false;

  constructor(
  	private postPvdr: PostProvider,
    private router: Router,
    private menuCtrl: MenuController,
    private apiwatcher: ApiWatcherService,
    private storage: Storage,
    public smsapi: SmsApiService, 
    public toastCtrl: ToastController  
  	) {}
  
  ionViewWillEnter(){
  }

  ngOnInit() {
  }

  resendCode(){
    this.apiwatcher.loadingPres2();
    this.storage.get('User_info').then((res) => {
      const phone = res.contnum;
      this.smsapi.sendOtp(phone).then(async () => {
        this.apiwatcher.loadingDismiss();
        const toast = await this.toastCtrl.create({
          message: 'Code Re-sent.',
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
    });
  }
  
  register(){    
    this.apiwatcher.loadingPres2();
    this.storage.get('generateCode').then(res =>{
      this.codeGen = res;
      if(this.codeGen == this.code){
        this.apiwatcher.loadingDismiss();
        this.codeVal = false; 
        this.storage.get('User_info').then(res => {
          const uname = res.uname;
          const upass = res.upass;
          const fname = res.fname;
          const lname = res.lname;
          const bdate = res.bdate;
          const gender = res.gender;
          const email = res.email;
          const contnum = res.contnum;
          const address = res.address;
          this.registerAcc(uname,upass,fname,lname,contnum,bdate,gender,email,address);
          this.storage.clear();         
        });
      }else{
        this.apiwatcher.loadingDismiss();
        this.codeVal = true;
      }
    });
  }

  registerAcc(uname,upass,fname,lname,contnum,bdate,gender,email,address){
    this.apiwatcher.loadingPres2();
    return new Promise(resolve => {
      try{
          let body = {
          action : 'regAcc',
          uname: uname,
          upass: upass,
          fname: fname,
          lname: lname,
          contnum: contnum,
          bdate: bdate = format(new Date(bdate), "yyyy-MM-dd"),
          gender: gender,
          email: email,
          address: address,
        };
        this.postPvdr.postData(body, 'proses-api.php').subscribe(async data => {
          var alertmsg = data.msg;
          if(data.success){
            this.apiwatcher.loadingDismiss();
            console.log('Successfully');
            this.router.navigate(['/login']);
            const toast = await this.toastCtrl.create({
              message: 'Successfully Registered.',
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
          console.log('Error Message: ',err);
          this.apiwatcher.loadingDismiss();
            const toast = await this.toastCtrl.create({
              message: err,
              duration: 2000
            }); 
            toast.present();  
        });  
      }catch(e){
        this.apiwatcher.loadingDismiss();
        console.log('Error Message: ',e);
      }
    });
  }

}
