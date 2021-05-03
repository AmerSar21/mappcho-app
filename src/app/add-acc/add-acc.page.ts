import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { ApiWatcherService } from '../api-watcher.service';

@Component({
  selector: 'app-add-acc',
  templateUrl: './add-acc.page.html',
  styleUrls: ['./add-acc.page.scss'],
})
export class AddAccPage implements OnInit {

  userid: string;
  anggota: any

  public accountForm: FormGroup;
  public submitAttempt: boolean = false;

  uid: string = "";

  constructor(
  	private postPvdr: PostProvider,
  	private router: Router,
    private actRoute: ActivatedRoute,
    private storage: Storage,
    private apiwatcher: ApiWatcherService,
    public toastCtrl: ToastController,
    public events: Events,    
    public formBuilder: FormBuilder
  ) {
    this.accountForm = formBuilder.group({
        lname: ['',Validators.compose([Validators.required])],
        fname: ['',Validators.compose([Validators.required])],
        email: ['',Validators.compose([Validators.email,Validators.required])],
        address: ['',Validators.compose([Validators.required])],
        bdate: [''.split('T')[0],Validators.compose([Validators.required])],
        contnum: [
        '',
        Validators.compose([Validators.maxLength(10),
        Validators.minLength(10),
        Validators.required])],     
        gender: ['',Validators.compose([Validators.required])],
        usertype: ['',Validators.compose([Validators.required])],
        uname: ['',Validators.compose([Validators.required])],
        upass: ['',Validators.compose([Validators.required])]
    })
  }
  
  ngOnInit() {
  }

  ionViewWillEnter(){
      this.storage.get('session_storage').then((res)=>{
        this.anggota = res;
          this.userid = this.anggota.userid;
      })
  }

  createAddAcc(){
    if(!this.accountForm.valid){
      this.submitAttempt = true;    
    }else{
      this.submitAttempt = false;
      this.apiwatcher.loadingPres2();
      var bdate = this.accountForm.value.bdate;
      var contact = "+63" + this.accountForm.value.contnum;
      return new Promise(async resolve => {
        let body = {
          action : 'addAcc',          
          uid: this.uid,   
          uname: this.accountForm.value.uname,  
          upass: this.accountForm.value.upass,
          usertype: this.accountForm.value.usertype,
          fname: this.accountForm.value.fname,
          contnum: contact,
          address: this.accountForm.value.address,
          lname: this.accountForm.value.lname,
          bdate: bdate = format(new Date(bdate), "yyyy-MM-dd"),
          gender: this.accountForm.value.gender,
          email: this.accountForm.value.email
        };
        console.log('body: ',body);
        this.postPvdr.postData(body, 'proses-api.php').subscribe(async data => {
          var alertmsg = data.msg;
          if(data.success){
            this.apiwatcher.loadingDismiss();
            this.router.navigate(['/accounts']);
            const toast = await this.toastCtrl.create({
              message: 'Account Successfully Added',
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
        },async err => {
          console.log('message: ', err);
        });
      });
    }
  }

}
