// Define OpenAI API endpoint and authentication headers
const API_ENDPOINT = 'https://api.openai.com/v1/engines/davinci-codex/completions';

// Due to privacy reasons I have removed my API key. 
// You can get your own key by signing up for OpenAI Codex here: https://openai.com/blog/openai-codex/
// If you use your own key the code should work as an extension
const OPENAI_API_KEY = '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'; 

// Create context menu item on page load for selected text
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    title: "Reply to email with OpenAI",
    contexts: ["selection"],
    id: "reply-selection"
  });
});

// Handle context menu item click by adding an event listener
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "reply-selection") {
    const selectedText = info.selectionText;

    // Retrieve the active tab that the user is currently using
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const activeTab = tabs[0];
      console.log(selectedText)
      
      // Send request to OpenAI API to reply selected text
      fetch('https://api.openai.com/v1/completions', {

          method: 'POST',
          headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json'

          },

          body: JSON.stringify({
              prompt: "Can you write a reply to this email:" + selectedText,
              max_tokens: 400,
              model: "text-davinci-003",
              frequency_penalty: 0.5,
              presence_penalty: 0.5,
              temperature: 0.35,
              top_p: 1
          })

      })
      // Parse the response and send the reply to the content script
      .then(response => response.json())
      .then(result => {
        const reply = result.choices[0].text.trim();

        console.log(activeTab.id);

        // Add listener for content script load
        // NOTE: This is a hacky way to send the reply to the content script, 
        // otherwise the content script will not be loaded when the message is sent
        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
          if (tabId === activeTab.id && changeInfo.status === 'complete') {
            // Send message to content script to show text
            chrome.tabs.sendMessage(tabId, {
              type: "showReply",
              summary: reply
            });
          }
        });
      })
      // This code is used for error handling
      .catch(error => console.error(error));
    });
  }
});
