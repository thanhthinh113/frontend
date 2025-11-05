import React from "react";
import "./AboutPage.css";
import { assets } from "../../assets/assets"; // Giả định bạn có assets như icons, images.
import { FaHeart, FaTruck, FaLeaf, FaSmile } from "react-icons/fa"; // Dùng icons để thêm tính trực quan
import { useNavigate } from "react-router-dom";

export const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div className="about-page">
      {/* 1. Header/Banner Giới thiệu */}
      <div className="about-header">
        <div className="about-header-content">
          <h1 className="about-title">
            🍅 Chuyện của Tomato: Hương Vị Tận Tâm
          </h1>
          <p className="about-subtitle">
            Chúng tôi không chỉ giao đồ ăn, chúng tôi giao trọn vẹn trải nghiệm
            ẩm thực chất lượng, tươi mới và tiện lợi đến mọi nhà.
          </p>
          <img
            src="/images/slider6.png"
            alt="Food delivery experience"
            className="header-image-desktop"
          />
        </div>
      </div>

      {/* 2. Sứ mệnh */}
      <section className="about-section mission-section">
        <h2>Sứ Mệnh Của Chúng Tôi</h2>
        <p>
          Tomato ra đời với niềm tin rằng mọi người đều xứng đáng được thưởng
          thức những bữa ăn ngon miệng và chất lượng mà không cần rời khỏi nhà.
          <strong> Sứ mệnh</strong> của chúng tôi là{" "}
          <strong>thu hẹp khoảng cách </strong>
          giữa thực khách và những tinh hoa ẩm thực địa phương bằng một nền tảng
          công nghệ thông minh, đáng tin cậy.
        </p>
      </section>

      {/* 3. Giá trị Cốt lõi */}
      <section className="about-section values-section">
        <h2>Giá Trị Cốt Lõi</h2>
        <div className="values-grid">
          <div className="value-item">
            <FaLeaf size={40} color="#27ae60" />
            <h3>Chất Lượng Tươi Mới</h3>
            <p>
              Cam kết hợp tác với các nhà hàng uy tín, sử dụng nguyên liệu sạch,
              đảm bảo món ăn luôn giữ được hương vị hoàn hảo khi đến tay bạn.
            </p>
          </div>
          <div className="value-item">
            <FaTruck size={40} color="#e74c3c" />
            <h3>Giao Hàng Tốc Độ</h3>
            <p>
              Áp dụng công nghệ tối ưu hóa lộ trình để rút ngắn thời gian giao
              hàng, giữ cho món ăn nóng sốt và nguyên vẹn.
            </p>
          </div>
          <div className="value-item">
            <FaSmile size={40} color="#f39c12" />
            <h3>Dịch Vụ Tận Tâm</h3>
            <p>
              Đội ngũ hỗ trợ khách hàng luôn sẵn sàng lắng nghe và giải quyết
              mọi vấn đề 24/7, mang đến sự hài lòng tuyệt đối.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Cam kết và Lời mời */}
      <section className="about-section commitment-section">
        <h2>🤝 Tham Gia Cộng Đồng Tomato</h2>
        <p>
          Hơn cả một ứng dụng, Tomato là cộng đồng những người yêu ẩm thực.
          Chúng tôi không ngừng cải tiến để mang lại sự tiện lợi tối đa. Hãy tải
          ứng dụng ngay hôm nay để khám phá hàng ngàn món ăn đặc sắc và trải
          nghiệm dịch vụ giao hàng hàng đầu!
        </p>
        <button className="cta-button-about" onClick={() => navigate("/menu")}>
          <FaHeart /> Bắt Đầu Đặt Món
        </button>
      </section>
    </div>
  );
};
