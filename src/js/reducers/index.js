import {combineReducers} from 'redux';

import messages from './messages';

// `rootReducer` will have top-level keys slice app state into global and views
export default combineReducers({
    messages
});
