import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./orders.css";
import { toast } from "react-toastify";
import { assets } from "../../../assets/assets";
import { StoreContext } from "../../../context/StoreContext";

export const Orders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const formatVND = (amount) => {
    return amount.toLocaleString("vi-VN");
  };

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`, {
        headers: { token },
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (err) {
      toast.error("Server error fetching orders");
      console.error(err);
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const response = await axios.post(
        `${url}/api/order/updatestatus`,
        {
          orderId,
          status: e.target.value,
        },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Order status updated");
        fetchAllOrders();
      } else {
        toast.error("Error updating order status");
      }
    } catch (err) {
      toast.error("Server error updating order status");
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllOrders();
    }
  }, [token]);
  return (
    <div className="orders-container">
      <h3>Quản lý Đơn hàng</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-card">
            <div className="order-card-header">
              <img src={assets.parcel_icon} alt="parcel icon" />
              {/* Hiển thị 6 ký tự cuối cùng của ID đơn hàng */}
              <h4>
                {index + 1}. Đơn hàng #{order._id.slice(-6)}
              </h4>
            </div>

            <div className="order-card-body">
              <div className="order-items">
                <p className="order-item-list">
                  {order.items.map((item, itemIndex) => (
                    <span key={itemIndex}>
                      {item.name} x {item.quantity}
                      {itemIndex < order.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
                <div className="order-customer-info">
                  <p className="order-customer-name">
                    <strong>
                      {order.address.firstName} {order.address.lastName}
                    </strong>
                  </p>
                  <p className="order-customer-address">
                    {order.address.street}, {order.address.district},{" "}
                    {order.address.city}
                  </p>
                  <p className="order-customer-phone">{order.address.phone}</p>
                </div>
              </div>

              <div className="order-details">
                <p>
                  Số lượng: <strong>{order.items.length}</strong> sản phẩm
                </p>
                <p>
                  Tổng tiền: <strong>{formatVND(order.amount)} VND</strong>
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
              </div>
            </div>

            <div className="order-card-footer">
              <label htmlFor={`status-select-${order._id}`}>Trạng thái:</label>
              <select
                id={`status-select-${order._id}`}
                onChange={(e) => statusHandler(e, order._id)}
                value={order.status || "Food Processing"}
                disabled={order.status === "Delivered"}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
