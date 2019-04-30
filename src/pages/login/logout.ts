import { Component } from '@angular/core';
import {NavController, Loading} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Auth } from '../../providers/auth';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LogoutPage {
  ///Used as a 'page' to logout and display the login page (otherwise login page automatically logs-in with the token)

  loading: Loading;
  account: {username: string, password: string, csrf: string} = {
    //email: 'test@example.com',
    username: 'you',
    password: '',
    csrf: 'csrf'
  };

  constructor(public navCtrl: NavController, public auth: Auth) {
    this.auth.logout();
    this.account.username = auth.currentUser.name;
    this.account.password = auth.currentUser.password;
    this.navCtrl.setRoot(LoginPage);
  }
}
