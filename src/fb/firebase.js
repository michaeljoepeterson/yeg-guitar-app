import app from 'firebase/app';
import {fbConfig} from '../firebase-config';
import 'firebase/auth';
import firebase from 'firebase';
 
class Firebase {
  //can optionally use returned user to get auth token
  constructor() {
    //if(!firebase.apps.length){
    app.initializeApp(fbConfig);
    //}
    this.auth = app.auth();
    this.provider = new firebase.auth.GoogleAuthProvider();
  }

  signInWithGoogle = async () =>{
    try{
      const result = await this.auth.signInWithPopup(this.provider);
      if(!result){
        throw {message:'no account selected'};
      }
      //result.user.
      return result.user;
    }
    catch(e){
        console.log('error logging in with google: ',e);
        throw e;
    }
  }

  createUserEmail = async (email,pass) => {
    try{
        const result = await this.auth.createUserWithEmailAndPassword(email,pass);
        return result.user;
    }
    catch(e){
        console.log('error logging in: ',e);
        throw e;
    }
  }

  signInEmail = async (email,pass) => {
      try{
          const result = await this.auth.signInWithEmailAndPassword(email,pass);
          return result.user;
      }
      catch(e){
        console.log('error signing in: ',e);
        throw e;
      }
  }

  logout = async () => {
      try{
          this.auth.signOut();
      }
      catch(e){
        console.log('error loggint out: ',e);
        throw e;
      }
  }

  getToken = async () => {
      if(!this.auth.currentUser){
          return null;
      }
      try{
        let token = await this.auth.currentUser.getIdToken(true);
        return token;
      } 
      catch(e){
          console.log('error getting token:', e);
          throw e;
      }
  }
}

let fb = new Firebase();

export default fb;