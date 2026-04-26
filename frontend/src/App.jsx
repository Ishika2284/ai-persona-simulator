import { useEffect, useRef, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const [persona, setPersona] = useState("teacher");
  const [customPersona, setCustomPersona] = useState("");

  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { role: "user", text: message };
    setChat((prev) => [...prev, userMsg]);

    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message,
        persona,
        customPersona,
      });

      setChat((prev) => [
        ...prev,
        { role: "bot", text: res.data.response },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Server not responding" },
      ]);
    }

    setLoading(false);
  };

  const personas = ["teacher", "mentor", "interviewer", "custom"];

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logo}>✨ GenAI Assistant</div>

        <div style={styles.personaBar}>
          {personas.map((p) => (
            <button
              key={p}
              onClick={() => setPersona(p)}
              style={{
                ...styles.chip,
                background: persona === p ? "#4f7cff" : "#f1f3f9",
                color: persona === p ? "#fff" : "#333",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* CUSTOM INPUT */}
      {persona === "custom" && (
        <div style={styles.customBox}>
          <input
            placeholder="Enter custom persona (e.g. pirate, scientist...)"
            value={customPersona}
            onChange={(e) => setCustomPersona(e.target.value)}
            style={styles.customInput}
          />
        </div>
      )}

      {/* CHAT AREA */}
      <div ref={chatRef} style={styles.chat}>
        {chat.length === 0 && (
          <div style={styles.empty}>
            <h2>Start a conversation</h2>
            <p>Ask anything — AI will respond instantly</p>
          </div>
        )}

        {chat.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.row,
              justifyContent:
                msg.role === "user" ? "flex-end" : "flex-start",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <div
              style={{
                ...styles.bubble,
                background:
                  msg.role === "user" ? "#4f7cff" : "#ffffff",
                color: msg.role === "user" ? "#fff" : "#222",
                border:
                  msg.role === "user"
                    ? "none"
                    : "1px solid #eee",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={styles.typing}>AI is thinking...</div>
        )}
      </div>

      {/* INPUT BAR */}
      <div style={styles.inputBar}>
        <input
          style={styles.input}
          placeholder="Ask something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button style={styles.sendBtn} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;

/* 🎨 LIGHT + MODERN UI */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(180deg, #f7f9fc, #eef2ff)",
    fontFamily: "system-ui",
  },

  header: {
    padding: "14px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    borderBottom: "1px solid #eee",
  },

  logo: {
    fontWeight: "600",
    fontSize: "16px",
  },

  personaBar: {
    display: "flex",
    gap: "8px",
  },

  chip: {
    border: "none",
    padding: "6px 12px",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "0.2s",
  },

  customBox: {
    padding: "10px 20px",
    background: "#fff",
    borderBottom: "1px solid #eee",
  },

  customInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none",
  },

  chat: {
    flex: 1,
    padding: "20px 18%",
    overflowY: "auto",
  },

  empty: {
    textAlign: "center",
    marginTop: "25vh",
    color: "#777",
  },

  row: {
    display: "flex",
    marginBottom: "10px",
  },

  bubble: {
    maxWidth: "65%",
    padding: "12px 14px",
    borderRadius: "14px",
    lineHeight: "1.5",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },

  typing: {
    color: "#666",
    fontSize: "13px",
    marginTop: "10px",
  },

  inputBar: {
    display: "flex",
    padding: "12px",
    background: "#fff",
    borderTop: "1px solid #eee",
    gap: "10px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    outline: "none",
  },

  sendBtn: {
    padding: "12px 18px",
    background: "#4f7cff",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
  },
};