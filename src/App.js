import React from 'react';
import LandingPage from './components/landing-page';
import {Route, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {refreshAuthToken} from './actions/authActions';
import CreateAdmin from './components/create-admin';
import ExampleTable from './components/example-table';
import CreateLesson from './components/create-lesson';
import Navbar from './components/navbar';
import {loadAuthToken} from './local-storage';
import './App.css';

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.refreshInterval = null;
    this.minutes = 10;
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.currentUser && this.props.currentUser) {
      this.startPeriodicRefresh();
    } 
    else if (prevProps.currentUser && !this.props.currentUser) {
      this.stopPeriodicRefresh();
    }
  }
  componentWillUnmount() {
    this.stopPeriodicRefresh();
  }

  startPeriodicRefresh() {
    const time = this.minutes * 60 * 1000;
    //const time = 10000;
    this.refreshInterval = setInterval(
        () => this.props.dispatch(refreshAuthToken()),
        time
    );
  }

  stopPeriodicRefresh() {
      if (!this.refreshInterval) {
          return;
      }

      clearInterval(this.refreshInterval);
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/create-lesson" render={(props) => (
            <CreateLesson key={props.match.params.pageid} {...props} />)
          } />
          <Route exact path="/example-table" render={(props) => (
            <ExampleTable key={props.match.params.pageid} {...props} />)
          } />
          <Route exact path="/create-admin" component={CreateAdmin} />
      </div>
    );
  }
  
}

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
  authToken:state.auth.authToken,
  error:state.auth.error
});
export default withRouter(connect(mapStateToProps)(App));