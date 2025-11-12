import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, user } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    district: "",
    phone: "",
  });

  const [selectedVoucher, setSelectedVoucher] = useState(""); // voucher code được chọn
  const [discountPercent, setDiscountPercent] = useState(0);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  // Khi chọn voucher -> cập nhật discount
  useEffect(() => {
    if (!selectedVoucher || !user?.redeemedVouchers) {
      setDiscountPercent(0);
      return;
    }
    const voucher = user.redeemedVouchers.find(
      (v) => v.code === selectedVoucher
    );
    setDiscountPercent(voucher ? voucher.discountPercent : 0);
  }, [selectedVoucher, user]);

  const navigate = useNavigate();

  const placeOrder = async (e) => {
    e.preventDefault();

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          foodId: item._id,
          name: item.name,
          price: item.price,
          quantity: cartItems[item._id],
          image: item.image,
          description: item.description,
          categoryId: item.categoryId,
        });
      }
    });

    // Tổng tiền tạm tính
    let totalAmount = getTotalCartAmount() + 30000;

    // // Giảm giá nếu có voucher
    // if (discountPercent > 0) {
    //   totalAmount = Math.floor(totalAmount * (1 - discountPercent / 100));
    // }

    const orderData = {
      userId: user?._id,
      address: data,
      items: orderItems,
      amount: totalAmount,
      voucherCode: selectedVoucher || null, // 🧾 gửi voucher lên backend
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });
      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        toast.error(response.data.message || "Lỗi khi đặt hàng");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối đến server");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/cart");
      toast.error("Vui lòng đăng nhập để đặt hàng");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
      toast.error("Giỏ hàng của bạn đang trống");
    }
  }, [token]);

  const formatVND = (amount) => amount.toLocaleString("vi-VN");

  const total = getTotalCartAmount() + 30000;
  const discountedTotal =
    discountPercent > 0 ? Math.max(total - discountPercent, 0) : total;

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Thông tin giao hàng</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            type="text"
            placeholder="Họ"
            value={data.firstName}
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            type="text"
            placeholder="Tên"
            value={data.lastName}
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          type="text"
          placeholder="Địa chỉ Email"
          value={data.email}
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          type="text"
          placeholder="Tên đường, số nhà"
          value={data.street}
        />
        <div className="multi-fields">
          <input
            required
            name="district"
            onChange={onChangeHandler}
            type="text"
            placeholder="Quận/Huyện"
            value={data.district}
          />
          <input
            required
            name="city"
            onChange={onChangeHandler}
            type="text"
            placeholder="Thành phố"
            value={data.city}
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          type="text"
          placeholder="Số điện thoại"
          value={data.phone}
        />

        {/* 🎟️ Voucher Section */}
        <div className="voucher-section">
          <h3>🧾 Voucher của bạn</h3>

          {!user?.redeemedVouchers || user.redeemedVouchers.length === 0 ? (
            <p className="no-voucher">Bạn chưa có voucher nào</p>
          ) : (
            <div className="voucher-list">
              {Object.entries(
                user.redeemedVouchers.reduce((acc, v) => {
                  const key = v.code;
                  if (!acc[key]) acc[key] = { ...v, count: 0 };
                  acc[key].count += 1;
                  return acc;
                }, {})
              ).map(([code, v]) => {
                const isExpired = new Date(v.expiryDate) < new Date();
                const isSelected = selectedVoucher === v.code;

                return (
                  <div
                    key={code}
                    className={`voucher-card ${isSelected ? "selected" : ""} ${
                      isExpired ? "expired" : ""
                    }`}
                    onClick={() => {
                      if (isExpired) return;
                      setSelectedVoucher(isSelected ? "" : v.code);
                    }}
                  >
                    {v.count > 1 && (
                      <span className="voucher-badge">x{v.count}</span>
                    )}
                    <h4>{v.code}</h4>
                    <p>Giảm: {formatVND(v.discountPercent)} VND</p>
                    <p>
                      Hết hạn: {new Date(v.expiryDate).toLocaleDateString()}
                    </p>
                    <p
                      className={isExpired ? "status-expired" : "status-active"}
                    >
                      {isExpired ? "⛔ Hết hạn" : "✅ Còn hiệu lực"}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Tổng tiền giỏ hàng</h2>
          <div>
            <div className="cart-total-details">
              <p>Tổng phụ</p>
              <p>{formatVND(getTotalCartAmount())} VND</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí giao hàng</p>
              <p>{getTotalCartAmount() === 0 ? "0 VND" : "30.000 VND"}</p>
            </div>

            {discountPercent > 0 && (
              <>
                <hr />
                <div className="cart-total-details discount">
                  <p>Voucher</p>
                  <p>-{formatVND(total - discountedTotal)} VND</p>
                </div>
              </>
            )}
            <hr />
            <div className="cart-total-details">
              <b>Tổng cộng</b>
              <b>{formatVND(discountedTotal)} VND</b>
            </div>
          </div>
          <button type="submit">Tiến hành thanh toán</button>
        </div>
      </div>
    </form>
  );
};
