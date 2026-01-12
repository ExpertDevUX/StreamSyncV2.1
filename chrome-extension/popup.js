const chrome = window.chrome;
let baseUrl = "";

chrome.storage.sync.get(["baseUrl"], (result) => {
  baseUrl = result.baseUrl || "https://" + window.location.hostname;
});

function generateRoomId() {
  return 'room-' + Math.random().toString(36).substr(2, 9);
}

document.getElementById("newMeeting")?.addEventListener("click", () => {
  const roomId = generateRoomId();
  const url = baseUrl ? `${baseUrl}/room/${roomId}` : `/room/${roomId}`;
  chrome.tabs.create({ url });
});

document.getElementById("joinMeeting")?.addEventListener("click", () => {
  const roomCode = document.getElementById("roomCode").value.trim();
  if (!roomCode) return;
  const url = baseUrl ? `${baseUrl}/room/${roomCode}` : `/room/${roomCode}`;
  chrome.tabs.create({ url });
});
