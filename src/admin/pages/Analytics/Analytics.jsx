import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  FaUsers,
  FaShoppingCart,
  FaUtensils,
  FaDollarSign,
  FaTags,
  FaLayerGroup,
  FaEnvelope,
} from "react-icons/fa";
import "./Analytics.css";
import { StoreContext } from "../../../context/StoreContext";
import StatCard from "../../components/StatCard/StatCard";

// Import Recharts components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Analytics = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentRevenueView, setCurrentRevenueView] = useState("monthly");
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
  }, []); // Chỉ fetch một lần khi component mount

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
    weeklySales,
    voucherStats,
  } = summaryData;

  // --- Chuẩn bị dữ liệu cho biểu đồ cột Doanh thu theo tháng ---
  const monthlyRevenueChartData = monthlySales
    .map((item) => ({
      name: `Tháng ${item._id.month} / ${item._id.year}`, // ⭐ Thêm năm vào biểu đồ
      DoanhThu: item.totalRevenue,
      month: item._id.month,
      year: item._id.year,
    }))
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

  // --- Chuẩn bị dữ liệu cho biểu đồ tròn Trạng thái đơn hàng ---
  const PIE_COLOR_MAP = {
    // Tên trạng thái sau khi đã dịch (label) -> Mã màu
    "Đã giao": "#28a745", // Xanh lá
    "Đang giao hàng": "#007bff", // Xanh dương
    "Đang xử lý": "#ffc107", // Vàng
    "Đã hủy": "#dc3545", // Đỏ
    "Màu khác": "#6c757d", // Xám (Dành cho các trạng thái không được định nghĩa)
  };

  const orderStatusPieData = orderStatus.map((statusItem, index) => {
    let label = statusItem._id;
    // ... (logic dịch tên trạng thái)
    if (statusItem._id === "Food Processing") label = "Đang xử lý";
    else if (statusItem._id === "Out for delivery") label = "Đang giao hàng";
    else if (statusItem._id === "Delivered") label = "Đã giao";
    else if (statusItem._id === "Cancelled")
      label = "Đã hủy"; // Thêm trạng thái hủy nếu cần
    else label = "Màu khác"; // Gán cho các trạng thái không xác định

    return {
      name: label,
      value: statusItem.count,
      count: statusItem.count,
      // ➡️ BƯỚC 2: Lấy màu dựa trên tên trạng thái (label)
      color: PIE_COLOR_MAP[label] || "#6c757d", // Lấy màu từ Map, nếu không tìm thấy thì dùng Xám
    };
  });

  const weeklyRevenueChartData = weeklySales?.map((item) => {
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);

    const dateLabel = `${start.getDate()}–${end.getDate()}/${String(
      start.getMonth() + 1
    ).padStart(2, "0")}`;

    return {
      name: `Tuần ${item._id.week}`, // chỉ còn “T39”
      subLabel: dateLabel, // “22–28/09”
      DoanhThu: item.totalRevenue,
    };
  });

  const CustomWeekTick = ({ x, y, payload }) => {
    const item = weeklyRevenueChartData[payload.index];
    return (
      <g transform={`translate(${x},${y})`}>
        <text dy={14} textAnchor="middle" fill="#333">
          {payload.value}
        </text>
        <text
          dy={28}
          textAnchor="middle"
          fill="#666"
          style={{ fontSize: "11px" }}
        >
          {item.subLabel}
        </text>
      </g>
    );
  };

  // Custom label formatter cho Pie Chart: chỉ hiển thị số lượng (count)
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white" // Đặt màu chữ trắng cho dễ nhìn trên nền màu
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontWeight: "bold", fontSize: "14px" }}
      >
        {orderStatusPieData[index].count}
      </text>
    );
  };

  return (
    <div className="analytics-dashboard">
      <h3>📊 Bảng điều khiển Quản trị </h3>

      {/* Tổng quan */}
      <div className="stats-grid">
        <StatCard
          title="Tổng Doanh thu"
          value={revenue?.toLocaleString("vi-VN") + "đ" || "0đ"}
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
        <StatCard
          title="Tin nhắn liên hệ"
          value={totals.contacts}
          icon={<FaEnvelope />}
          className="contacts"
        />
      </div>

      {/* Phần nội dung chi tiết */}
      <div className="data-sections-grid">
        {/* 1. Biểu đồ Tròn: Trạng thái Đơn hàng */}

        {/* 2. Biểu đồ Cột: Doanh thu theo tháng */}
        <div className="monthly-revenue-chart-section panel full-row">
          {" "}
          {/* Dùng full-row cho cả container */}
          {/* 🆕 Bộ chuyển đổi View (Button Group) */}
          <div className="chart-toggle-buttons">
            <button
              className={`toggle-button ${
                currentRevenueView === "monthly" ? "active" : ""
              }`}
              onClick={() => setCurrentRevenueView("monthly")}
            >
              📊 Doanh thu Hàng tháng
            </button>
            <button
              className={`toggle-button ${
                currentRevenueView === "weekly" ? "active" : ""
              }`}
              onClick={() => setCurrentRevenueView("weekly")}
            >
              📈 Doanh thu Hàng tuần
            </button>
          </div>
          {/* 🆕 Biểu đồ Hiển thị: Dựa vào state currentRevenueView */}
          {currentRevenueView === "monthly" && (
            <>
              <h3>📊 Doanh thu Hàng tháng</h3>
              {monthlyRevenueChartData?.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={monthlyRevenueChartData}
                    margin={{ top: 5, right: 10, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      tickFormatter={(value) => value.toLocaleString("vi-VN")}
                      label={{
                        value: "Doanh thu (VNĐ)",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle" },
                      }}
                    />
                    <Tooltip
                      formatter={(value) => value.toLocaleString("vi-VN") + "đ"}
                    />
                    <Legend />
                    <Bar
                      dataKey="DoanhThu"
                      fill="#000000"
                      name="Doanh thu tháng"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data-msg">
                  Không có dữ liệu doanh thu theo tháng.
                </div>
              )}
            </>
          )}
          {currentRevenueView === "weekly" && (
            <>
              <h3>📈 Doanh thu Hàng tuần</h3>
              {weeklyRevenueChartData?.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={weeklyRevenueChartData}
                    margin={{ top: 5, right: 10, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={<CustomWeekTick />} />
                    <YAxis
                      tickFormatter={(value) => value.toLocaleString("vi-VN")}
                      label={{
                        value: "Doanh thu (VNĐ)",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle" },
                      }}
                    />
                    <Tooltip
                      formatter={(value) => value.toLocaleString("vi-VN") + "đ"}
                    />
                    <Legend />
                    <Bar
                      dataKey="DoanhThu"
                      fill="#387ED1"
                      name="Doanh thu tuần"
                      className="footer-weekly-bar"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data-msg">
                  Không có dữ liệu doanh thu theo tuần.
                </div>
              )}
            </>
          )}
        </div>

        <div className="order-status-chart-section panel">
          <h3>📈 Số Lượng Trạng thái Đơn hàng</h3>
          {orderStatusPieData?.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel} // Sử dụng hàm label tùy chỉnh
                  isAnimationActive={true}
                >
                  {orderStatusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} đơn`, name]} // Tooltip hiển thị số đơn
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data-msg">
              Không có dữ liệu trạng thái đơn hàng.
            </div>
          )}
        </div>

        {/* 3. Top 5 món bán chạy (giữ nguyên vị trí) */}
        <div className="top-selling-section panel">
          {" "}
          {/* KHÔNG dùng class full-row */}
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
