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
    addToCart,
    updateCartItem,
    getTotalCartAmount,
    clearCart,
    url,
    token,
  } = useContext(StoreContext);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");

  const formatVNDSimple = (amount = 0) => (amount || 0).toLocaleString("vi-VN");

  // Ghép danh sách món ăn và combo vào map
  const allKnown = {};
  food_list.forEach(
    (f) => (allKnown[`food_${f._id}`] = { ...f, type: "food" })
  );
  combos.forEach((c) => (allKnown[`combo_${c._id}`] = { ...c, type: "combo" }));

  const cartKeys = Object.keys(cartItems || {});
  const itemsForRender = cartKeys.map((key) => {
    const qty = cartItems[key] || 0;
    const [type, id] = key.split("_");
    let item = allKnown[key];
    if (!item) {
      item = {
        _id: id,
        name: "Sản phẩm (chưa tải)",
        price: 0,
        discountPrice: 0,
        image: null,
        type,
      };
    }
    return { key, item, qty };
  });

  const getImageSrc = (item) => {
    if (!item || !item.image) return `${url}/images/no-image.png`;
    if (item.image.startsWith("http")) return item.image;
    return `${url}/${item.image.replace(/^\/+/, "")}`;
  };

  const onDecrease = (item) => {
    removeFromCart(item._id, item.type || "food", 1);
  };

  const onIncrease = (item) => {
    addToCart(item, 1, item.type || "food");
  };

  const onSetQuantity = (item, newQty) => {
    updateCartItem(item._id, item.type || "food", Number(newQty));
  };

  const handleClearCart = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng không?")) {
      await clearCart();
      alert("🧹 Giỏ hàng đã được xóa!");
    }
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

        {itemsForRender.length > 0 ? (
          itemsForRender.map(({ key, item, qty }) => {
            const price = item.discountPrice || item.price || 0;
            return (
              <div key={key}>
                <div className="cart-items-title cart-items-item">
                  <img src={getImageSrc(item)} alt={item.name} />
                  <p>
                    {item.type === "combo" ? `Combo: ${item.name}` : item.name}
                  </p>
                  <p>{formatVNDSimple(price)} VND</p>

                  <div className="qty-controls">
                    <button
                      onClick={() => onDecrease(item)}
                      disabled={qty <= 0}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => {
                        const v = Number(e.target.value) || 0;
                        if (v <= 0) updateCartItem(item._id, item.type, 0);
                        else onSetQuantity(item, v);
                      }}
                    />
                    <button onClick={() => onIncrease(item)}>+</button>
                  </div>

                  <p>{formatVNDSimple(price * qty)} VND</p>
                  <p
                    onClick={() => updateCartItem(item._id, item.type, 0)}
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
              disabled={itemsForRender.length === 0}
              onClick={() => navigate("/order")}
              className="checkout-btn"
            >
              Tiến hành thanh toán
            </button>
            <button
              onClick={handleClearCart}
              className="clear-cart-btn"
              disabled={itemsForRender.length === 0}
            >
              🧹 Xóa giỏ hàng
            </button>
          </div>
          <p className="cart-hint">
            {token
              ? "🧍 Bạn đang dùng giỏ hàng của tài khoản."
              : "👤 Bạn đang dùng giỏ hàng tạm (chưa đăng nhập)."}
          </p>
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
