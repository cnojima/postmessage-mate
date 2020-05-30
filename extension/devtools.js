const messageLog = [];

// instantiate the devtools tab panel
chrome.devtools.panels.create("postMessage", undefined, "./devtools.html",
  function(panel) {
    // alert('panel created')
  }
);

const ul = document.querySelector('#messages');


function receiveMessage(message, sender, sendResponse) {
  messageLog.push(message);

  if (message.type === 'pmm-msg') {
    const li = document.createElement('li');
    li.innerText = `${message.from} => ${message.to}`;
    ul.appendChild(li);
  } else if (message.pong) {
    // console.log('got pong from content window', sender);
  } else if (message.pmmCount) {
    alert(`Got count of ${message.pmmCount}`);
  }

  if (sendResponse) {
    sendResponse({ success: true });
  }
}

// // establish long-lived connection to active-tab
// // find focus tab
// const contentTabs = chrome.tabs.connect({ name: 'pmm' });

function connectActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs) {
      const port = chrome.tabs.connect(tabs[0].id);
      port.postMessage({ ping: true });
      port.onMessage.addListener(receiveMessage);
    }
  });
}

/**
 * Fault-tolerant message back to devtool panel
 * Adapted from https://stackoverflow.com/questions/23895377/sending-message-from-a-background-script-to-a-content-script-then-to-a-injected/23895822#23895822
 * @param {!any} message JSON-ify-able data
 * @param {?function} callback optional callback/response function
 */
function sendMessage(message, callback) {
  // find focus tab
  contentTabs.query({ active: true, currentWindow: true }, function(tabs) {
    // send ping message, send real message on pong ack
    contentTabs.sendMessage(tabId, { ping: true }, function(response) {
      if(response && response.pong) {
        // sending real message
        contentTabs.sendMessage(tabId, message, callback);
      } else {
        // inject content script for postMessage mate
        contentTabs.executeScript(tabId, { file: "content-script.js" }, function() {
          if(chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            throw Error("Unable to inject script into tab " + tabId);
          }
          // send real message
          contentTabs.sendMessage(tabId, message, callback);
        });
      }
    });
  });
}


connectActiveTab();