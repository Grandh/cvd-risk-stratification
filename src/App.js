import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import MainPage from './Components/MainPage.js'
import 'antd/dist/antd.css'
import './App.css';

class App extends Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' component={MainPage}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
