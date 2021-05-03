import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { format } from 'date-fns';
import { ApiWatcherService } from '../api-watcher.service';

@Component({
  selector: 'app-upd-act',
  templateUrl: './upd-act.page.html',
  styleUrls: ['./upd-act.page.scss'],
})
export class UpdActPage implements OnInit {

  userid: string;
  anggota: any;

  act_id: number;
  name: string = "";
  actdate: string = "";
  description: string = "";
  status: string = "";

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
      this.act_id = data.act_id;      
      this.name = data.name;
    	this.description = data.description;
    	this.actdate = data.actdate;
    	this.status = data.status;
	  });
  }

  ionViewWillEnter(){
      this.storage.get('session_storage').then((res)=>{
        this.anggota = res;
          this.userid = this.anggota.userid;
      })
  }

  checkDateID(){
    return new Promise(resolve => {
      try{
        if(this.actdate != ""){
            let body = {
              actdate: this.actdate = format(new Date(this.actdate), "yyyy-MM-dd"), 
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
          } 
      }catch(e){
        console.log('Error Message: ',e);
      }
    });
  }

  updateActivity(){
    this.apiwatcher.loadingPres2();
  	return new Promise(resolve => {
      try{
        let body = {
          action : 'updateAct',
          act_id: this.act_id,
          name: this.name,
          description: this.description,
          actdate: this.actdate = format(new Date(this.actdate), "yyyy-MM-dd"),
          status: this.status
        };

        this.postPvdr.postData(body, 'proses-api.php').subscribe(async data => {
          var alertmsg = data.msg;
          if(data.success){
            this.apiwatcher.loadingDismiss();
            this.router.navigate(['/activity']);
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
        });
      }catch(e){
        this.apiwatcher.loadingDismiss();        
        console.log('Error Message: ',e);
      }
    });
  }
}
