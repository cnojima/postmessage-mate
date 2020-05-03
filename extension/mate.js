// console.log('mate.js loaded')

/*******************************************************************************
 **** content script (executed in active tabs)                              ****
 *******************************************************************************/



// TODO: get this from sync.configuration
const DATA_DELIM = '--'; // seperator within a message
const MULTI_PART_DELIM = '+-+-+'; // multi-part message
let _custom_preprocess;



/**
 * 
 * @param {any} msg 
 * @param {object} sender postMessage initiator
 * @param {?function} sendResponse callback on message received
 */
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  // ack message
  if(sender.ping) {
    console.log("Got message from background page: " + msg);
    sendResponse({pong: true});
    return;
  }
  
  // do something?
});


/**
 * parses a postMessage body for use
 * @param {any} msg 
 * @returns {object|any}
 */
function parsePostMessage(msg) {
  // already JSON... probably
  if (typeof msg !== 'string') {
    return msg;
  }
  
  msg = msg.trim();
  
  if (msg.indexOf(DATA_DELIM) < 0) {
    let ret;

    try {
      ret = JSON.parse(msg);
      return ret;
    } catch (ex) {
      // return raw event.data as it wasn't well-formed JSON
      return String(msg);
    }
  }

  // custom processing
  const exMsg = msg.split(DATA_DELIM);

  if (exMsg.length === 2) {
    return {
      type: exMsg[0],
      data: JSON.parse(exMsg[1])
    }
  }

  // some further processing
  return msg;
}





/**
 * Enable hooks for prep
 * @param {!any} msg postMessage message body
 * @returns {string|array}
 */
function processMessage(msg) {
  if (_custom_preprocess && typeof _custom_preprocess === 'function') {
    msg = _custom_preprocess(msg);
  }

  if (typeof msg === 'string' && msg.indexOf(MULTI_PART_DELIM) > -1) {
    const ret = [];

    msg.split(MULTI_PART_DELIM).forEach(function (msgPart, i) {
      ret.push(parsePostMessage(msgPart));
    });

    return ret;
  }

  return parsePostMessage(msg);
}



/**
 * Main message handler
 */
window.addEventListener("message", function(event) {
  console.groupCollapsed('%c%s', 'color: green;', `postMessage for [${document.title}]`)
    console.info(`[sender] ${event.origin}`);
    console.info(`[receiver] ${document.title}`);

    console.group('data');
      console.info(processMessage(event.data));

      console.groupCollapsed('RAW')
        console.info(event);
      console.groupEnd();
    console.groupEnd();
  console.groupEnd();
  
  chrome.runtime.sendMessage({
    type: 'pmm-msg',
    from: event.source.window.document.title,
    to: this.document.title,
    data: parsePostMessage(event.data)
  });
});

chrome.runtime.sendMessage({
  type: 'pmm-msg',
  from: 'mate.js',
  to: 'devtools.js',
  data: {
    msg: 'are you listening?'
  }
});
