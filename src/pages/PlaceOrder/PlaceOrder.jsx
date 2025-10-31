import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, user, combos } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const navigate = useNavigate();

  // ✅ Xử lý khi người dùng nhập thông tin
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // 🎟️ Khi chọn voucher, tính % giảm
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

  // 🚫 Nếu chưa đăng nhập hoặc giỏ hàng rỗng thì quay lại
  useEffect(() => {
    if (!token) {
      navigate("/cart");
      toast.error("Vui lòng đăng nhập để đặt hàng");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
      toast.error("Giỏ hàng của bạn đang trống");
    }
  }, [token, getTotalCartAmount, navigate]);

  // 💰 Định dạng VND
  const formatVND = (amount) =>
    amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const totalBeforeShipping = getTotalCartAmount();
  const shippingFee = totalBeforeShipping === 0 ? 0 : 30000;
  const total = totalBeforeShipping + shippingFee;
  const discountedTotal =
    discountPercent > 0
      ? Math.floor(total * (1 - discountPercent / 100))
      : total;

  // 🧾 Gửi đơn hàng
  const placeOrder = async (e) => {
    e.preventDefault();

    // ✅ Lấy danh sách sản phẩm từ giỏ hàng (hỗ trợ cả food_ và combo_)
    const orderItems = [];
    for (const key in cartItems) {
      const qty = cartItems[key];
      if (qty > 0) {
        const [type, id] = key.split("_");
        const dataList = type === "combo" ? combos : food_list;
        const product = dataList.find((p) => p._id === id);
        if (product) {
          orderItems.push({
            foodId: id,
            name: product.name,
            price:
              type === "combo"
                ? product.discountPrice || product.price
                : product.price,
            quantity: qty,
            type,
          });
        }
      }
    }

    if (orderItems.length === 0) {
      toast.error("Không có sản phẩm nào trong giỏ hàng");
      return;
    }

    const orderData = {
      userId: user?._id,
      address: data,
      items: orderItems,
      amount: discountedTotal,
      voucherCode: selectedVoucher || null,
    };

    console.log("🧾 Dữ liệu gửi lên server:", orderData);

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

  // 🧍 Giao diện hiển thị
  return (
    <form onSubmit={placeOrder} className="place-order">
      {/* ======== THÔNG TIN GIAO HÀNG ======== */}
      <div className="place-order-left">
        <p className="title">Thông tin giao hàng</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            type="text"
            placeholder="Tên"
            value={data.firstName}
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            type="text"
            placeholder="Họ"
            value={data.lastName}
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          type="email"
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
            name="city"
            onChange={onChangeHandler}
            type="text"
            placeholder="Thành phố"
            value={data.city}
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            type="text"
            placeholder="Quận/Huyện"
            value={data.state}
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipCode"
            onChange={onChangeHandler}
            type="text"
            placeholder="Mã bưu chính"
            value={data.zipCode}
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            type="text"
            placeholder="Quốc gia"
            value={data.country}
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

        {/* 🎟️ Voucher */}
        {user?.redeemedVouchers?.length > 0 ? (
          <div className="voucher-section">
            <label htmlFor="voucher">Chọn voucher:</label>
            <select
              id="voucher"
              value={selectedVoucher}
              onChange={(e) => setSelectedVoucher(e.target.value)}
            >
              <option value="">Không dùng voucher</option>
              {user.redeemedVouchers.map((v, i) => (
                <option key={i} value={v.code}>
                  {v.code} - Giảm {v.discountPercent}%
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="no-voucher">Bạn chưa có voucher nào</p>
        )}
      </div>

      {/* ======== TỔNG TIỀN ======== */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Tổng tiền giỏ hàng</h2>
          <div>
            <div className="cart-total-details">
              <p>Tổng phụ</p>
              <p>{formatVND(totalBeforeShipping)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí giao hàng</p>
              <p>{formatVND(shippingFee)}</p>
            </div>

            {discountPercent > 0 && (
              <>
                <hr />
                <div className="cart-total-details discount">
                  <p>Giảm giá ({discountPercent}%)</p>
                  <p>-{formatVND(total - discountedTotal)}</p>
                </div>
              </>
            )}
            <hr />
            <div className="cart-total-details">
              <b>Tổng cộng</b>
              <b>{formatVND(discountedTotal)}</b>
            </div>
          </div>
          <button type="submit">Tiến hành thanh toán</button>
        </div>
      </div>
    </form>
  );
};
