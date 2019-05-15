import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {
  BrowserRouter
} from 'react-router-dom';
// sj
// import $ from 'jquery';
// import Popper from 'popper.js';
// import react-bootstrap from 'react-bootstrap.js';
//
ReactDOM.render(
  <BrowserRouter >
    <App / >
  </BrowserRouter>,

  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
