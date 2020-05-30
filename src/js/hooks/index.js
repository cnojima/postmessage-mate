import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MESSAGE_RECEIVED } from 'constants';

// const containerListener = (chrome.runtime)
//   ? chrome.runtime.onMessage.addListener
//   : window.addListener || window.addEventListener;


let repeat = 0;

/**
 * handle onMessage side-effect
 */
export const usePostMessages = () => {
  const dispatch = useDispatch();
  const messages = useSelector(state => state.messages);

  const messageHandler = function(message, sender, sendResponse) {
    console.log(JSON.stringify(message), repeat)

    if (
      // disregard react & redux devtools messages
      (message && message.data && message.data.source && message.data.source.indexOf('react-devtools'))
      || // ping/ack?
      JSON.stringify(message) === '{"isTrusted":true}'
    ) {
      console.log('halted')
      // return;
    }

    if (repeat > 100) { return; }

    repeat++;

    dispatch({
      type: MESSAGE_RECEIVED,
      message
    });

    if (sendResponse && typeof sendResponse === 'function') {
      sendResponse(true);
    }
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
