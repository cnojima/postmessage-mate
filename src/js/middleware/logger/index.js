// set _debug cookie to true to enable logging
// `document.cookie='_debug=true';
let debug = false;
document.cookie.split(';').forEach(cookie => {
  const [ key, value ] = cookie.trim().split('=');
  if (key === '_debug' && value === 'true') {
    debug = true;
  }
});

const logger = store => next => action => {
  if (debug) {
    console.group(action.type)
    console.info('dispatching', action)
  }
  
  let result = next(action)
  
  if (debug) {
    console.log('next state', store.getState())
    console.groupEnd()
  }
  
  return result
}

export default logger
