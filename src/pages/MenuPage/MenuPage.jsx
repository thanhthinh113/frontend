import React, { useContext } from "react";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import { FoodDisplay } from "../../components/FoodDisplay/FoodDisplay";
import { StoreContext } from "../../context/StoreContext";
import "./MenuPage.css";

export const MenuPage = () => {
  const { food_list } = useContext(StoreContext);

  return (
    <div className="menu-page">
      {/* 💡 THÀNH PHẦN MỚI: HEADER / BANNER RIÊNG CHO TRANG MENU */}
      <div className="menu-header">
        <div className="menu-header-content">
          <h1 className="menu-page-title">Khám Phá Thực Đơn Tuyệt Hảo</h1>
          <p className="menu-page-subtitle">
            Khám phá thế giới hương vị của chúng tôi! Từ món khai vị nhẹ nhàng
            đến món chính đậm đà, mỗi món ăn đều được chế biến từ nguyên liệu
            tươi ngon nhất.
          </p>
          <a href="#menu-display-section" className="menu-cta-button">
            Bắt Đầu Đặt Món Ngay
          </a>
        </div>
      </div>

      {/* 1. Thanh Menu (Lọc theo danh mục) */}
      <section className="menu-section-explore">
        <ExploreMenu />
      </section>

      {/* 2. Danh sách món ăn (Tìm kiếm, Lọc, Sắp xếp) */}
      <section className="menu-section-display" id="menu-display-section">
        <h2 className="display-title">Tất Cả Các Món</h2>
        {food_list && food_list.length > 0 ? (
          <FoodDisplay foodList={food_list} />
        ) : (
          <p className="loading-message">Đang tải món ăn...</p>
        )}
      </section>

      {/* 💡 THÀNH PHẦN MỚI: VÙNG GIỚI THIỆU/CAM KẾT (Tùy chọn) */}
      <section className="menu-commitment">
        <h3>Cam Kết Chất Lượng</h3>
        <p>
          Chúng tôi cam kết sử dụng 100% nguyên liệu sạch và tươi mới, đảm bảo
          trải nghiệm ẩm thực an toàn và ngon miệng nhất cho Quý khách.
        </p>
      </section>
    </div>
  );
};
