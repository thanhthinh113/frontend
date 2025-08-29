import React, { useContext, useEffect, useState } from "react";
import "./myorders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
export const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await axios.post(
      `${url}/api/order/userorders`,
      {},
      { headers: { token } }
    );
    setData(response.data.orders);
    console.log(response.data.orders);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              {/* Hiển thị hình ảnh gói hàng chung hoặc hình ảnh sản phẩm đầu tiên */}
              <img src={assets.parcel_icon} alt="parcel icon" />

              {/* Hiển thị danh sách sản phẩm một cách chi tiết hơn */}
              <div className="order-items-list">
                {order.items.map((item, itemIndex) => (
                  <p key={itemIndex}>
                    {item.name} x {item.quantity}
                  </p>
                ))}
              </div>

              <p>Tổng tiền: {order.amount} VND</p>
              <p>Số lượng sản phẩm: {order.items.length}</p>
              <p className="order-status">
                <span>&#x25cf;</span>
                <b>{order.status}</b>
              </p>
              <button>Theo dõi đơn hàng</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
