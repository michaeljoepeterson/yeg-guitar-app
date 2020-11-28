import React, {useEffect,useState} from 'react';
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
import CreateType from './components/pages/create-lesson-type';
import fb from './fb/firebase';
import {useGoogleRefresh} from './effects/googleSignIn';
import './App.css';

function App(props){

  let refreshInterval = null;
  let minutes = 10;
  const [initialLoad,useSetInitialLoad] = useState(false);

  
  /*
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
  */
  const startPeriodicRefresh = () => {
    const time = minutes * 60 * 1000;
    //const time = 10000;
    refreshInterval = setInterval(
        () => props.dispatch(refreshAuthToken()),
        time
    );
  }

  const stopPeriodicRefresh = () => {
      if (!refreshInterval) {
          return;
      }

      clearInterval(refreshInterval);
  }
  /*
  useEffect(() => {
    console.log(props.location);
    const init = async () =>{
      if(props.location.pathname.includes('/test')){
        props.dispatch(enableTestMode());
      }
      try{
        let token = await fb.getToken();
        await props.dispatch(refreshAuthToken());
        startPeriodicRefresh();
        useSetInitialLoad(false);
      }
      catch(e){
        console.log('error: ',e);
      }
    }
    init();
    return () => {
      console.log('app clean up');
      stopPeriodicRefresh()
    }
  },[]);
  */

  let token = useGoogleRefresh();

  let renderContent = initialLoad ?
     (<div className="App"></div>) : (
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
        <Route exact path="/create-type"  render={(props) => (
          <CreateType {...props}/>)
        }/>
      </div>
    );

  return (
    <div>
      {renderContent}
    </div>
  );
  
}

const mapStateToProps = state => ({
  testMode:state.auth.testMode
});
export default withRouter(connect(mapStateToProps)(App));