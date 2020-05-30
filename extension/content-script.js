/*******************************************************************************
 **** content script (executed in active tabs)                              ****
 *******************************************************************************/


// // TODO: get this from sync.configuration
const DATA_DELIM = '--'; // seperator within a message
const MULTI_PART_DELIM = '+-+-+'; // multi-part message
const messages = [];
let _custom_preprocess;
let extensionPort;


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
 * Main message handler in content tab (typically cross-domain postMessage comms)
 */
window.addEventListener("message", function(event) {
  // debug in console
/*   console.groupCollapsed('%c%s', 'color: green;', `postMessage for [${document.title}]`)
    console.info(`[sender] ${event.origin}`);
    console.info(`[receiver] ${document.title}`);

    console.group('data');
      console.info(processMessage(event.data));

      console.groupCollapsed('RAW')
        console.info(event);
      console.groupEnd();
    console.groupEnd();
  console.groupEnd();
 */
this.console.log(event);
  const extMsg = {
    data  : parsePostMessage(event.data),
    event : event,
    from  : event.origin,//event.source.window.document.title,
    to    : document.title,// || event.target.location.host,
    type  : 'pmm-msg',
  };

  // if dev extension is open/focused AND comm port is open
  if (extensionPort) {
    extensionPort.postMessage(extMsg);
  } else {
    messages.push(extMsg);
  }
});

// await devtools extension to reach out and open port
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
    if (msg.ping) {
      console.info(`------------ got ping connect`)
      port.postMessage({ pong: true});
    }
  });

  // expose for downstream
  extensionPort = port;
  extensionPort.postMessage({ pmmCount: messages.length });

  // consume queue
  while (messages.length) {
    const msg = messages.shift();
    extensionPort.postMessage(msg);
  }
});

