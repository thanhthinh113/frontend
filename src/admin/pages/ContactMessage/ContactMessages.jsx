import React, { useContext, useEffect, useState } from "react";
import "./ContactMessages.css";
import {
  FaEnvelopeOpenText,
  FaClock,
  FaUser,
  FaTimes,
  FaPaperPlane,
  FaSearch,
  FaExclamationTriangle,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StoreContext } from "../../../context/StoreContext";

export const ContactMessages = () => {
  const { url } = useContext(StoreContext);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  // Bộ lọc và tìm kiếm
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${url}/api/contact/all`);
        const result = await res.json();
        const dataWithStatus = (result.data || []).map((m) => ({
          ...m,
          status: m.status || "new",
        }));
        setMessages(dataWithStatus);
      } catch (err) {
        console.error("Lỗi khi tải tin nhắn:", err);
        toast.error("⚠️ Không thể tải danh sách tin nhắn!");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const openMessage = async (msg) => {
    setSelectedMsg(msg);
    setReply("");

    if (msg.status === "new") {
      try {
        await fetch(`${url}/api/contact/update-status/${msg._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "viewed" }),
        });
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, status: "viewed" } : m))
        );
      } catch (err) {
        console.error("Lỗi khi cập nhật trạng thái:", err);
        toast.error("Không thể cập nhật trạng thái tin nhắn!");
      }
    }
  };

  const closeModal = () => setSelectedMsg(null);

  const handleReply = async () => {
    if (!reply.trim()) return toast.warn("✉️ Vui lòng nhập nội dung phản hồi.");

    setSending(true);
    try {
      const res = await fetch(`${url}/api/contact/reply/${selectedMsg._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyMessage: reply }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(<span>Đã gửi phản hồi thành công!</span>);

        const updatedContact = result.data; // ✅ dữ liệu mới từ server

        // Cập nhật danh sách
        setMessages((prev) =>
          prev.map((m) => (m._id === updatedContact._id ? updatedContact : m))
        );

        // Cập nhật chi tiết đang mở
        setSelectedMsg(updatedContact);

        setReply("");
      } else {
        toast.error(result.message || "Không thể gửi phản hồi.");
      }
    } catch (err) {
      console.error("Lỗi khi gửi phản hồi:", err);
      toast.error(
        <span>
          <FaExclamationTriangle style={{ color: "orange", marginRight: 5 }} />
          Gửi phản hồi thất bại.
        </span>
      );
    } finally {
      setSending(false);
    }
  };

  // --- Bộ lọc + Tìm kiếm ---
  const filteredMessages = messages.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || m.status === filter;
    return matchSearch && matchFilter;
  });

  // --- Phân trang ---
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const currentMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="mailbox-container">
      <h1 className="mailbox-title">📬 Hộp Thư Liên Hệ Khách Hàng</h1>

      {/* --- Thanh công cụ tìm kiếm và lọc --- */}
      <div className="mailbox-tools">
        <div className="search-box pretty">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="🔍 Tìm kiếm tin nhắn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {["all", "new", "viewed", "replied"].map((type) => (
          <button
            key={type}
            className={`filter-btn ${filter === type ? "active" : ""}`}
            onClick={() => setFilter(type)}
          >
            <span>
              {type === "all"
                ? "📩"
                : type === "new"
                ? "🆕"
                : type === "viewed"
                ? "👁️"
                : "✅"}
            </span>
            {type === "all"
              ? "Tất cả"
              : type === "new"
              ? "Mới"
              : type === "viewed"
              ? "Đã xem"
              : "Phản hồi"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mailbox-loading">Đang tải dữ liệu...</p>
      ) : filteredMessages.length === 0 ? (
        <p className="mailbox-empty">Không tìm thấy tin nhắn nào.</p>
      ) : (
        <>
          <div className="mailbox-list">
            {currentMessages.map((msg) => (
              <div
                className="mailbox-item"
                key={msg._id}
                onClick={() => openMessage(msg)}
              >
                <div className="mailbox-header">
                  <div className="mailbox-sender">
                    <FaUser className="icon" />
                    <strong>{msg.name}</strong> — <span>{msg.email}</span>
                  </div>
                  <div className="mailbox-time">
                    <FaClock className="icon" />
                    {new Date(msg.createdAt).toLocaleString("vi-VN")}
                  </div>
                </div>

                <div className="mailbox-subject">
                  <FaEnvelopeOpenText className="icon" />
                  <span>{msg.subject}</span>
                  <span className={`status-badge ${msg.status}`}>
                    {msg.status === "new"
                      ? "Mới"
                      : msg.status === "viewed"
                      ? "Đã xem"
                      : "Đã phản hồi"}
                  </span>
                </div>

                <div className="mailbox-body">
                  <p>
                    {msg.message.length > 100
                      ? msg.message.slice(0, 100) + "..."
                      : msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* --- Phân trang --- */}
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => changePage(currentPage - 1)}>◀</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => changePage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => changePage(currentPage + 1)}>▶</button>
            </div>
          )}
        </>
      )}

      {/* --- Modal --- */}
      {selectedMsg && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
              <FaTimes />
            </button>

            <h2>{selectedMsg.subject}</h2>
            <p>
              <b>👤 Tên:</b> {selectedMsg.name}
            </p>
            <p>
              <b>📧 Email:</b> {selectedMsg.email}
            </p>
            <p>
              <b>🕒 Gửi lúc:</b>{" "}
              {new Date(selectedMsg.createdAt).toLocaleString("vi-VN")}
            </p>
            <hr />
            <p className="modal-message">{selectedMsg.message}</p>
            <hr />

            {selectedMsg.status === "replied" ? (
              <>
                <h3 className="reply-title">✅ Đã phản hồi</h3>
                <div className="reply-readonly">
                  <p>{selectedMsg.replyMessage || "(Không có nội dung)"}</p>
                </div>
              </>
            ) : (
              <>
                <h3 className="reply-title">✉️ Phản hồi</h3>
                <textarea
                  className="reply-input"
                  placeholder="Nhập nội dung phản hồi..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                ></textarea>
                <button
                  className="reply-btn"
                  onClick={handleReply}
                  disabled={sending}
                >
                  <FaPaperPlane />
                  {sending ? "Đang gửi..." : "Gửi phản hồi"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Toast hiển thị */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};
