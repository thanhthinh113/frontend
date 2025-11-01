import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  FaUsers,
  FaShoppingCart,
  FaUtensils,
  FaDollarSign,
  FaTags,
  FaLayerGroup,
} from "react-icons/fa";
import "./analytics.css";
import { StoreContext } from "../../../context/StoreContext";
import StatCard from "../../components/StatCard/StatCard";

const Analytics = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { url } = useContext(StoreContext);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${url}/api/analytics/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummaryData(response.data.data);
    } catch (err) {
      console.error("Lỗi khi fetch dữ liệu thống kê:", err);
      setError(
        "Không thể tải dữ liệu thống kê. Vui lòng kiểm tra quyền truy cập."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading)
    return <div className="dashboard-loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;
  if (!summaryData)
    return <div className="dashboard-empty">Không có dữ liệu thống kê.</div>;

  const {
    totals,
    revenue,
    orderStatus,
    topSellingFoods,
    monthlySales,
    categorySales,
    voucherStats,
  } = summaryData;

  const statusMap = orderStatus.reduce((acc, curr) => {
    acc[curr._id || "Không xác định"] = curr.count;
    return acc;
  }, {});
  const statusTranslations = {
    "Food Processing": { label: "Food Processing", class: "status-dang-xu-ly" },
    "Out for delivery": {
      label: "Out for delivery",
      class: "status-dang-giao-hang",
    },
    Delivered: { label: "Delivered", class: "status-da-giao" },
  };

  return (
    <div className="analytics-dashboard">
      <h3>📊 Bảng điều khiển Quản trị (Dashboard)</h3>

      {/* Tổng quan */}
      <div className="stats-grid">
        <StatCard
          title="Tổng Doanh thu"
          value={revenue}
          icon={<FaDollarSign />}
          className="revenue"
        />
        <StatCard
          title="Tổng Đơn hàng"
          value={totals.orders}
          icon={<FaShoppingCart />}
          className="orders"
        />
        <StatCard
          title="Tổng Người dùng"
          value={totals.users}
          icon={<FaUsers />}
          className="users"
        />
        <StatCard
          title="Tổng Món ăn"
          value={totals.foods}
          icon={<FaUtensils />}
          className="foods"
        />
        <StatCard
          title="Danh mục"
          value={totals.categories}
          icon={<FaLayerGroup />}
          className="categories"
        />
        {voucherStats && (
          <StatCard
            title="Số Voucher sử dụng"
            value={voucherStats.used || 0}
            icon={<FaTags />}
            className="vouchers"
          />
        )}
      </div>

      {/* Phần nội dung chi tiết */}
      <div className="data-sections-grid full-width">
        {/* 1. Doanh thu theo tháng */}
        <div className="monthly-sales-section panel full-row">
          <h3>📅 Thống kê Doanh thu theo Tháng</h3>
          {monthlySales?.length ? (
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Tháng</th>
                  <th>Tổng đơn hàng</th>
                  <th className="revenue-col">Doanh thu (VNĐ)</th>
                </tr>
              </thead>
              <tbody>
                {monthlySales.map((item, index) => (
                  <tr key={index}>
                    <td>{`${item._id.month}/${item._id.year}`}</td>
                    <td>{item.totalOrders}</td>
                    <td className="revenue-col">
                      {item.totalRevenue.toLocaleString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data-msg">
              Không có dữ liệu doanh thu theo tháng.
            </div>
          )}
        </div>

        {/* 2. Doanh thu theo danh mục */}
        {/* <div className="category-sales-section panel full-row">
          <h3>🍱 Thống kê Doanh thu theo Danh mục</h3>
          {categorySales?.length ? (
            <ol className="top-list">
              {categorySales.map((cat, index) => (
                <li key={index}>
                  <span className="rank-num">{index + 1}.</span>
                  <span className="food-name">{cat.categoryName}</span>
                  <span className="quantity">
                    {cat.totalQuantity} sp |{" "}
                    {cat.totalRevenue.toLocaleString("vi-VN")}đ
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="no-data-msg">Không có dữ liệu danh mục.</div>
          )}
        </div> */}

        {/* 3. Trạng thái đơn hàng */}
        <div className="status-section panel">
          <h3>📦 Trạng thái Đơn hàng</h3>
          <ul className="status-list">
            {Object.entries(statusMap).map(([status, count]) => {
              const s = statusTranslations[status] || {
                label: status,
                class: "",
              };
              return (
                <li key={status}>
                  <span className={`status-label ${s.class}`}>{s.label}</span>
                  <span className="status-count">{count}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 4. Top 5 món bán chạy */}
        <div className="top-selling-section panel">
          <h3>🔥 Top 5 Món ăn Bán chạy</h3>
          <ol className="top-list">
            {topSellingFoods?.length ? (
              topSellingFoods.map((item, index) => (
                <li key={index}>
                  <span className="rank-num">{index + 1}.</span>
                  <span className="food-name">{item.name}</span>
                  <span className="quantity">
                    ({item.totalQuantity} lượt bán)
                  </span>
                </li>
              ))
            ) : (
              <div className="no-data-msg">Không có món ăn bán chạy.</div>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
