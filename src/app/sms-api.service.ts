import { Injectable } from '@angular/core'; 
import { Http, Headers, RequestOptions } from '@angular/http'; 
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SmsApiService {

	local_server: string = "http://localhost/api/send-sms";
	online_server: string = "https://sms-server-app.herokuapp.com/api/send-sms";

	constructor(
		public http: Http,
	    public toastCtrl: ToastController,
    	private storage: Storage,
    ){}

	async sendOtp(phoneNumber){
		const generateCode = await this.generateCode();	

		const smsOptions = {
			phoneNumber: "+63" + phoneNumber.toString(),
			generatedCode: generateCode.toString()
		}
		try{
			let type = "application/json; charset=UTF-8";
			let headers = new Headers({ 'Content-Type': type });
			let options = new RequestOptions({ headers: headers });

			this.http.post(this.online_server, smsOptions, options).toPromise().then(async res => {
				const response = await res['_body'];
				this.storage.set('generateCode', response);	
				console.log('Success: ', response);					
			}).catch(err => {
				console.log('Message Error: ', err);
			});
		}catch(e){
			console.log('Error Info: ', e);
		}
	}

	async generateCode() {
      const generatedCode = await Math.floor(100000 + Math.random() * 900000);
      return generatedCode;
    }

}
