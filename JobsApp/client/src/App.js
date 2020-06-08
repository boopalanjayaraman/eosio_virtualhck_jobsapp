import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch  } from "react-router-dom";
import './App.css';

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./layouts/Navbar";
import Landing from "./layouts/Landing";
import Login from "./views/Login"
import Register from "./views/Register"

import PrivateRoute from "./views/private-route/privateRoute";
import Dashboard from "./views/dashboard/dashboard";
import CreateJob from "./views/jobs/CreateJob";
import ViewJob from "./views/jobs/ViewJob";
import TestContract from "./views/jobs/TestJobContract";
import BrowseJobs from "./views/jobs/BrowseJobs";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {
  render(){

    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
                <Route exact path="/" component={Landing} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Switch>
                  <PrivateRoute exact path="/dashboard" component={Dashboard} />
                  <PrivateRoute exact path="/createJob" component={CreateJob} />
                  <PrivateRoute exact path="/viewJob" component={ViewJob} />
                  <PrivateRoute exact path="/testJobContract" component={TestContract} />
                  <PrivateRoute exact path="/browseJobs" component={BrowseJobs} />
                </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
  
}

export default App;
