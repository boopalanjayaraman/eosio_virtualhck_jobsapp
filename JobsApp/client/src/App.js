import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./layouts/Navbar";
import Landing from "./layouts/Landing";
import Login from "./views/Login"
import Register from "./views/Register"

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
              <Route exact path="/" component={Landing} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
