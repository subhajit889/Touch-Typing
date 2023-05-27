import { createStore } from 'redux';
import rootReducer from './reducers';

// Create a Redux store with the rootReducer
const store = createStore(rootReducer);

export default store;