import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
//import { SplashScreen } from '@ionic-native/splash-screen';
//import { StatusBar } from '@ionic-native/status-bar';

import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ApisProvider } from '../providers/apis/apis';

import { DirectivesModule } from '../directives/directives.module';


@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    DirectivesModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    //StatusBar,
    //SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApisProvider
  ]
})
export class AppModule {}
