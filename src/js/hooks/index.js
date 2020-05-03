import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MESSAGE_RECEIVED } from 'constants';

const containerListener = (chrome.runtime)
  ? chrome.runtime.onMessage.addListener
  : window.addListener || window.addEventListener;

/**
 * handle onMessage side-effect
 */
export const usePostMessages = () => {
  const dispatch = useDispatch();
  const messages = useSelector(state => state.messages);

  const messageHandler = function(message, sender, sendResponse) {
    // disregard redux devtools messages
    // if (message.isTrusted) {
    //   return;
    // }

    dispatch({
      type: MESSAGE_RECEIVED,
      message
    });
  }

  useEffect(() => {
    if (chrome.runtime) {
      chrome.runtime.onMessage.addListener(messageHandler);
    } else {
      if (window.addListener) {
        window.addListener('message', messageHandler, false);
      } else if (window.addEventListener) {
        window.addEventListener('message', messageHandler, false);
      }
    }
  }, [messages]);

  return messages;
};
