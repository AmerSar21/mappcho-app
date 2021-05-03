import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-view-act',
  templateUrl: './view-act.page.html',
  styleUrls: ['./view-act.page.scss'],
})
export class ViewActPage implements OnInit {

  act_id: number;
  name: string;
  description: string;
  actdate: string;
  status: string;

  constructor(
  	private postPvdr: PostProvider,
  	private router: Router,
    private actRoute: ActivatedRoute,
    private storage: Storage
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
  
  updateActivity(act_id, name, description, actdate, status){
    this.router.navigate(['/upd-act/' + act_id + '/' + name + '/' + description + '/' + actdate + '/' + status]);
  }

}
