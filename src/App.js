import React from 'react';
import LandingPage from './components/landing-page';
import {Route, withRouter} from 'react-router-dom';
import CreateLesson from './components/create-lesson';
import Navbar from './components/navbar';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/create-lesson" component={CreateLesson} />
    </div>
  );
}

export default withRouter(App);
