document.getElementById('humanizeBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: humanizeText
      });
    });
  });
  
  function humanizeText() {
    // Defined in content.js
  }
  