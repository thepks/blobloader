import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';



import env from "@beam-australia/react-env";

import * as msal from "@azure/msal-browser";

const tenant = env("TENANT");
const client_id = env("CLIENT_ID");
const target_client = env("TARGET_CLIENT_ID");
const CLIENTNAME = env("CLIENTNAME");  //https://gpnotes.azureedge.net/
const SERVERNAME = env("SERVERNAME");
const ISSUER = env("AUTHORITY");
const BLOBAPI = env("BLOBAPI");


const config = {
  auth: {
    clientId: client_id,
    authority: 'https://login.microsoftonline.com/' + tenant,
    validateAuthority: false,
    // postLogoutRedirectUri: 'https://' + SITENAME + '/',
    postLogoutRedirectUri: CLIENTNAME,
    redirectUri: CLIENTNAME,
    
    audience: "https://" + tenant + "/" + target_client
  },
  asyncPopups: true,
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
    
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case msal.LogLevel.Error:
            console.error(message);
            return;
          case msal.LogLevel.Info:
            console.info(message);
            return;
          case msal.LogLevel.Verbose:
            console.debug(message);
            return;
          case msal.LogLevel.Warning:
            console.warn(message);
            return;
        }
      }, level: msal.LogLevel.Verbose,
      piiLoggingEnabled: true,
    }
  },
  windowHashTimeout: 60000,
  iframeHashTimeout: 6000,
  loadFrameTimeout: 0

}

const authProvider = new msal.PublicClientApplication(config);

console.log(BLOBAPI);


ReactDOM.render(
  <React.StrictMode>
    <App auth={authProvider} api={BLOBAPI}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
