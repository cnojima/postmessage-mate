// TODO: get this from sync.configuration
const DATA_DELIM = '--'; // seperator within a message

function parsePostMessage(msg) {
  // already JSON... probably
  if (typeof msg !== 'string') {
    return msg;
  } else if (msg.indexOf(DATA_DELIM) < 0) {
    let ret;
    try {
      ret = JSON.parse(msg);
      return ret;
    } catch (ex) {
      console.debug(`postMessage mate tried to JSON.parse non-JSON`);
      return String(msg);
    }
  }

  const exMsg = msg.split(DATA_DELIM);

  return {
    type: exMsg[0],
    data: JSON.parse(exMsg[1])
  }
}


chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  // ack message
  if(sender.ping) {
    console.log("Got message from background page: " + msg);
    sendResponse({pong: true});
    return;
  }
  
  // do something?
});

addEventListener("message", function(event) {
  // console.log('%c%s', 'color: green; background: yellow; font-size: 24px;', 'DEV VERSION LOADED!');
  console.groupCollapsed('%c%s', 'color: green;', `postMessage for [${document.title}]`)
    console.info(`[sender] ${event.origin}`);
    console.info(`[receiver] ${document.title}`);

    console.group('data');
      console.info(parsePostMessage(event.data));
    console.groupEnd();
  console.groupEnd();


  chrome.runtime.sendMessage({
    from: event.origin,
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
