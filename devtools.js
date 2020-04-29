const ul = document.querySelector('#messages');

// instantiate the devtools tab panel
chrome.devtools.panels.create("postMessage", undefined, "./devtools.html",
  function(panel) {
    // alert('panel created')
  }
);

// listen for messages from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'pmm-msg') {
    const li = document.createElement('li');
    li.innerText = sender.tab.url;
    ul.appendChild(li);
  }

  if (sendResponse) {
    sendResponse({ success: true });
  }
});


/**
 * Fault-tolerant message back to devtool panel
 * Adapted from https://stackoverflow.com/questions/23895377/sending-message-from-a-background-script-to-a-content-script-then-to-a-injected/23895822#23895822
 * @param {!any} message JSON-ify-able data
 * @param {?function} callback optional callback/response function
 */
function sendMessage(message, callback) {
  // find focus tab
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    // send ping message, send real message on pong ack
    chrome.tabs.sendMessage(tabId, { ping: true }, function(response) {
      if(response && response.pong) {
        // sending real message
        chrome.tabs.sendMessage(tabId, message, callback);
      } else {
        // inject content script for postMessage mate
        chrome.tabs.executeScript(tabId, { file: "mate.js" }, function() {
          if(chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            throw Error("Unable to inject script into tab " + tabId);
          }
          // send real message
          chrome.tabs.sendMessage(tabId, message, callback);
        });
      }
    });
  });
}
