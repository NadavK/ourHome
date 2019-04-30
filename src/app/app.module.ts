import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { AppVersion } from '@ionic-native/app-version';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { WelcomePage } from '../pages/welcome/welcome';
import { MyApp } from './app.component';

import { ContentPage } from '../pages/content/content';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/login/logout';
import { TabsPage } from '../pages/tabs/tabs';
import { ListMasterPage } from '../pages/list-master/list-master';
import { ItemCreatePage } from '../pages/item-create/item-create';
import { ItemDetailPage } from '../pages/item-detail/item-detail';
import { OnetimeScheduleDetailPage } from '../pages/onetimeschedule-detail/onetimeschedule-detail';
import { MenuPage } from '../pages/menu/menu';
import { SettingsPage } from '../pages/settings/settings';
import { SearchPage } from '../pages/search/search';

import { Auth } from '../providers/auth';
import { Api } from '../providers/api';
import { Settings } from '../providers/settings';
import { IOs } from '../providers/ios';
import { OnetimeSchedules } from '../providers/onetime-schedules';
import { OneTimeScheduleCreatePage } from "../pages/onetimeschedule-create/onetimeschedule-create";

import { CalendarModule } from 'angular-calendar';
import { DragulaModule } from 'ng2-dragula';
import {DatePicker} from "@ionic-native/date-picker";

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: Http) {
  //return new TranslateHttpLoader(http, './assets/i18n', '.json');
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
   //
   // The Settings provider takes a set of default settings for your app.
   //
   // You can add new settings options at any time. Once the settings are saved,
   // these values will not overwrite the saved values (this can be done manually if desired).
   //
  return new Settings(storage, {
    production: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'home.nadalia.com'
  });
}


/**
 * The Pages array lists all of the pages we want to use in our app.
 * We then take these pages and inject them into our NgModule so Angular
 * can find them. As you add and remove pages, make sure to keep this list up to date.
 */
let pages = [
  MyApp,
  ContentPage,
  LoginPage,
  LogoutPage,
  TabsPage,
  ListMasterPage,
  ItemDetailPage,
  OnetimeScheduleDetailPage,
  ItemCreatePage,
  OneTimeScheduleCreatePage,
  MenuPage,
  SettingsPage,
  WelcomePage,
  SearchPage
];

export function declarations() {
  return pages;
}

export function entryComponents() {
  return pages;
}

export function providers() {
  return [
    StatusBar, // Newly add for ionic 3
    SplashScreen, // Newly add for ionic 3
    DatePicker,
    AppVersion,
    Auth,
    Api,
    IOs,
    OnetimeSchedules,
    { provide: Settings, useFactory: provideSettings, deps: [ Storage ] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}

@NgModule({
  declarations: declarations(),
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    DragulaModule
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: providers()
})
export class AppModule {}
