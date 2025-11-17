import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { assets } from "../../../assets/assets";
import { StoreContext } from "../../../context/StoreContext";
import {
  FaSearch,
  FaListAlt,
  FaHourglassHalf,
  FaTruck,
  FaCheckCircle,
  FaFilter,
} from "react-icons/fa";

export const Orders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc và tìm kiếm
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'Food Processing', 'Out for delivery', 'Delivered'

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const formatVND = (amount) => {
    return amount.toLocaleString("vi-VN");
  };

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/order/list`, {
        headers: { token },
      });
      if (response.data.success) {
        // Đảo ngược thứ tự để đơn hàng mới nhất lên đầu
        setOrders(response.data.orders.reverse());
      } else {
        toast.error("Lỗi không tìm thấy đơn hàng");
      }
    } catch (err) {
      toast.error("Lỗi máy chủ khi tải đơn hàng");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const newStatus = e.target.value;
      const response = await axios.post(
        `${url}/api/order/updatestatus`,
        {
          orderId,
          status: newStatus,
        },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(
          `Đơn hàng #${orderId.slice(
            -6
          )} đã được chuyển sang trạng thái: ${newStatus}`
        );
        fetchAllOrders();
      } else {
        toast.error("Lỗi cập nhật trạng thái đơn hàng");
      }
    } catch (err) {
      toast.error("Lỗi máy chủ khi cập nhật trạng thái đơn hàng");
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllOrders();
    }
  }, [token]);

  // ---- Bộ lọc + Tìm kiếm ----
  const filteredOrders = orders.filter((order) => {
    const orderIdShort = order._id.slice(-6).toLowerCase();
    const customerName =
      `${order.address.firstName} ${order.address.lastName}`.toLowerCase();

    const matchSearch =
      orderIdShort.includes(search.toLowerCase()) ||
      customerName.includes(search.toLowerCase());

    const matchFilter = filter === "all" || order.status === filter;

    return matchSearch && matchFilter;
  });

  // ---- Phân trang ----
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Đặt lại trang về 1 khi lọc/tìm kiếm thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  // Hàm hiển thị icon cho trạng thái
  const getStatusIcon = (status) => {
    switch (status) {
      case "Food Processing":
        return <FaHourglassHalf className="status-icon processing" />;
      case "Out for delivery":
        return <FaTruck className="status-icon delivery" />;
      case "Delivered":
        return <FaCheckCircle className="status-icon delivered" />;
      default:
        return <FaFilter className="status-icon all" />;
    }
  };

  const getFilterIcon = (type) => {
    const baseClass = "filter-icon";
    switch (type) {
      case "all":
        return <FaListAlt className={`${baseClass} all`} />;
      case "Food Processing":
        return <FaHourglassHalf className={`${baseClass} processing`} />;
      case "Out for delivery":
        return <FaTruck className={`${baseClass} delivery`} />;
      case "Delivered":
        return <FaCheckCircle className={`${baseClass} delivered`} />;
      default:
        return <FaFilter className={`${baseClass}`} />;
    }
  };

  return (
    <div className="orders-container">
      <h3>📋 Quản lý Đơn hàng</h3>

      {/* --- Thanh công cụ tìm kiếm và lọc --- */}
      <div className="order-tools">
        <div className="search-box pretty">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo ID hoặc Tên khách..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {[
          { key: "all", label: "Tất cả" },
          { key: "Food Processing", label: "Đang xử lý" },
          { key: "Out for delivery", label: "Đang giao" },
          { key: "Delivered", label: "Đã giao" },
        ].map((type) => (
          <button
            key={type.key}
            className={`filter-btn ${filter === type.key ? "active" : ""}`}
            onClick={() => setFilter(type.key)}
          >
            {getFilterIcon(type.key)}
            {type.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="orders-loading">Đang tải dữ liệu đơn hàng...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="orders-empty">
          Không tìm thấy đơn hàng nào khớp với tiêu chí.
        </p>
      ) : (
        <>
          <div className="order-list">
            {currentOrders.map((order, index) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <img src={assets.parcel_icon} alt="parcel icon" />
                  <h4>
                    Đơn hàng #
                    <span className="order-id">{order._id.slice(-6)}</span>
                  </h4>
                  {getStatusIcon(order.status)}
                </div>

                <div className="order-card-body">
                  <div className="order-items">
                    <p className="items-list-title">
                      Sản phẩm đã đặt ({order.items.length}):
                    </p>
                    <div className="order-item-list">
                      {order.items.map((item) => (
                        <div key={item._id} className="order-item">
                          <img
                            src={item.image || assets.default_food}
                            alt={item.name}
                            className="order-item-img"
                          />
                          <div className="order-item-info">
                            <p className="item-name">{item.name}</p>
                            <p className="item-quantity">
                              {item.quantity} x {formatVND(item.price)} VND
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-details">
                    <p className="order-total">
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
                    <div className="order-customer-info">
                      <p className="order-customer-name">
                        <strong className="customer-name-label">
                          Khách hàng:
                        </strong>{" "}
                        {order.address.firstName} {order.address.lastName}
                      </p>
                      <p className="order-customer-address">
                        <strong className="customer-name-label">
                          Địa chỉ:
                        </strong>{" "}
                        {order.address.street}, {order.address.district},{" "}
                        {order.address.city}
                      </p>
                      <p className="order-customer-phone">
                        <strong className="customer-name-label">
                          Điện thoại:
                        </strong>{" "}
                        {order.address.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="order-card-footer">
                  <label htmlFor={`status-select-${order._id}`}>
                    Trạng thái:
                  </label>
                  <select
                    id={`status-select-${order._id}`}
                    onChange={(e) => statusHandler(e, order._id)}
                    value={order.status || "Food Processing"}
                    // Disabled khi đã giao hàng để tránh thay đổi trạng thái
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

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ◀
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={currentPage === i + 1 ? "active" : ""}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                ▶
              </button>
            </div>
          )}
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};
