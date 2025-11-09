import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../../context/StoreContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./AdminDashboard.css";

export const AdminDashboard = () => {
  const { url, token } = useContext(StoreContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${url}/api/admin/stats`, {
          headers: { token },
        });
        if (res.data.success) {
          setStats(res.data.data);
        } else {
          console.error("Không thể lấy dữ liệu thống kê:", res.data.message);
        }
      } catch (err) {
        console.error("Lỗi khi lấy thống kê:", err);
      }
    };
    fetchStats();
  }, [url, token]);

  if (!stats) return <div className="loading">Đang tải thống kê...</div>;

  const revenueData = stats.revenueByMonth.map((m) => ({
    month: `Tháng ${m._id}`,
    revenue: m.revenue,
  }));

  return (
    <div className="admin-dashboard">
      <h1>📊 Thống kê tổng quan</h1>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Doanh thu</h3>
          <p>{stats.totalRevenue.toLocaleString()} VND</p>
        </div>

        <div className="card">
          <h3>Đơn hàng</h3>
          <p>Tổng: {stats.orderCounts.total}</p>
          <p>Đang xử lý: {stats.orderCounts.pending}</p>
          <p>Đã giao: {stats.orderCounts.delivered}</p>
          <p>Đã hủy: {stats.orderCounts.canceled}</p>
        </div>

        <div className="card">
          <h3>Người dùng</h3>
          <p>{stats.totalUsers}</p>
        </div>

        <div className="card">
          <h3>Món ăn</h3>
          <p>{stats.totalFoods}</p>
        </div>
      </div>

      <div className="chart-section">
        <h2>📈 Doanh thu theo tháng</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="top-foods">
        <h2>🍜 Món ăn bán chạy</h2>
        <div className="food-list">
          {stats.foodStats.map((food) => (
            <div key={food._id} className="food-item">
              <img src={`${url}/images/${food.image}`} alt={food.name} />
              <div>
                <p>
                  <strong>{food.name}</strong>
                </p>
                <p>Đã bán: {food.totalSold}</p>
                <p>Doanh thu: {food.totalRevenue.toLocaleString()} VND</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
