import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule) },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },  
  { path: 'patientrecords', loadChildren: './patientrecords/patientrecords.module#PatientrecordsPageModule' },        
  { path: 'indivtreatrec', loadChildren: './indivtreatrec/indivtreatrec.module#IndivtreatrecPageModule' },
  { path: 'foracc', loadChildren: './foracc/foracc.module#ForaccPageModule' },
  { path: 'accounts', loadChildren: './accounts/accounts.module#AccountsPageModule' },
  { path: 'home-admin', loadChildren: './home-admin/home-admin.module#HomeAdminPageModule' },
  { path: 'add-itr', loadChildren: './add-itr/add-itr.module#AddItrPageModule' },
  { path: 'add-per', loadChildren: './add-per/add-per.module#AddPerPageModule' },  
  { path: 'upd-itr', loadChildren: './upd-itr/upd-itr.module#UpdItrPageModule' },
  { path: 'upd-itr/:itr_id/:fullname/:address/:family_serial_no/:age/:mode_transaction/:blood_pressure/:height/:temperature/:weight/:date_consultation/:time_consultation/:name_of_attending/:nature_of_visit/:referred_from/:referred_to/:reason_of_referral/:referred_by/:name_health_careprovider/:chief_complaints/:diagnosis/:performed_lab_test/:medication/:lab_findings', loadChildren: './upd-itr/upd-itr.module#UpdItrPageModule' },
  { path: 'view-itr', loadChildren: './view-itr/view-itr.module#ViewItrPageModule' },
  { path: 'view-itr/:itr_id/:fullname/:address/:family_serial_no/:age/:mode_transaction/:blood_pressure/:height/:temperature/:weight/:date_consultation/:time_consultation/:name_of_attending/:nature_of_visit/:referred_from/:referred_to/:reason_of_referral/:referred_by/:name_health_careprovider/:chief_complaints/:diagnosis/:performed_lab_test/:medication/:lab_findings', loadChildren: './view-itr/view-itr.module#ViewItrPageModule' },
  { path: 'upd-per', loadChildren: './upd-per/upd-per.module#UpdPerPageModule' },
  { path: 'upd-per/:pe_id/:family_serial_no/:lname/:fname/:mname/:suffix/:sex/:b_place/:b_date/:bloodtype/:civil_stat/:spouse_name/:educ_attainment/:employ_status/:fam_position/:patient_id/:home_no/:street/:barangay/:city/:province/:mothers_name/:contact_no/:dswdnhts/:facility_no/:ph_member/:ph_no/:member_category', loadChildren: './upd-per/upd-per.module#UpdPerPageModule' },
  { path: 'view-per', loadChildren: './view-per/view-per.module#ViewPerPageModule' },
  { path: 'view-per/:pe_id/:family_serial_no/:lname/:fname/:mname/:suffix/:sex/:b_place/:b_date/:bloodtype/:civil_stat/:spouse_name/:educ_attainment/:employ_status/:fam_position/:patient_id/:home_no/:street/:barangay/:city/:province/:mothers_name/:contact_no/:dswdnhts/:facility_no/:ph_member/:ph_no/:member_category', loadChildren: './view-per/view-per.module#ViewPerPageModule' },
  { path: 'activity', loadChildren: './activity/activity.module#ActivityPageModule' },
  { path: 'add-act', loadChildren: './add-act/add-act.module#AddActPageModule' },
  { path: 'upd-act', loadChildren: './upd-act/upd-act.module#UpdActPageModule' },
  { path: 'upd-act/:act_id/:name/:description/:actdate/:status', loadChildren: './upd-act/upd-act.module#UpdActPageModule' },  
  { path: 'view-act', loadChildren: './view-act/view-act.module#ViewActPageModule' },
  { path: 'view-act/:act_id/:name/:description/:actdate/:status', loadChildren: './view-act/view-act.module#ViewActPageModule' },  
  { path: 'add-acc', loadChildren: './add-acc/add-acc.module#AddAccPageModule' },
  { path: 'upd-acc', loadChildren: './upd-acc/upd-acc.module#UpdAccPageModule' },
  { path: 'upd-acc/:accid/:uname/:upass/:usertype/:status/:fname/:lname/:bdate/:gender/:email/:address', loadChildren: './upd-acc/upd-acc.module#UpdAccPageModule' },  
  { path: 'view-acc', loadChildren: './view-acc/view-acc.module#ViewAccPageModule' },
  { path: 'view-acc/:accid/:uname/:upass/:usertype/:status/:fname/:lname/:bdate/:gender/:email/:address', loadChildren: './view-acc/view-acc.module#ViewAccPageModule' },
  { path: 'view-act-all', loadChildren: './view-act-all/view-act-all.module#ViewActAllPageModule' },
  { path: 'view-act-all/:act_id/:name/:description/:actdate/:status', loadChildren: './view-act-all/view-act-all.module#ViewActAllPageModule' }, 
  { path: 'activity-all', loadChildren: './activity-all/activity-all.module#ActivityAllPageModule' },
  { path: 'con-otp', loadChildren: './con-otp/con-otp.module#ConOtpPageModule' }
   
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
