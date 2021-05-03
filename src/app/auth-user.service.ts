import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class AuthUserService {

  role: number;

  constructor() { }

  setUserRole(_usertype): Promise<boolean> {
    return new Promise((resolve,reject) => {
      if(_usertype == 'Admin'){
        this.role = 0;
        resolve(true);
      }else if(_usertype == 'User'){
        this.role = 1;
        resolve(true);
      }else{
        reject(false);
      }
    });
  }

  logOut(){
    this.role = null;
  }

  isAdmin(){
    return this.role === 0;
  }

}
