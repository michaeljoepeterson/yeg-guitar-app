import React from 'react';
import LandingPage from './components/landing-page';
import {Route, withRouter} from 'react-router-dom';
import CreateAdmin from './components/create-admin';
import CreateLesson from './components/create-lesson';
import Navbar from './components/navbar';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/create-lesson" render={(props) => (
          <CreateLesson key={props.match.params.pageid} {...props} />)
        } />
        <Route exact path="/create-admin" component={CreateAdmin} />
    </div>
  );
}

export default withRouter(App);
