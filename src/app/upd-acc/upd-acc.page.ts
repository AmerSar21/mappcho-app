import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { format } from 'date-fns';
import { ApiWatcherService } from '../api-watcher.service';

@Component({
  selector: 'app-upd-acc',
  templateUrl: './upd-acc.page.html',
  styleUrls: ['./upd-acc.page.scss'],
})
export class UpdAccPage implements OnInit {

  userid: string;
  anggota: any

  uid: string = "";
  accid: string = "";
  uname: string = "";
  upass: string = "";
  usertype: string = "";
  status: string = "";
  fname: string = "";
  lname: string = "";
  bdate: string = "";
  gender: string = "";
  email: string = "";
  address: string = "";

  constructor(
  	private postPvdr: PostProvider,
  	private router: Router,
    private actRoute: ActivatedRoute,
    public toastCtrl: ToastController,    
    private storage: Storage,
    private apiwatcher: ApiWatcherService 
  ) { }

  ngOnInit() {
  	this.actRoute.params.subscribe((data: any) => {
      this.accid = data.accid;      
      this.uname = data.uname;
      this.upass = data.upass;
      this.usertype = data.usertype;
      this.status = data.status;
      this.fname = data.fname;
      this.lname = data.lname;
      this.bdate = data.bdate;
      this.gender = data.gender;
      this.email = data.email;
      this.address = data.address;
	  });
  }

  ionViewWillEnter(){
      this.storage.get('session_storage').then((res)=>{
        this.anggota = res;
          this.userid = this.anggota.userid;
      })
  }

  updateAccount(){
    this.apiwatcher.loadingPres2();
    return new Promise(resolve => {
      try{
        let body = {
          action : 'updateAcc',
          uid: this.uid,
          accid: this.accid,
          uname: this.uname,
          upass: this.upass,
          usertype: this.usertype,
          status: this.status,
          fname: this.fname,
          lname: this.lname,
          bdate: this.bdate = format(new Date(this.bdate), "yyyy-MM-dd"),
          gender: this.gender,
          email: this.email,
          address: this.address
        };
        console.log('Array Body: ', body);
        this.postPvdr.postData(body, 'proses-api.php').subscribe(async data => {
          var alertmsg = data.msg;
          if(data.success){
            this.apiwatcher.loadingDismiss();
            this.router.navigate(['/accounts']);
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
        } ,async err => {
            this.apiwatcher.loadingDismiss();
            const toast = await this.toastCtrl.create({
              message: 'Server timed out.',
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
