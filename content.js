// Listen for messages from background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "showReply") {
    // Create div to display repy
    var replyDiv = document.createElement("div");
    replyDiv.id = "openai-reply";
    replyDiv.style.backgroundColor = "lightblue";
    replyDiv.style.border = "1px solid black";
    replyDiv.style.padding = "10px";
    replyDiv.style.position = "absolute";
    replyDiv.style.top = "50%";
    replyDiv.style.left = "50%";
    replyDiv.style.transform = "translate(-50%, -50%)";
    replyDiv.style.zIndex = "9999";
    replyDiv.innerHTML = `<p><strong>Reply:</strong> ${request.summary}</p><button id="close-button">Close</button>`;
    document.body.appendChild(replyDiv);

    // Add event listener to close button
    var closeButton = document.getElementById("close-button");
    closeButton.addEventListener("click", function() {
      replyDiv.remove();
    });
  }
});
