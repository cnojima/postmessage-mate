import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import middleware from './middleware';

/**
 * Centralized place to hydrate app/view state, inject middlware & reducer enhancers.
 * @param {?object} preloadedState View state of application (nav, refresh, etc.)
 * @returns {ReduxStore} store
 */
export default function configureStore(preloadedState) {
  const middlewareEnhancer = applyMiddleware(...middleware);
  const enhancers = [middlewareEnhancer, /* ...other enhancers*/];
  
  const composedEnhancers = composeWithDevTools(...enhancers);
  return createStore(rootReducer, preloadedState, composedEnhancers);
  
  // return createStore(rootReducer, preloadedState, middlewareEnhancer);
}
