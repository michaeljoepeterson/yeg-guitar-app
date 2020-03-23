import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';

export default createStore(
	combineReducers({
        auth:authReducer
	}),applyMiddleware(thunk)
);