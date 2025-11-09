import React, { useContext, useEffect, useState } from "react";
import "./myorders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";

export const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const formatVND = (amount) => {
    return amount.toLocaleString("vi-VN");
  };
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
              <div className="order-details-group">
                <div className="order-items-list">
                  <div className="order-items-list">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="order-item">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="order-item-img"
                        />
                        <div className="order-item-info">
                          <p className="order-item-name">{item.name}</p>
                          <p className="order-item-qty">
                            Số lượng: <strong>{item.quantity}</strong>
                          </p>
                          <p className="order-item-price">
                            Giá: <strong>{formatVND(item.price)} VND</strong>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="order-customer-info">
                  <p>
                    <strong>
                      {order.address.firstName} {order.address.lastName}
                    </strong>
                  </p>
                  <p className="order-address">
                    {order.address.street}, {order.address.district},{" "}
                    {order.address.city}
                  </p>
                  <p className="order-phone">
                    <strong>Phone:</strong> {order.address.phone}
                  </p>
                </div>
              </div>

              <div className="order-info-group">
                <img src={assets.parcel_icon} alt="parcel icon" />
                <p>
                  Tổng tiền: <strong>{formatVND(order.amount)} VND</strong>
                </p>
                <p>
                  Số lượng: <strong>{order.items.length}</strong> sản phẩm
                </p>
                <p>
                  Ngày đặt:{" "}
                  <strong>
                    {new Date(order.date).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </strong>
                </p>
                <p className="order-status">
                  <span>&#x25cf;</span>
                  <b>{order.status}</b>
                </p>
                <button>Theo dõi đơn hàng</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
