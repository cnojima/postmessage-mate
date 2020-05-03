import { MESSAGE_RECEIVED } from 'constants';

// for ongoing messages
const defaultState = [];

export default (state = defaultState, action) => {
  switch (action.type) {
    case MESSAGE_RECEIVED:
      return [].concat(state, [action.message]);
  }

  return state;
};
