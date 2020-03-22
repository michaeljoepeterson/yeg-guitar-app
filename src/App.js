import React from 'react';
import LandingPage from './components/landing-page';
import {Route, withRouter} from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={LandingPage} />
    </div>
  );
}

export default App;
