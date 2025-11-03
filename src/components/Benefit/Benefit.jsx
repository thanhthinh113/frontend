import React from "react";
import "./Benefit.css";
import { Package, Truck, Star, Sandwich } from "lucide-react";

export const Benefit = () => {
  return (
    <div className="service-page">
      <div className="service-features">
        <div className="feature-box">
          <Package className="feature-icon" />
          <div>
            <h4>Hàng hoá</h4>
            <p>Luôn luôn tươi ngon</p>
          </div>
        </div>

        <div className="feature-box">
          <Truck className="feature-icon" />
          <div>
            <h4>Giao hàng</h4>
            <p>Nhanh chóng, tiết kiệm</p>
          </div>
        </div>

        <div className="feature-box">
          <Star className="feature-icon" />
          <div>
            <h4>Tích điểm</h4>
            <p>Nhận ưu đãi khi mua hàng</p>
          </div>
        </div>

        <div className="feature-box">
          <Sandwich className="feature-icon" />
          <div>
            <h4>Thực phẩm</h4>
            <p>Vệ sinh, an toàn</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefit;
