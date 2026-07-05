import React, { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { FiSend, FiTrash2 } from "react-icons/fi";
import "../css/DiscussionForum.css";

const API_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

// Label & style badge per role — HANYA role yang memang ada di backend (User.role enum: "admin", "user")
const ROLE_LABELS = {
  admin: { label: "Admin", className: "role-badge admin" },
  user: { label: "Student", className: "role-badge user" },
};

const DiscussionForum = ({ courseId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  const socketRef = useRef(null);
  const listEndRef = useRef(null);

  const currentUserId = localStorage.getItem("userId");
  const currentUserRole = localStorage.getItem("userRole");

  const scrollToBottom = useCallback(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // ─── Load riwayat chat (sekali saat tab dibuka) ────────────────────────────
  useEffect(() => {
    if (!courseId) return;
    const token = localStorage.getItem("token");
    setLoading(true);
    setError("");

    fetch(`${API_URL}/discussion/${courseId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Gagal memuat diskusi");
        setMessages(Array.isArray(data) ? data : []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [courseId]);

  // ─── Koneksi Socket.io — dibuka saat tab aktif, ditutup saat tab ditinggalkan ──
  useEffect(() => {
    if (!courseId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join-course", courseId);
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("new-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("message-deleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    });

    socket.on("discussion-error", (msg) => setError(msg));

    return () => {
      socket.emit("leave-course", courseId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [courseId]);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !socketRef.current || !connected) return;
    socketRef.current.emit("send-message", { courseId, message: trimmed });
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDelete = (messageId) => {
    if (!socketRef.current) return;
    if (!window.confirm("Hapus pesan ini dari diskusi?")) return;
    socketRef.current.emit("delete-message", { messageId });
  };

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return <p className="discussion-loading">Memuat forum diskusi...</p>;
  }

  return (
    <div className="discussion-forum">
      <div className="discussion-header">
        <h3>Forum Diskusi</h3>
        <span className={`connection-dot ${connected ? "online" : "offline"}`}>
          {connected ? "● Terhubung" : "○ Menghubungkan..."}
        </span>
      </div>

      {error && <p className="discussion-error">{error}</p>}

      <div className="discussion-messages">
        {messages.length === 0 ? (
          <p className="empty-content">
            Belum ada diskusi. Jadilah yang pertama bertanya!
          </p>
        ) : (
          messages.map((msg) => {
            const roleInfo = ROLE_LABELS[msg.userId?.role] || ROLE_LABELS.user;
            const isMine = msg.userId?._id === currentUserId;
            return (
              <div
                key={msg._id}
                className={`discussion-message ${isMine ? "mine" : ""}`}
              >
                <img
                  src={msg.userId?.avatar}
                  alt={msg.userId?.name}
                  className="discussion-avatar"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <div className="discussion-bubble">
                  <div className="discussion-meta">
                    <span className="discussion-name">
                      {msg.userId?.name || "Pengguna"}
                    </span>
                    <span className={roleInfo.className}>{roleInfo.label}</span>
                    <span className="discussion-time">
                      {formatTime(msg.createdAt)}
                    </span>
                    {currentUserRole === "admin" && (
                      <button
                        className="discussion-delete-btn"
                        onClick={() => handleDelete(msg._id)}
                        title="Hapus pesan"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                  <p className="discussion-text">{msg.message}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={listEndRef} />
      </div>

      <div className="discussion-input-bar">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tulis pertanyaan atau komentar..."
          className="discussion-textarea"
          rows={2}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || !connected}
          className="discussion-send-btn"
        >
          <FiSend /> Kirim
        </button>
      </div>
    </div>
  );
};

export default DiscussionForum;
