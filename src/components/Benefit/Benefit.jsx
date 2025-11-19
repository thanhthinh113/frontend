// src/components/Benefit/Benefit.jsx
import React from "react";
import { useInView } from "react-intersection-observer"; // <-- Import hook
import "./Benefit.css";
import { Package, Truck, Star, Sandwich } from "lucide-react";

export const Benefit = () => {
  // 1. Sử dụng useInView cho container chính
  const [ref, inView] = useInView({
    triggerOnce: false, // Kích hoạt lại mỗi lần cuộn vào/ra
    threshold: 0.2, // Kích hoạt khi 20% component hiển thị
  });

  // 2. Hàm lấy class animation
  const getAnimationClass = (index) => {
    if (!inView) return "initial-hidden"; // Trạng thái ẩn ban đầu

    if (index === 0) return "slide-in-left"; // Box 1: Từ trái qua
    if (index === 1) return "slide-in-bottom"; // Box 2: Từ dưới lên
    if (index === 2) return "slide-in-top"; // Box 3: Từ trên xuống
    if (index === 3) return "slide-in-right"; // Box 4: Từ phải qua

    return "";
  };

  // 3. Hàm lấy delay (để các box xuất hiện lần lượt)
  const getDelayStyle = (index) => {
    // 0s, 0.1s, 0.2s, 0.3s
    return { animationDelay: `${index * 0.1}s` };
  };

  // Danh sách các Box để map (dễ quản lý hơn)
  const featureData = [
    { icon: Package, title: "Hàng hoá", description: "Luôn luôn tươi ngon" },
    { icon: Truck, title: "Giao hàng", description: "Nhanh chóng, tiết kiệm" },
    { icon: Star, title: "Tích điểm", description: "Nhận ưu đãi khi mua hàng" },
    { icon: Sandwich, title: "Thực phẩm", description: "Vệ sinh, an toàn" },
  ];

  return (
    <div className="service-page" ref={ref}>
      {" "}
      {/* <-- Gắn ref vào container */}
      <h2 className="service-page-title">
        Tomato Cam Kết Đồ Ăn Tươi Ngon, Giao Hàng Siêu Tốc!
      </h2>
      <div className="service-features">
        {featureData.map((feature, index) => {
          const IconComponent = feature.icon;
          const animationClass = inView
            ? getAnimationClass(index)
            : "initial-hidden";

          return (
            <div
              key={index}
              className={`feature-box ${animationClass}`}
              style={getDelayStyle(index)} // Áp dụng delay
            >
              <IconComponent className="feature-icon" />
              <div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Benefit;
