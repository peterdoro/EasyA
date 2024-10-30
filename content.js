chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "humanizeText") {
      console.log("Humanize text action received in content script");
      humanizeText();
      sendResponse({ status: "Humanization started" });
    }
  });
  
  async function humanizeText() {
    const selectedText = window.getSelection().toString();
    console.log("Selected text:", selectedText);
  
    if (!selectedText || selectedText.length < 50) {
      alert("Please select at least 50 characters to humanize.");
      return;
    }
  
    try {
      // Step 1: Submit the text to the Undetectable AI API for humanization
      console.log("Submitting text for humanization");
      const submitResponse = await fetch("https://humanize.undetectable.ai/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": "3c5e2a00-dbbf-4287-80cd-8082c362b747"  // Replace with your actual API key
        },
        body: JSON.stringify({
          content: selectedText,
          readability: "High School",
          purpose: "General Writing",
          strength: "Balanced"
        })
      });
  
      const submitData = await submitResponse.json();
      console.log("Submit response:", submitData);
  
      if (submitData.status !== "Document submitted successfully") {
        alert("Failed to submit document for humanization.");
        return;
      }
  
      const documentId = submitData.id;
  
      // Step 2: Poll the API to check if humanization is complete
      let isDone = false;
      let retries = 10;
  
      while (!isDone && retries > 0) {
        console.log("Polling for completion, attempt:", 11 - retries);
        await new Promise(resolve => setTimeout(resolve, 5000));
  
        const retrieveResponse = await fetch("https://humanize.undetectable.ai/document", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": "3c5e2a00-dbbf-4287-80cd-8082c362b747"  // Replace with your actual API key
          },
          body: JSON.stringify({
            id: documentId
          })
        });
  
        const retrieveData = await retrieveResponse.json();
        console.log("Retrieve response:", retrieveData);
  
        if (retrieveData.output) {
          replaceSelectedText(retrieveData.output);
          isDone = true;
        } else {
          retries--;
        }
      }
  
      if (!isDone) {
        alert("Failed to retrieve humanized text. Please try again later.");
      }
  
    } catch (error) {
      console.error("Error:", error);
      alert("Error communicating with the humanization API.");
    }
  }
  
  function replaceSelectedText(newText) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
  
    const range = selection.getRangeAt(0);
    range.deleteContents();
  
    const textNode = document.createTextNode(newText);
    range.insertNode(textNode);
  
    range.setStartAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
    console.log("Replaced selected text with:", newText);
  }
  