import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { PostProvider } from '../providers/post-provider';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SMS } from '@ionic-native/sms/ngx';


@NgModule({
  declarations: [
  AppComponent
  ],
  entryComponents: [],
  imports: [
  HttpModule,
  HttpClientModule,
  BrowserModule, 
  IonicModule.forRoot(),
  IonicStorageModule.forRoot(), 
  AppRoutingModule
  ],
  providers: [
    StatusBar,
    PostProvider,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SMS
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
