import { Injectable } from '@angular/core';
import axios from 'axios'; 

@Injectable()
export class AxiosProvider{
	
	re_server: string = "https://mcho-ims.herokuapp.com/server_api/";

	constructor(
        ){
	}

	postData(body, file){
		try{
			return axios.post(this.re_server + file, JSON.stringify(body));
		}catch(e){
			console.log('Error Info: ', e);
		}
	}

}