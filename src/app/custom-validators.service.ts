import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PostProvider } from '../providers/post-provider';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorsService {

	constructor(
		private postPvdr: PostProvider
  	){}


}
