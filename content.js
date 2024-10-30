async function humanizeText() {
    // Get the selected text
    const selectedText = window.getSelection().toString();
    
    if (!selectedText) {
      alert("Please select some text to humanize.");
      return;
    }
  
    // Send the selected text to the Undetectable API
    try {
      const response = await fetch("https://humanize.undetectable.ai/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer 3c5e2a00-dbbf-4287-80cd-8082c362b747`
        },
        body: JSON.stringify({ text: selectedText })
      });
      
      const data = await response.json();
      
      if (data.humanizedText) {
        // Replace the selected text with the humanized text
        document.execCommand("insertText", false, data.humanizedText);
      } else {
        alert("Failed to humanize text.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error communicating with the humanization API.");
    }
  }
  