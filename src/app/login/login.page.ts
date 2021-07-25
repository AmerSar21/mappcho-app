
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostProvider } from '../../providers/post-provider';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { LoadingController, AlertController, MenuController, Events } from '@ionic/angular';  
import { ApiWatcherService } from '../api-watcher.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  
  username: string = "";
  password: string = "";
  data: any;
  subscription: any;
  anggota: any;
  fullname: string;
  temp: string;
  isLoading = false;
  public submitAttempt: boolean = false;
  public isActive: boolean = false;
  public doesExist: boolean = false;
  public checkCon: boolean = false;

  constructor(
  	private router: Router,
    private platform: Platform,
    private postPvdr: PostProvider,
    public loadingController: LoadingController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertController: AlertController,
    private apiwatcher: ApiWatcherService,
    private ionStorage: Storage, 
    public events: Events
  ) { }

  ngOnInit() {
    this.menuCtrl.enable(false);  
  }

  ionViewWillEnter() {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false);
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      // do nothing
    })
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }  

  formForAcc(){
  	this.router.navigate(['/foracc']);
    this.username = "";
    this.password = "";
    this.submitAttempt = false;
    this.isActive = false;
    this.doesExist = false;
    this.checkCon = false;
  }

  async processLogin(){
    if(this.username != "" && this.password != ""){
      this.apiwatcher.loadingPres2();
      let body = {
        username: this.username,
        password: this.password,
        action: 'login'
      };

      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>
      {
        var alertmsg = data.msg;
        if(data.success){
          const result = await data.result;
          console.log(result);
          this.ionStorage.set('session_storage', result); 
          const userType = await data.result.usertype;
          if(userType == "Admin"){
            this.apiwatcher.loadingDismiss();
            this.submitAttempt = false;
            this.isActive = false;
            this.doesExist = false;
            this.checkCon = false;
            this.events.publish('user: isAdmin');
            this.router.navigate(['/home-admin']);
            const toast = await this.toastCtrl.create({
              message: 'Login Successful',
              duration: 2000
            });
            toast.present();                   
          }else if(userType == "User"){
            this.apiwatcher.loadingDismiss(); 
            this.submitAttempt = false;
            this.isActive = false;
            this.doesExist = false;
            this.checkCon = false;                   
            this.events.publish('user: isUser');
            this.router.navigate(['/home']);
            const toast = await this.toastCtrl.create({
              message: 'Login Successful',
              duration: 2000
            }); 
            toast.present();
          }else{
            this.submitAttempt = false;
            this.isActive = false;
            this.doesExist = false;
            this.checkCon = false; 
            this.apiwatcher.loadingDismiss();
          }
        }else if((!data.success && alertmsg == 'Account Inactive')){
          this.apiwatcher.loadingDismiss();
          this.doesExist = false;
          this.submitAttempt = false;
          this.checkCon = false
          this.isActive = true;
        }else if((!data.success && alertmsg == 'Account doesnt Exist')){
          this.apiwatcher.loadingDismiss();
          this.submitAttempt = false;
          this.checkCon = false; 
          this.isActive = false;
          this.doesExist = true;
        }else{
          this.apiwatcher.loadingDismiss();
          this.doesExist = false;
          this.submitAttempt = false;
          this.isActive = false
          this.checkCon = true;
        }
      }, async onError => { 
        if((this.username == "" && this.password == "") && onError){
          this.apiwatcher.loadingDismiss();
          this.doesExist = false;
          this.submitAttempt = false;
          this.isActive = false
          this.checkCon = true;
        }else{
          this.apiwatcher.loadingDismiss();
          this.doesExist = false;
          this.submitAttempt = false;
          this.isActive = false
          this.checkCon = true;
        }
      });

    }else if(this.username == "" && this.password == ""){
      this.doesExist = false;
      this.isActive = false;
      this.checkCon = false;
      this.submitAttempt = true;
    }else{
      this.apiwatcher.loadingDismiss();
      this.doesExist = false;
      this.submitAttempt = false;
      this.isActive = false
      this.checkCon = true;
    }
    this.username = "";
    this.password = "";   
  }



}
