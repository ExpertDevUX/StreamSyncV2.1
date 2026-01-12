chrome.runtime.onInstalled.addListener(() => {
  console.log("[ConnectNow] Extension installed");
  chrome.storage.sync.set({ notifications: true });
});
