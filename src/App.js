import React from 'react';
import LandingPage from './components/landing-page';
import {Route, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {refreshAuthToken,enableTestMode} from './actions/authActions';
import CreateAdmin from './components/create-admin';
import ExampleTable from './components/lesson-dash';
import CreateStudent from './components/create-student';
import CreateLesson from './components/create-lesson';
import MyLessons from './components/my-lessons';
import Summary from './components/summary';
import TopNav from './components/navbar';
import StudentLessonPage from './components/student-lessons-page';
import './App.css';

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.refreshInterval = null;
    this.minutes = 10;
  }

  componentDidMount(){
    console.log(this.props.location);
    
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
        <TopNav />
        <Route exact path="/"  render={(props) => (
            <LandingPage />)
          }/>
        <Route exact path="/create-lesson" render={(props) => (
            <CreateLesson key={props.match.params.pageid} {...props} />)
          } />
        <Route exact path="/edit-lesson/:id" render={(props) => (
            <CreateLesson editable={true} key={props.match.params.pageid} {...props} />)
          } />
        <Route exact path="/lesson-dash" render={(props) => (
          <ExampleTable key={props.match.params.pageid} {...props} />)
        } />
        <Route exact path="/my-lessons" render={(props) => (
          <MyLessons key={props.match.params.pageid} {...props} />)
        } />
        <Route exact path="/create-student" render={(props) => (
          <CreateStudent key={props.match.params.pageid} {...props} />)
        } />
        <Route exact path="/summary/:id" render={(props) => (
          <Summary key={props.match.params.pageid} {...props} />)
        } />
        <Route exact path="/summary" render={(props) => (
          <Summary key={props.match.params.pageid} {...props} />)
        } />
        <Route exact path="/create-admin" component={CreateAdmin} />
        <Route exact path="/test"  render={(props) => (
          <LandingPage />)
        }/>
        <Route exact path="/student-lessons"  render={(props) => (
          <StudentLessonPage {...props}/>)
        }/>
      </div>
    );
  }
  
}

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
  authToken:state.auth.authToken,
  error:state.auth.error,
  testMode:state.auth.testMode
});
export default withRouter(connect(mapStateToProps)(App));