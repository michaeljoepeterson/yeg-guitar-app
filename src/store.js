import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import studentReducer from './reducers/studentReducer';
import lessonReducer from './reducers/lessonReducer';
import categoryReducer from './reducers/categoryReducer';
import userReducer from './reducers/userReducer';

export default createStore(
	combineReducers({
		auth:authReducer,
		students:studentReducer,
		lessons:lessonReducer,
		category:categoryReducer,
		users:userReducer
	}),applyMiddleware(thunk)
);