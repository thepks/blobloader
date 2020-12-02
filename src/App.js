import React, { useState, useEffect, Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Body from './components/body';

import Auth from './services/auth';


// function App(props) {

//   let retry = 0;
//   let auth;
 
//   const [loggedIn, setLoggedIn] = useState(false);

//   useEffect(() => {
//      auth = new Auth(props.authProvider, props.api, setLoggedInState);
//   },[]);

// function setLoggedInState(val) {
//   console.log('Logging in: ' + val);
//   retry = 0;
//   testLoggedIn();
// }

// function testLoggedIn() {
//   auth.isLoggedIn()
//     .then((res) => {
//       if (res) {
//         setLoggedIn(true);
//       } else {
//         retry++;
//         if ( retry <= 10 ) {
//         console.log('Login is delayed, retry in 1s');
//         setTimeout(testLoggedIn, 1000);
//         }
//       }
//   });
// }


//   return (
//     <div className="App">
//       <Body auth={auth} loggedIn={loggedIn}/>
//     </div>
//   );
// }

// export default App;





class App extends Component {


  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      api: props.api,
      authProvider: props.auth
    };

    console.log(this.state.api);
    this.retry = 0;
    this.setLoggedIn = this.setLoggedIn.bind(this);

    //this.api.login();

    this.testLoggedIn = this.testLoggedIn.bind(this);

    console.log('about to start api');
    this.auth = new Auth(this.state.authProvider, this.state.api, this.setLoggedIn);
    console.log(this.auth);

  }

  componentDidMount() {
    
  }


  setLoggedIn(val) {
    console.log('Logging in: ' + val);
    this.retry = 0;
    this.testLoggedIn();
  }

  testLoggedIn() {
    this.auth.isLoggedIn()
      .then((res) => {
        if (res) {
          this.setState({ loggedIn: res });
        } else {
          this.retry++;
          if ( this.retry <= 10 ) {
          console.log('Login is delayed, retry in 1s');
          setTimeout(this.testLoggedIn, 1000);
          }
        }
    });
  }

 
 




  render() {
    return (
          <div className="App">
            <Body auth={this.auth} loggedIn={this.state.loggedIn}/>
          </div>
        );


  }

}


export default App;
