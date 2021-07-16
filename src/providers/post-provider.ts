import { Injectable } from '@angular/core'; 
import { Http, Headers, RequestOptions } from '@angular/http'; 
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Injectable()
export class PostProvider{
	
	server: string = "http://localhost/mappcho/server_api/";
	re_server: string = "https://mcho-ims.herokuapp.com/server_api/";
	web_server: string ="https://mapp-cho.000webhostapp.com/";
	// re_server: string = "https://mapp-cho-server.herokuapp.com/server_api/";

	constructor(
		public http: Http,
		){
	}

	postData(body, file){
		try{
			let type = "application/json; charset=UTF-8";
			let headers = new Headers({ 'Content-Type': type });
			let options = new RequestOptions({ headers: headers });

			return this.http.post(this.re_server + file, JSON.stringify(body), options)	
			.map(res => res.json());
		}catch(e){
			console.log('Error Info: ', e);
		}
	}

}