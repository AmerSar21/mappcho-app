import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { format } from 'date-fns';
import { ApiWatcherService } from '../api-watcher.service';

@Component({
  selector: 'app-add-per',
  templateUrl: './add-per.page.html',
  styleUrls: ['./add-per.page.scss'],
})
export class AddPerPage implements OnInit {
  
  userid: string;
  uid: string = "";  
  pe_id: number;
  anggota: any;

  fcode: string = "";
  lname: string = "";
  fname: string = "";
  mname: string = "";
  suffix: string = "";
  gender: string = "";
  bplace: string = "";
  bdate: string = "";
  bltype: string = "";
  cstat: string = "";
  spname: string = "";
  edatt: string = "";
  empstat: string = "";
  fampos: string = "";
  pat_id: string = "";
  homeno: string = "";
  street: string = "";
  brgy: string = "";
  city: string = "";
  prov: string = "";
  motname: string = "";
  contnum: string = "";
  nhts: string = "";
  fhno: string = "";
  phmem: string = "";
  phnum: string = "";
  ctgry: string = "";

  constructor(
	private postPvdr: PostProvider,
  	private router: Router,
    private actRoute: ActivatedRoute,
    public toastCtrl: ToastController,        
    private storage: Storage,
    private apiwatcher: ApiWatcherService 
  ) 
  { }

  ngOnInit() {
  }

  ionViewWillEnter(){
  		this.storage.get('session_storage').then((res)=>{
  			this.anggota = res;
        	this.userid = this.anggota.userid;
  		})
  }

  async createAddPer() { 
    this.apiwatcher.loadingPres2();
    if(this.bdate == '' || this.bdate == null){
      this.apiwatcher.loadingDismiss();            
      const toast = await this.toastCtrl.create({
        message: 'Please fill out all details accurately',
        duration: 2000
      }); 
      toast.present();   
    }else{
    	return new Promise(resolve => {
        try{
      		let body = {
      			action : 'addPer',
      			uid: this.uid,
      			fcode: this.fcode,
      			lname: this.lname,
      			fname: this.fname,
      			mname: this.mname,
      			suffix: this.suffix,
      			gender: this.gender,
      			bplace: this.bplace,
      			bdate: this.bdate = format(new Date(this.bdate), "yyyy-MM-dd"),
      			bltype: this.bltype,
      			cstat: this.cstat,
      			spname: this.spname,
      			edatt: this.edatt,
      			empstat: this.empstat,
      			fampos: this.fampos,
      			pat_id: this.pat_id,
      			homeno: this.homeno,
      			street: this.street,
      			brgy: this.brgy,
      			city: this.city,
      			prov: this.prov,
      			motname: this.motname,
      			contnum: this.contnum,
      			nhts: this.nhts,
      			fhno: this.fhno,
      			phmem: this.phmem,
      			phnum: this.phnum,
      			ctgry: this.ctgry
      		};
          console.log('Input Body: ', body);
      		this.postPvdr.postData(body, 'proses-api.php').subscribe(async data => {
            var alertmsg = data.msg;
            if(data.success){
              this.apiwatcher.loadingDismiss();
              this.router.navigate(['/patientrecords']);
              const toast = await this.toastCtrl.create({
                message: 'PER Successfully Added',
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

}
