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
              <div className="order-details-group">
                <div className="order-items-list">
                  <p>
                    {order.items.map((item, itemIndex) => (
                      <span key={itemIndex}>
                        {item.name} x {item.quantity}
                        {itemIndex < order.items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="order-customer-info">
                  <p>
                    <strong>
                      {order.address.firstName} {order.address.lastName}
                    </strong>
                  </p>
                  <p className="order-address">
                    {order.address.street}, {order.address.city},{" "}
                    {order.address.country}
                  </p>
                  <p className="order-phone">
                    <strong>Phone:</strong> {order.address.phone}
                  </p>
                </div>
              </div>

              <div className="order-info-group">
                <img src={assets.parcel_icon} alt="parcel icon" />
                <p>
                  Tổng tiền: <strong>{order.amount} VND</strong>
                </p>
                <p>
                  Số lượng: <strong>{order.items.length}</strong> sản phẩm
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
