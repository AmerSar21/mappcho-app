import { Injectable } from '@angular/core';

export interface User { 
	roleName: string;
	role: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 	
  currentUser: User;
	userRole: number;	
  constructor() { }

  setUserRole(name: string) {
  		if(name == 'admin'){
			this.currentUser = {
				roleName: name,
				role: 0
			};
			this.userRole = 0;
		}else{
			this.currentUser = {
				roleName: name,
				role: 1
			};
			this.userRole = 1;
		}
  }

  isLoggedIn(){
  	return this.currentUser != null;
  }

  logout(){
  	this.currentUser = null;
  }

  isAdmin(){
  	return this.currentUser.role = 0;
  }

  isUserAdmin(){
  	return this.userRole;
  }

}
