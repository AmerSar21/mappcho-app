import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { IndivtreatrecPage } from './indivtreatrec.page';

const routes: Routes = [
  {
    path: '',
    component: IndivtreatrecPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [IndivtreatrecPage]
})
export class IndivtreatrecPageModule {}
