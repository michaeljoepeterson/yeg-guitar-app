import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import studentReducer from './reducers/studentReducer';

export default createStore(
	combineReducers({
		auth:authReducer,
		students:studentReducer
	}),applyMiddleware(thunk)
);