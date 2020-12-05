import env from "@beam-australia/react-env";


const SERVERNAME = env("SERVERNAME");

const loginRequest = {

  scopes: []
};

const ADMINROLE = 'Admin';

class Auth {


  loggedIn;
  adminRole;
  token;
  zumo;
  items;
  progress;
  spdocs;
  myMSALObj;
  userTenant;
  user;
  api = '';
  tell;
  logProcess;

  // 'uuid, home,area, title,status,author,lastupdate'
  constructor(authProvider, api, tellme) {

    console.log(env);

    this.myMSALObj = authProvider;
    this.loggedIn = false;
    this.adminRole = false;

    this.tell = tellme;

    this.logProcess = '';
    this.sayTrue = this.sayTrue.bind(this);

    this.api = api;

  }


  

   login() {

    this.logProcess = 'started';

    return this.myMSALObj.loginPopup(loginRequest);

  }

 getTokenPopup(request) {
    return  this.myMSALObj.acquireTokenSilent(request).catch(async (error) => {
      console.log("silent token acquisition fails. acquiring token using popup");
      // fallback to interaction when silent call fails
      return  this.myMSALObj.acquireTokenPopup(request);
    });
  }

  getLoggedInDetails(username) {
    var that = this;
    return new Promise(function (resolve, reject) {

      let currentAccounts = that.myMSALObj.getAllAccounts();

      if (currentAccounts === null || typeof (currentAccounts) === 'undefined') {
        // No user signed in
        reject('No user');
      } else if (currentAccounts.length > 1) {
        // More than one user signed in, find desired user with getAccountByUsername(username)
        console.log(currentAccounts);
        console.log('MULTIPLE ACCOUNTS');
        let a = that.myMSALObj.getAccountByUsername(username);
        that.user = a.username;
        that.username = that.user;

        resolve(true);

      } else if (currentAccounts.length === 1) {

        let accountObj = currentAccounts[0];
        console.log(JSON.stringify(currentAccounts));

        console.log(accountObj);
        that.user = accountObj.username;
        that.username = that.user;

        resolve(true);
      } else {
        reject('No user: ' + currentAccounts);
      }


    });
    //  this.username = accountObj.username;
  }

  completeLoggingOnStatus() {
    var that = this;
    return new Promise(function (resolve, reject) {
      that.loggedIn = true;
      that.logProcess = 'complete';
      setTimeout(that.sayTrue, 1500);
      resolve(true);
    });
  }

  sayTrue() {
    console.log('Settledown complete');
    this.tell(true);
  }

  async logout() {

    this.myMSALObj.logout();
    this.logProcess = '';
    this.loggedIn = false;
    this.tell(false);
  }

  getUserName() {
    var that = this;
    return new Promise(function (resolve, reject) {
      resolve(that.user);
    });

  }

  isLoggedIn() {

    var that = this;
    return new Promise(function (resolve, reject) {
      console.log(that.loggedIn);
      console.log(that.logProcess);
      console.log(that.username);
      resolve(that.loggedIn && that.logProcess !== 'started' && typeof (that.username) !== 'undefined');

    });


  }


  async get_api_token() {

    console.log(this.user);
    console.log(this.username)

    let useraccount = await this.myMSALObj.getAccountByUsername(this.username);
    const accessTokenRequest = {
      account: useraccount,
      // scopes: ["api://" + target_client + "/access_as_users"]
      //scopes: ["https://campsitefunctions.azurewebsites.net/access_as_user"],
      scopes: [this.api],
      prompt: "consent"
    }

    console.log(accessTokenRequest);

    return await this.get_token(accessTokenRequest);

  }



  async get_token(accessTokenRequest) {

    var accessTokenResponse;
    try {
      accessTokenResponse = await this.myMSALObj.acquireTokenSilent(accessTokenRequest);
      // .then(function (accessTokenResponse) {
      //   // Acquire token silent success
      //   // call API with token
      this.token = accessTokenResponse.accessToken;

      return (accessTokenResponse.accessToken);
    }
    catch (error) {
      console.log(error);
      //Acquire token silent failure, send an interactive request.
      if (error.hasOwnProperty('errorMessage') && error.errorMessage.indexOf("interactive authorization request") !== -1) {
        try {
          accessTokenResponse = await this.myMSALObj.acquireTokenPopup(accessTokenRequest);
          //.then(function (accessTokenResponse) {
          // Acquire token interactive success
          console.log(accessTokenRequest.accessToken);
          console.log(JSON.stringify(accessTokenResponse));
          return (accessTokenRequest.accessToken);

        } catch (error) {
          // Acquire token interactive failure
          console.log(error);
        };
      }
      console.log(error);
    };
  }

  async getAppServiceToken(token) {

    var body = { access_token: token };
    console.log(body);

    var resp = await fetch(SERVERNAME, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      mode: 'cors'
    });

    console.log(resp);
    var data = await resp.json();
    console.log(data);
    return data.authenticationToken;
  }

  async isAdmin() {
    let res = await this.isInRole(ADMINROLE);
    console.log(res);
    this.adminRole = res;
    return res;
  }

  async isInRole(role) {

    var loggedIn = await this.isLoggedIn();
    console.log('Logged in? :' + loggedIn);

    var that = this;

    return new Promise(async function (resolve, reject) {

      if (loggedIn) {

        var token = await that.get_api_token();


        console.log(that.roleURL + role);
        fetch(that.roleURL + "&role=" + role, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          mode: 'cors'
        }).then((resp) => resp.json())
          .then(function (data) {

            console.log(data);
            resolve(data.inRole);

          });
      } else {
        reject('Not logged In');
      }
    });

  }


}

export default Auth;