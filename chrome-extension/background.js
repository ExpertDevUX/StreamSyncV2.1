const chrome = window.chrome // Declare the chrome variable

chrome.runtime.onInstalled.addListener(() => {
  console.log("[ConnectNow] Extension installed")

  // Set default settings - will be updated by the user or dynamically
  chrome.storage.sync.set({
    baseUrl: "", 
    notifications: true,
  })
})

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "NOTIFICATION") {
    showNotification(request.title, request.message)
    sendResponse({ success: true })
  }

  if (request.type === "USER_JOINED") {
    chrome.storage.sync.get(["notifications"], (result) => {
      if (result.notifications) {
        showNotification("User Joined", `${request.userName} joined the meeting`)
      }
    })
    sendResponse({ success: true })
  }

  return true
})

// Show desktop notification
function showNotification(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: title,
    message: message,
    priority: 2,
  })
}
