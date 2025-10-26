import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

export const Cart = () => {
  const { cartItems, food_list, combos, removeFromCart, getTotalCartAmount, url } =
    useContext(StoreContext);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");

  const formatVNDSimple = (amount = 0) => amount.toLocaleString("vi-VN");

  const hasItems = Object.keys(cartItems).length > 0;

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

        {hasItems ? (
          Object.keys(cartItems).map((key) => {
            const [type, id] = key.split("_");
            let itemData;

            if (type === "combo") {
              itemData = combos?.find((c) => c._id === id);
            } else {
              itemData = food_list?.find((f) => f._id === id);
            }

            if (!itemData) return null;

            const price = itemData.discountPrice || itemData.price;
            const quantity = cartItems[key];
            const total = price * quantity;

            return (
              <div key={key}>
                <div className="cart-items-title cart-items-item">
                  <img
                    src={
                      itemData.image?.startsWith("http")
                        ? itemData.image
                        : `${url}/images/${itemData.image}`
                    }
                    alt={itemData.name}
                  />
                  <p>{type === "combo" ? `Combo: ${itemData.name}` : itemData.name}</p>
                  <p>{formatVNDSimple(price)} VND</p>
                  <p>{quantity}</p>
                  <p>{formatVNDSimple(total)} VND</p>
                  <p onClick={() => removeFromCart(key)} className="cross">
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
          <button
            disabled={!hasItems}
            onClick={() => navigate("/order")}
          >
            Tiến hành thanh toán
          </button>
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
