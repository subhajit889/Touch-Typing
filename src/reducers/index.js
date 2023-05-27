import { combineReducers } from 'redux';
import typingReducer from './typingReducer';

// Combine multiple reducers into a single rootReducer
const rootReducer = combineReducers({
  typing: typingReducer,
});

export default rootReducer;
