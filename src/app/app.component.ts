import { Component } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { PostProvider } from '../providers/post-provider';
import { Events } from '@ionic/angular';

import { HomePage } from './home/home.page';
import { HomeAdminPage } from './home-admin/home-admin.page';
import { ActivityPage } from './activity/activity.page';
import { AccountsPage } from './accounts/accounts.page';
import { ProfilePage } from './profile/profile.page';
import { ActivityAllPage } from './activity-all/activity-all.page';
import { PatientrecordsPage } from './patientrecords/patientrecords.page';
import { IndivtreatrecPage } from './indivtreatrec/indivtreatrec.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {
  
  open: boolean;
  
  anggota: any;
  usertype: string;

  automaticClose = false;
  selectedPath = '';
  
  appPages = [];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private postPvdr: PostProvider,
    private router: Router,
    private statusBar: StatusBar,
    public events: Events,
    private storage: Storage     
  ) {

    this.initializeApp();    
    events.subscribe('user: isAdmin', (admin, time) =>{
      this.appPages = [
        {
          title: 'Home',
          icon: 'home',
          open: false,     
          component: HomeAdminPage ,
          url: '/home-admin',
          children: null
        },
        {
          title: 'Profile',
          icon: 'person',
          open: false,                
          component: ProfilePage,      
          url: '/profile',
          children: null     
        },
        {
          title: 'Accounts',
          icon: 'person',
          open: false,
          component: AccountsPage,      
          url: '/accounts',
          children: null     
        },
        {
          title: 'Activity',
          icon: 'list',
          open: false,                
          component: ActivityPage,      
          url: '/activity',
          children: null     
        }
      ];
      this.appPages[0].open = false;
    });

    events.subscribe('user: isUser', (user, time) => {
      this.appPages = [
        {
          title: 'Home',
          icon: 'home',
          open: false,          
          component: HomePage,
          url: '/home',
          children: null
        },
        {
          title: 'Profile',
          icon: 'person',
          open: false,                
          component: ProfilePage,      
          url: '/profile',
          children: null     
        },
        {
          title: 'Activity',
          icon: 'list',
          open: false,                
          component: ActivityAllPage,      
          url: '/activity-all',
          children: null     
        },
        {
          title: 'Records',
          icon: 'paper',
          open: false,    
          component: '',     
          children: [
            { title: 'Enrollment Record', open: false, icon: 'person-add', component: PatientrecordsPage, url: '/patientrecords', children: null},
            { title: 'Treatment Record', open: false, icon: 'create', component: IndivtreatrecPage, url: '/indivtreatrec', children: null }        
          ]      
        }
      ];
      this.appPages[0].open = true; 
    });

    events.subscribe('user: isLoggedOut', (user, time) => {
      this.appPages = [];
    });

    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    });
  }

initializeApp() {
  this.platform.ready().then(() => {
    this.statusBar.styleDefault();
    this.splashScreen.hide();
  });
}

toggleSection(index){
  this.appPages[index].open = !this.appPages[index].open;
  if(this.automaticClose && this.appPages[index].open){
    this.appPages.filter((item, itemIndex) => itemIndex != index).map(item => item.open = false);
  }
}

}
