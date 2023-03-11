import React, {useEffect,useState} from 'react';
import LandingPage from './components/landing-page';
import {Route, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {enableTestMode} from './actions/authActions';
import CreateAdmin from './components/create-admin';
import ExampleTable from './components/lesson-dash';
import CreateStudent from './components/create-student';
import CreateLesson from './components/create-lesson';
import Summary from './components/summary';
import TopNav from './components/navbar';
import StudentLessonPage from './components/pages/student-lessons-page';
import CreateType from './components/pages/create-lesson-type';
import './App.css';
import UserManagement from './components/pages/user-management';
import { useLazyRefreshTokenQuery } from './store/api/auth-api';
function App(props){

  let minutes = 240;
  const [refreshInterval, setRefreshInterval] = useState();
  const [initialLoad,setInitialLoad] = useState(true);
  const [refreshAuthToken] = useLazyRefreshTokenQuery();

  const startPeriodicRefresh = () => {
    
    const time = minutes * 60 * 1000;
    //const time = 10000;
    let interval = setInterval(
        () => refreshAuthToken(),
        time
    );
    
    setRefreshInterval(interval);
  }

  const stopPeriodicRefresh = () => {
      if (!refreshInterval) {
          return;
      }

      clearInterval(refreshInterval);
  }
  
  useEffect(() => {
    console.log(props.location);
    const init = async () =>{
      if(props.location.pathname.includes('/test')){
        props.dispatch(enableTestMode());
      }
      try{
        //await props.dispatch(refreshAuthToken());
        refreshAuthToken()
        startPeriodicRefresh();
        setInitialLoad(false);
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
  

  //let token = useGoogleRefresh();

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
          <StudentLessonPage key={props.match.params.pageid} {...props} />)
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
        <Route exact path="/users"  render={(props) => (
          <UserManagement {...props}/>)
        }/>
      </div>
    );

  return (
    <div>
      {renderContent}
    </div>
  );
  
}

const mapStateToProps = state => {
  return {
    testMode:state.auth.testMode
  }
};
export default withRouter(connect(mapStateToProps)(App));