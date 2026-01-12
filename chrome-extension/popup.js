const chrome = window.chrome;
let baseUrl = "";

chrome.storage.sync.get(["baseUrl"], (result) => {
  baseUrl = result.baseUrl || "https://thongphamit.site";
  console.log("ConnectNow Extension: baseUrl initialized as", baseUrl);
});

function generateRoomId() {
  const adjectives = ["quick", "happy", "bright", "smart", "cool"];
  const nouns = ["meeting", "chat", "talk", "call", "sync"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1000);
  return `${adj}-${noun}-${num}`;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newMeeting")?.addEventListener("click", () => {
    const roomId = generateRoomId();
    const url = `${baseUrl}/room/${roomId}`;
    console.log("Opening new meeting:", url);
    chrome.tabs.create({ url });
  });

  document.getElementById("joinMeeting")?.addEventListener("click", () => {
    const roomCode = document.getElementById("roomCode").value.trim();
    if (!roomCode) {
      const status = document.getElementById("status");
      if (status) {
        status.textContent = "Please enter a room code";
        status.style.color = "#ef4444";
      }
      return;
    }
    const url = `${baseUrl}/room/${roomCode}`;
    console.log("Joining meeting:", url);
    chrome.tabs.create({ url });
  });
});
