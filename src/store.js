import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import studentReducer from './reducers/studentReducer';
import lessonReducer from './reducers/lessonReducer';
import categoryReducer from './reducers/categoryReducer';


export default createStore(
	combineReducers({
		auth:authReducer,
		students:studentReducer,
		lessons:lessonReducer,
		category:categoryReducer
	}),applyMiddleware(thunk)
);