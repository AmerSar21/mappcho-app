import { Injectable } from '@angular/core'; 
import { Router } from '@angular/router';
import { ToastController, MenuController, AlertController, Events, LoadingController } from '@ionic/angular';
import { format } from 'date-fns';
import { PostProvider } from '../providers/post-provider';
import { Plugins } from "@capacitor/core";
import { FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})

export class ApiWatcherService {
  
  perlists: any = [];
  itrlists: any = [];
  currentDate: string = "";
  templist: any = [];
  isLoading = false;

  constructor(
    private router: Router,
    private postPvdr: PostProvider,
    public toastCtrl: ToastController,
    public alertController: AlertController,
    public menuCtrl: MenuController, 
    public loadingController: LoadingController,
    public events: Events,  
    private apiwatcher: ApiWatcherService,   
    private ionStorage: Storage 
    ) { 
  }

  setPerList(perlist){
    this.perlists = perlist;
    return new Promise(resolve => {
      try{
        let body = {
          action : 'insertPer',
          perArray : this.perlists,
          cDate: this.currentDate = format(new Date(), "yyyy-MM-dd")
        };
        this.postPvdr.postData(body, 'proses-api.php').subscribe(data => {
          if(data.success){
            console.log("Transfer Successful");
          }else{
            console.log("failed to Transfer");
          }
        });
      }catch(e){
        console.log('Error Message: ',e);
      }
    }); 
  }
  
  getTempPerList(fullname){
    const fullName = fullname;    
    return new Promise(resolve => {
      try{
        let body = {
          action : 'getTempPer',
          added_by : fullName          
        };
        console.log(body);
        this.postPvdr.postData(body, 'proses-api.php').subscribe(data => {
          if(data.result){
            resolve(data.result);
           console.log("Temporary Array: ", this.templist);
          }else{
            console.log("failed");
          }
        });
      }catch(e){
        console.log('Error message: ',e);
      }
    });
  }

  getTempItrList(fullname){
    const fullName = fullname;
    return new Promise(resolve => {
      try{
        let body = {
          action : 'getTempItr',
          added_by : fullName   
        };
        console.log(body);
        this.postPvdr.postData(body, 'proses-api.php').subscribe(data => {
          if(data.result){
            resolve(data.result);
            console.log("Temporary Array", this.templist);
          }else{
            console.log("failed");
          }
        });
      }catch(e){
        console.log('Error Message: ',e);
      }
    });
  }

  checkUsername(uname): any {
    return new Promise(resolve => {
      try{
        let body = {
          action : 'checkAcc',
          uname: uname
        };
        // console.log('post body: ', body);
        this.postPvdr.postData(body, 'proses-api.php').subscribe(async data => {
          if(data.success){ 
            await resolve(data.success);
          }else{
            await resolve(data.success);            
          }
        },err => {
          console.log('Message Error: ',err);
        });  
      }catch(e){
        console.log('Error Message: ',e);
      }
    });
  }

  clearPerList(){
    this.perlists = [];
  }

  clearTempList(){
    this.templist = [];
  }

  setItrList(itrlist){
    this.itrlists = itrlist;
    return new Promise(resolve => {
      try{
        let body = {
          action : 'insertItr',
          itrArray : this.itrlists,
          cDate: this.currentDate = format(new Date(), "yyyy-MM-dd")
        };
        this.postPvdr.postData(body, 'proses-api.php').subscribe(data => {
          if(data.success){
            console.log("Transfer Successful");
          }else{
            console.log("failed to transfer");
          }
        });
      }catch(e){
        console.log('Error Message: ',e);
      }
    }); 
  }

  getItrlist(){
    console.log('Current TEMP ITR LIST: ', this.itrlists);
    return this.itrlists;
  }

  clearItrList(){
    this.itrlists = [];
  }

  async loadingPresent() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: 'loading contents ...',
      spinner: 'circles',
      cssClass: 'my-loading-class'
    }).then(a => {
      a.present().then(() => {
        console.log('loading presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort loading'));
        }
      });
    });
  } 

  async loadingPres2() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: '',
      spinner: 'circles',
      cssClass: 'my-loading-class'
    }).then(a => {
      a.present().then(() => {
        console.log('loading presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort loading'));
        }
      });
    });
  }

  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('loading dismissed'));
  }  
  
}
