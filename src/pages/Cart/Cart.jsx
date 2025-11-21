// src/pages/Cart/Cart.jsx

import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

export const Cart = () => {
  // Lấy thêm 'combos' từ StoreContext
  const { cartItems, food_list, combos, removeFromCart, getTotalCartAmount } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const formatVNDSimple = (amount) => {
    return amount.toLocaleString("vi-VN");
  };

  // 🧠 HÀM MỚI: Tìm chi tiết (Tên, Ảnh, Giá) của Food hoặc Combo dựa trên ID
  const getItemDetails = (itemId) => {
    // 1. Tìm trong danh sách Food
    let item = food_list.find((f) => f._id === itemId);
    let itemType = "food";

    // 2. Nếu không phải Food, tìm trong danh sách Combo
    if (!item) {
      item = combos.find((c) => c._id === itemId);
      itemType = "combo";
    }

    if (item) {
      // Trích xuất giá (dùng discountPrice nếu có cho Combo)
      const price =
        itemType === "combo" ? item.discountPrice || item.price : item.price;

      return {
        ...item,
        price: price, // Sử dụng giá đã được xử lý (đơn vị/combo)
        isCombo: itemType === "combo",
      };
    }
    return null; // Không tìm thấy
  };

  // Lấy tất cả các ID có trong giỏ hàng
  const itemIdsInCart = Object.keys(cartItems).filter(
    (itemId) => cartItems[itemId] > 0
  );

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Sản phẩm</p>
          <p>Tên</p>
          <p>Giá</p>
          <p>Số lượng</p>
          <p>Tổng</p>
          <p>Xóa</p>
        </div>
        <br />
        <hr />

        {/* 🔄 Lặp qua TẤT CẢ các ID có trong cartItems */}
        {itemIdsInCart.map((itemId) => {
          const item = getItemDetails(itemId);
          const quantity = cartItems[itemId];

          if (item && quantity > 0) {
            return (
              <div key={item._id}>
                <div
                  className={`cart-items-title cart-items-item ${
                    item.isCombo ? "combo-item" : ""
                  }`}
                >
                  <img src={`${item.image}`} alt={item.name} />
                  <p>
                    {item.name}
                    {/* 🏷️ Thêm tag 'Combo' nếu là combo */}
                    {item.isCombo && <span className="combo-badge">Combo</span>}
                  </p>
                  <p>{formatVNDSimple(item.price)} VND</p>
                  <p>{quantity}</p>
                  <p>{formatVNDSimple(item.price * quantity)} VND</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null; // Bỏ qua nếu không tìm thấy item
        })}
      </div>

      {/* ... (Phần cart-bottom giữ nguyên) ... */}

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Tổng tiền giỏ hàng</h2>
          <div>
            <div className="cart-total-details">
              <p>Tổng phụ</p>
              <p>{formatVNDSimple(getTotalCartAmount())} VND</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí giao hàng</p>
              <p>{getTotalCartAmount() === 0 ? "0 VND" : "30.000 VND"}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Tổng cộng</b>
              <b>
                {getTotalCartAmount() === 0
                  ? "0 VND"
                  : formatVNDSimple(getTotalCartAmount() + 30000)}{" "}
                VND
              </b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            Tiến hành thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};
