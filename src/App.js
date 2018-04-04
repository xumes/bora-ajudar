import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import logo from './logo.svg';
import './App.css';
import Header from './Header';
import Home from './Home';
import Footer from './Footer'
import Sobre from './Sobre';
import Contato from './Contato';
import Campanhas from './Campanhas';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div className="App">
            <Header />
            <Route path='/' exact component={Home} />
            <Route path='/sobre' component={Sobre} />
            <Route path='/campanhas' component={Campanhas} />
            <Route path="/contato" component={Contato} />
            <Footer />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
