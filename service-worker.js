const SCOPE = 'https://scope.sciencecoop.ubc.ca/myAccount/co-op/postings.htm';

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Listen for messages from content scripts or the popup to open the side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "setSidePanelContent") {
    let contentPath;

    // Check the message content and decide which HTML to display in the side panel
    if (message.content === "correct-site") {
      contentPath = "sidepanel/side_panel.html";  // Path to content for the correct site
    } else {
      contentPath = "sidepanel/test.html";  // Path to content for any other site
    }

    // Update the side panel content
    chrome.sidePanel.setOptions({
      path: contentPath,
      enabled: true  // Enable the side panel with the new content
    });
  }
});