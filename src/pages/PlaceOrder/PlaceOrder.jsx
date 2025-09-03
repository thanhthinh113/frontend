import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
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

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    // Correctly calculate the total amount by adding the 30,000 VND delivery fee
    let orderData = {
      userId: localStorage.getItem("userId"),
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 30000,
    };
    let response = await axios.post(`${url}/api/order/place`, orderData, {
      headers: { token },
    });
    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      console.log(response.data);
      alert("Error placing order");
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/cart");
      toast.error("Vui lòng đăng nhập để đặt hàng");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
      toast.error("Giỏ hàng của bạn đang trống");
    }
  }, [token]);

  // Helper function to format numbers to VND
  const formatVND = (amount) => {
    return amount.toLocaleString("vi-VN");
  };

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
            <hr />
            <div className="cart-total-details">
              <b>Tổng cộng</b>
              <b>
                {getTotalCartAmount() === 0
                  ? "0 VND"
                  : formatVND(getTotalCartAmount() + 30000)}{" "}
                VND
              </b>
            </div>
          </div>
          <button type="submit">Tiến hành thanh toán</button>
        </div>
      </div>
    </form>
  );
};
