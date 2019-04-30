/**
 * A generic model that our Master-Detail pages list, create, and delete.
 *
 * Change "Item" to the noun your app will use. For example, a "Contact," or a
 * "Customer," or a "Animal," or something like that.
 *
 * The Items service manages creating instances of Item, so go ahead and rename
 * that something that fits your app as well.
 */
export class User {
  private _name: string;
  private _password: string;
  private _token: string;

  constructor() {
  }

  //constructor(name?: string, token?: string) {
    //this.name = name;
    //this.token = token;
  //}

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
    this.save();
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
    this.save();
  }

  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
    this.save();
  }

  static load() {
    let user = new User();
    let data = JSON.parse(localStorage.getItem('currentUser'));
    //console.log('loaded user data:', data);
    if (data)
    {
      user._name = data['_name'];
      user._password = data['_password'];
      user._token = data['_token'];
      console.log('loaded user:', user.name, user.token);
    }

    return user;
  }

  save() {
    localStorage.setItem('currentUser', JSON.stringify(this));
  }
}
