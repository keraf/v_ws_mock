let notification = document.getElementById("notification");
let state = document.getElementById("state");
let input = document.getElementById("message");
let chatBox = document.getElementById("chatbox");

const span = document.createElement("span");
span.className = "flex text-sm text-gray-500 ml-auto justify-end";
span.innerHTML = "typing..";

const socket = new WebSocket("ws://localhost:3600");

function connectWebSocket() {
  socket.addEventListener("open", onOpen);
  socket.addEventListener("close", onClose);
  socket.addEventListener("error", onError);
  socket.addEventListener("message", onMessage);
}
input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    let message = input.value;
    if (message) {
      socket.send(message);
      input.value = "";
      render(message, "left");
    }
    input.focus();
  }
});

const render = (message, position) => {
  const container = document.createElement("div");
  container.className = "flex w-full mt-2 space-x-3 max-w-xs";

  const messageHolder = document.createElement("div");
  messageHolder.className = "bg-gray-300 p-3 rounded-r-lg rounded-bl-lg";

  const p = document.createElement("p");
  p.className = "text-sm";

  if (position === "right") {
    container.classList.add("ml-auto");
    container.classList.add("justify-end");
    p.setAttribute("id", "bot");
    messageHolder.className =
      "bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg";
  }

  p.innerHTML = message;
  messageHolder.appendChild(p);
  container.appendChild(messageHolder);
  chatBox.append(container);
  chatBox.scrollTop = chatBox.scrollHeight;
};

const onOpen = (event) => {
  notification.classList.contains("bg-red-600")
    ? notification.classList.replace("bg-red-600", "bg-green-600")
    : notification.classList.add("bg-green-600");
  state.innerHTML = "WebSocket connection established.";
};

const onClose = (event) => {
  notification.classList.contains("bg-green-600")
    ? notification.classList.replace("bg-green-600", "bg-red-600")
    : notification.classList.add("bg-red-600");
  state.innerHTML = "WebSocket connection closed.";
  setTimeout(connectWebSocket, 2000);
};

const messageDelimiter = ".";
let messageBuffer = "";

const onMessage = ({ data }) => {
  chatBox.appendChild(span);
  messageBuffer += data;

  if (messageBuffer.endsWith(messageDelimiter)) {
    const completeMessage = messageBuffer.substring(
      0,
      messageBuffer.length - messageDelimiter.length
    );
    render(messageBuffer, "right");
    span.classList.replace("flex", "hidden");
    messageBuffer = "";
  }
};

const onError = (event) => {
  notification.classList.add("bg-red-600");
  state.innerHTML = "Communication error";
};

connectWebSocket();
