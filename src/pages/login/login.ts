import { Component } from '@angular/core';
//import { Splashscreen } from 'ionic-native';
import {NavController, AlertController, Loading, LoadingController} from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

//import { MainPage } from '../../pages/pages';
import { ListMasterPage } from '../../pages/list-master/list-master';
import { Auth } from '../../providers/auth';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  loading: Loading;
  account: {username: string, password: string, csrf: string} = {
    //email: 'test@example.com',
    username: 'you',
    password: '',
    csrf: 'csrf'
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
              public auth: Auth,
              //public toastCtrl: ToastController,
              public translateService: TranslateService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    });

    //Splashscreen.hide();

    this.verify_token();
    this.account.username = auth.currentUser.name;
    this.account.password = auth.currentUser.password;
  }

  //ngOnInit() {
  //    // reset login status
  //    this.auth.logout();
  //}

  private verify_token() {
    this.showLoading();
    this.auth.verify_session().subscribe(allowed => {
      if (allowed) {
        setTimeout(() => {
          //Splashscreen.hide();
          this.loading.dismiss();
          this.navCtrl.setRoot(ListMasterPage);
        });
      } else {
        //this.showError("Access Denied");    no reason to show error - just show the login screen (don't nav to main-page)
        this.showError();
      }
    },
    error => {
      console.log('loading login error: ' + error);
      this.showError(error);
    });
  }

  public login() {
    this.showLoading()
    this.auth.login(this.account).subscribe(allowed => {
      if (allowed) {
        setTimeout(() => {
          //Splashscreen.hide();
          this.loading.dismiss();
          this.navCtrl.setRoot(ListMasterPage);
        });
      } else {
        this.showError("Bad username/password");
      }
    },
    error => {
      this.showError(error);
    });

/*
    this.user.getcsrf().subscribe((resp) => {


      console.log('resp1', resp)
      let rx = /csrfmiddlewaretoken' value='(.*)'.*\/>/g;
      let arr = rx.exec(resp.text());
      console.log('CSRF:', arr[1]);
      this.account.csrf = arr[1];


      this.user.login(this.account).subscribe((resp) => {
        console.log('resp2', resp)










        this.navCtrl.push(ListMasterPage);
        //this.navCtrl.push(MainPage);
      }, (err) => {
        console.error('login error', err)
        this.navCtrl.push(LoginPage);
        // Unable to log in
        let toast = this.toastCtrl.create({
          message: this.loginErrorString,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });


    }, (err) => {
      console.error('csrf error', err)
      this.navCtrl.push(LoginPage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
*/

  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  showError(text?: string) {
    setTimeout(() => {
      this.loading.dismiss();
    });

    if (!text)
      return;

    let alert = this.alertCtrl.create({
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
}
