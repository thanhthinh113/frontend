import React, { useContext, useState } from "react";
// Đã thay đổi cách import sang Global CSS
import "./ContactPage.css";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebookSquare,
  FaInstagram,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";

export const ContactPage = () => {
  const { url } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${url}/api/contact/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Cảm ơn bạn! Tin nhắn đã được gửi thành công.", {
          position: "top-center",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(data.message || "Gửi thất bại, vui lòng thử lại.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Lỗi gửi form:", error);
      toast.error("Không thể kết nối máy chủ.", { position: "top-center" });
    }
  };

  return (
    // Đã xóa 'styles.' khỏi tất cả className
    <div className="contactPage">
      <h1 className="pageTitle">Liên Hệ Với Chúng Tôi</h1>
      <p className="pageSubtitle">
        Chúng tôi luôn sẵn lòng lắng nghe ý kiến, phản hồi và giải đáp mọi thắc
        mắc của Quý khách hàng.
      </p>

      <div className="contactContent">
        {/* Phần 1: Form Liên hệ */}
        <div className="contactFormContainer">
          <h2 className="formTitle">Gửi Tin Nhắn Cho Tomato</h2>
          <form onSubmit={handleSubmit} className="contactForm">
            <input
              type="text"
              name="name"
              placeholder="Tên của bạn"
              value={formData.name}
              onChange={handleChange}
              required
              className="formInput"
            />
            <input
              type="email"
              name="email"
              placeholder="Email của bạn"
              value={formData.email}
              onChange={handleChange}
              required
              className="formInput"
            />
            <input
              type="text"
              name="subject"
              placeholder="Chủ đề (ví dụ: Góp ý món ăn)"
              value={formData.subject}
              onChange={handleChange}
              required
              className="formInput"
            />
            <textarea
              name="message"
              placeholder="Nội dung tin nhắn"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className="formTextarea"
            ></textarea>
            <button type="submit" className="submitButton">
              Gửi Đi
            </button>
          </form>
        </div>

        {/* Phần 2: Thông tin Chi tiết */}
        <div className="contactInfoContainer">
          <h2 className="infoTitle">Thông Tin Liên Hệ</h2>
          <div className="infoItem">
            <FaMapMarkerAlt className="infoIcon" />
            <a
              href="https://www.tomato.com"
              target="_blank"
              rel="noopener noreferrer"
              className="contactLink"
            >
              https://www.tomato.com
            </a>
          </div>
          <div className="infoItem">
            <FaPhone className="infoIcon" />
            <p>
              Hotline: <a href="tel:19001234">1900 1234</a> (Hỗ trợ 24/7)
            </p>
          </div>
          <div className="infoItem">
            <FaEnvelope className="infoIcon" />
            <p>
              Email: <a href="mailto:support@tomato.com">support@tomato.com</a>
            </p>
          </div>
          <div className="infoItem">
            <FaClock className="infoIcon" />
            <p>Giờ làm việc: 8:00 - 22:00 (Hàng ngày)</p>
          </div>

          <h2 className="infoTitle" style={{ marginTop: "30px" }}>
            Theo Dõi Chúng Tôi
          </h2>
          {/* Bạn có thể thêm các biểu tượng mạng xã hội tại đây */}
          <div className="socialIcons">
            <a
              href="https://www.facebook.com/tomato.food"
              target="_blank"
              rel="noopener noreferrer"
              className="socialLink"
            >
              <FaFacebookSquare size={30} />
            </a>
            <a
              href="https://www.instagram.com/tomato.food"
              target="_blank"
              rel="noopener noreferrer"
              className="socialLink"
            >
              <FaInstagram size={30} />
            </a>
          </div>

          <p className="noteText">
            Lưu ý: Đối với việc đặt món, vui lòng sử dụng hệ thống đặt hàng trực
            tuyến của chúng tôi.
          </p>
        </div>
      </div>

      {/* Thêm Google Maps nhúng (tùy chọn) */}
      <div className="mapContainer">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.141561726712!2d106.6974720147926!3d10.7679357923236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4c3c3a3a3a%3A0x31752f4c3c3a3a3a!2zTmhhIEjDoG5nIFRvbWF0bw!5e0!3m2!1svi!2s!4v1678891234567!5m2!1svi!2s"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Vị trí nhà hàng Tomato"
        ></iframe>
      </div>
    </div>
  );
};
