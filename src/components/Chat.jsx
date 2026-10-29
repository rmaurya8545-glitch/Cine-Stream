import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const ROOMS = ["General", "Tech Support"];

function Chat() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [username, setUsername] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [room, setRoom] = useState("General");
  const typingTimeout = useRef(null);

  useEffect(() => {
    const s = io(SOCKET_URL);
    setSocket(s);

    s.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    s.on("typing", (user) => setTypingUser(user));
    s.on("stop typing", () => setTypingUser(""));

    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (socket && username) {
      socket.emit("join room", room);
      setMessages([]);
      setTypingUser("");
    }
  }, [socket, username, room]);

  const joinChat = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setUsername(nameInput.trim());
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    if (!socket) return;

    socket.emit("typing", { user: username, room });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop typing", room);
    }, 1000);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket) return;
    socket.emit("chat message", { room, user: username, text });
    clearTimeout(typingTimeout.current);
    socket.emit("stop typing", room);
    setText("");
  };

  if (!username) {
    return (
      <section style={{ 
        background: "rgba(15,23,42,0.9)", 
        color: "white", 
        padding: "1rem",
        margin:"1rem",
        borderRadius:"12px",
      }}>
        <h2>Live Chat</h2>
        <form onSubmit={joinChat}>
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter your name"
          />
          <button type="submit">Join</button>
        </form>
      </section>
    );
  }

  return (
    <section style={{ 
        background: "rgba(15,23,42,0.9)", 
        color: "white", 
        padding: "1rem",
        margin:"1rem",
        borderRadius:"12px",
      }}>
      <h2>Live Chat</h2>

      <div style={{ marginBottom: "0.5rem" }}>
        {ROOMS.map((r) => (
          <button
            key={r}
            onClick={() => setRoom(r)}
            style={{
              marginRight: "0.5rem",
              fontWeight: room === r ? "bold" : "normal",
              border: room === r ? "2px solid white" : "1px solid gray",
            }}
          >
            {r}
          </button>
        ))}
      </div>

      <p>Current room: <b>{room}</b></p>

      <div>
        {messages.map((m, i) => (
          <p key={i}>
            [{m.user}]: {m.text}
          </p>
        ))}
      </div>
      {typingUser && <p><i>{typingUser} is typing...</i></p>}
      <form onSubmit={sendMessage}>
        <input
          value={text}
          onChange={handleTyping}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}

export default Chat;
