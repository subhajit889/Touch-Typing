import { createStore } from 'redux';
import rootReducer from '../src/reducers/typingReducer';

// Create a Redux store with the rootReducer
const store = createStore(rootReducer);

export default store;