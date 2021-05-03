import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-view-acc',
  templateUrl: './view-acc.page.html',
  styleUrls: ['./view-acc.page.scss'],
})
export class ViewAccPage implements OnInit {

  anggota: any;

  userid: string;
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
    private storage: Storage  
  ) 
  { }

  ionViewWillEnter(){
      this.storage.get('session_storage').then((res)=>{
        this.anggota = res;
          this.userid = this.anggota.userid;
      })
  }

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

  updateAccount(accid,uname,upass,usertype,status,fname,lname,bdate,gender,email,address){
    this.router.navigate(['/upd-acc/' + accid + '/' + uname + '/' + upass + '/' + usertype + '/' + status + '/' + fname + '/' + lname + '/' + bdate + '/' + gender + '/' + email + '/' + address]);
  }
    
}
