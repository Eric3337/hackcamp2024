const SCOPE = 'https://scope.sciencecoop.ubc.ca/myAccount/co-op/postings.htm';

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
