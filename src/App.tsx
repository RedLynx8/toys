import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';
import logo from './logo.svg';
import { Product } from './rxjs-test/rxjs-test';

function Index(): JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Greatest React App for Toys-crossing.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

function AppRouter(): JSX.Element {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/products/1">RxJS</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" exact component={Index}/>
        <Route path="/products/:id" component={Product}/>
      </div>
    </Router>
  );
}

export default AppRouter;
