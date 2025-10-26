import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

export const Cart = () => {
  const {
    cartItems,
    food_list,
    combos,
    removeFromCart,
    getTotalCartAmount,
    clearCart,
    url,
  } = useContext(StoreContext);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");

  const formatVNDSimple = (amount = 0) => amount.toLocaleString("vi-VN");

  const allItems = [
    ...food_list.map((item) => ({ ...item, type: "food" })),
    ...combos.map((item) => ({ ...item, type: "combo" })),
  ];

  const filteredItems = allItems.filter((item) => {
    const key = `${item.type}_${item._id}`;
    return cartItems[key] > 0;
  });

  const getImageSrc = (item) => {
    if (!item.image) return `${url}/images/no-image.png`;
    if (item.image.startsWith("http")) return item.image;
    if (item.type === "combo" && !item.image.startsWith("images/")) {
      return `${url}/images/${item.image}`;
    }
    return `${url}/${item.image.replace(/^\/+/, "")}`;
  };

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

        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const key = `${item.type}_${item._id}`;
            const price = item.discountPrice || item.price;
            return (
              <div key={key}>
                <div className="cart-items-title cart-items-item">
                  <img src={getImageSrc(item)} alt={item.name} />
                  <p>
                    {item.type === "combo" ? `Combo: ${item.name}` : item.name}
                  </p>
                  <p>{formatVNDSimple(price)} VND</p>
                  <p>{cartItems[key]}</p>
                  <p>{formatVNDSimple(price * cartItems[key])} VND</p>
                  <p
                    onClick={() => removeFromCart(item._id, item.type)}
                    className="cross"
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          })
        ) : (
          <p className="empty-cart">🛒 Giỏ hàng của bạn đang trống</p>
        )}
      </div>

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

          <div className="cart-buttons">
            <button
              disabled={filteredItems.length === 0}
              onClick={() => navigate("/order")}
              className="checkout-btn"
            >
              Tiến hành thanh toán
            </button>
            <button
              onClick={clearCart}
              className="clear-cart-btn"
              disabled={filteredItems.length === 0}
            >
              🧹 Xóa giỏ hàng
            </button>
          </div>
        </div>

        <div className="cart-promocode">
          <div>
            <p>Nếu bạn có mã khuyến mãi, hãy nhập vào đây</p>
            <div className="cart-promocode-input">
              <input
                type="text"
                placeholder="Mã khuyến mãi"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={() => alert(`Mã khuyến mãi: ${promoCode}`)}>
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
