console.log("[ConnectNow] Content script active");
window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CONNECTNOW_EXT_REQUEST") {
    console.log("Extension request:", event.data.action);
  }
});
