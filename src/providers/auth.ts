import { Injectable } from '@angular/core';
import { Http, URLSearchParams} from '@angular/http';
import { Observable } from "rxjs";
import { User } from "../models/user";
import { Api } from "./api";


/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class Auth {
  currentUser: User;    //TODO: Change to observable so that api class can deal with token changes

  constructor(public http: Http, public api: Api) {
    console.log('auth constructor - OK?');
    this.currentUser = User.load();

    console.log('name:');
    console.log(this.currentUser.name);
  }

  /**
   * Send a GET request to our login endpoint to obtain the csrf cookie.
   */
/*
  getcsrf() {
		//let options = new RequestOptions({
		//	withCredentials: true
		//});
    let seq = this.api.get('login/', '').share();


    console.log('OK000');
    seq
      //.map(res => res.json())
      .map((res: any) => res)
      .subscribe((res: any) => {
        console.log('res',res);
        // If the API returned a successful response, mark the user as logged in
        if(res.status == 200) {
          //let rx = /csrfmiddlewaretoken' value='(.*)'.*\/>/g;
          //let arr = rx.exec(res._body);
          //console.log(arr[1]);
        } else {
          console.error('ERROR !200');
        }
      }, err => {
        console.error('ERROR 22222222222', err);
      }
      );
    return seq;
  }
*/

  token_api(api: string, body: URLSearchParams): Observable<boolean> {
    return this.http.post(this.api.url + api + '/', body)
      .map(res => res.json())
      .map(res => {
        console.log('Result:', res);
        // login successful if there's a jwt token in the response
        let token = res.token;
        if (token) {
            // set token property
            this.currentUser.token = token;
            this.api.token = token;

            //console.log('SETTING WEBSOCKETTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT');
            //Ng2DjangoChannelsDemultiplexingModule.forRoot({websocket_url: 'ws://XXXXXhome.nadalia.com/stream'});

            // return true to indicate successful login
            return true;
        } else {
            // return false to indicate failed login
            return false;
        }
      })
      .catch(error => {
        console.log('loading login error: ' + error);
        if (error.status == 0)
          return Observable.throw('Cannot access server');
        return Observable.of(false);
      });
  }

  login(credentials: any): Observable<boolean> {
    if (!credentials.username || !credentials.password) {
      return Observable.throw("Please enter credentials");
    }

    console.log('credentials.username:', credentials.username);
    this.currentUser.name = credentials.username;
    this.currentUser.password = credentials.password;

    let data = new URLSearchParams();
    data.append('username', credentials.username);
    data.append('password', credentials.password);

    return this.token_api('api-token-auth', data);
/*

    return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        let access = (credentials.password === "pass" && credentials.username === "name");
        console.log('LEEEEEEEEEEEEEEEEEEEEEEEEEEEEEET:', access);
        this.currentUser = new User(credentials.username);
        observer.next(access);
        observer.complete();
      });
    }
*/

/*    let headers = new Headers({
			'Content-Type': 'application/x-www-form-urlencoded'
		});
		let options = new RequestOptions({
			headers: headers
		});

    let body = 'username=' + credentials.username + '&password=' + credentials.password + '&csrfmiddlewaretoken=' + credentials.csrf;
    //let body = 'username=nadav&password=das&csrfmiddlewaretoken=' + accountInfo.csrf;
    let seq = this.api.post('login/', body, options).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        if(res.status == 'success') {
          this._loggedIn(res);
        } else {
        }
      }, err => {
        console.error('ERROR', err);
      });



    return seq;
*/
  }

  verify_session(): Observable<boolean> {
    console.log('verifying_session');
    return this.refresh_token();
  }

  refresh_token(): Observable<boolean> {
    console.log('refreshing_session');
    if (!this.currentUser.token) {
      this.currentUser.token = null;
      console.log('refresh Token failed');

      return Observable.of(false);
      //return Observable.throw('Please reenter credentials');
    }

    let data = new URLSearchParams();
    data.append('token', this.currentUser.token);
    return this.token_api('api-token-verify', data);
  }
  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        if(res.status == 'success') {
          //this._loggedIn(res);
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this.currentUser.token = null;
    this.api.token = null;
    //this.currentUser = null;
    //localStorage.removeItem('currentUser');
  }
}
