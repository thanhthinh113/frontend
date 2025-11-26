import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../../context/StoreContext";
import { toast } from "react-toastify";
import "./Voucher.css";

export const Voucher = () => {
  const { url } = useContext(StoreContext);
  const [vouchers, setVouchers] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    discountPercent: "",
    pointsRequired: "",
    expiryDate: "",
  });
  const formatVND = (amount) => {
    return amount.toLocaleString("vi-VN");
  };

  // 📦 Lấy danh sách voucher
  const fetchVouchers = async () => {
    try {
      const res = await axios.get(`${url}/api/voucher/list`);
      if (res.data.success) {
        setVouchers(res.data.vouchers);
      } else {
        toast.error("Không lấy được danh sách voucher");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi server khi tải danh sách voucher");
    }
  };

  // 🆕 Tạo voucher mới (test không cần token)
  const createVoucher = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/voucher/create`, formData);
      if (res.data.success) {
        toast.success("Tạo voucher thành công!");
        setFormData({
          code: "",
          discountPercent: "",
          pointsRequired: "",
          expiryDate: "",
        });
        fetchVouchers();
      } else {
        toast.error(res.data.message || "Tạo voucher thất bại!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi server khi tạo voucher");
    }
  };

  // ❌ Xóa voucher
  const deleteVoucher = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa voucher này?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`${url}/api/voucher/delete/${id}`);
      if (res.data.success) {
        toast.success("Đã xóa voucher!");
        fetchVouchers();
      } else {
        toast.error(res.data.message || "Xóa voucher thất bại!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi server khi xóa voucher");
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return (
    <div className="voucher-container">
      <h3>Danh sách Voucher</h3>

      {/* 🧾 Form tạo voucher */}
      <form className="voucher-form" onSubmit={createVoucher}>
        <input
          type="text"
          placeholder="Mã voucher"
          value={formData.code}
          onChange={(e) =>
            setFormData({ ...formData, code: e.target.value.toUpperCase() })
          }
          required
        />
        <input
          type="number"
          placeholder="Tiền giảm (VND)"
          value={formData.discountPercent}
          onChange={(e) =>
            setFormData({ ...formData, discountPercent: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Điểm cần đổi"
          value={formData.pointsRequired}
          onChange={(e) =>
            setFormData({ ...formData, pointsRequired: e.target.value })
          }
          required
        />
        <input
          type="date"
          value={formData.expiryDate}
          onChange={(e) =>
            setFormData({ ...formData, expiryDate: e.target.value })
          }
          required
        />
        <button type="submit">Tạo Voucher</button>
      </form>

      {/* 📋 Danh sách voucher */}
      <div className="voucher-table">
        <div className="voucher-header voucher-row">
          <b>STT</b>
          <b>Mã</b>
          <b>Giảm (VND)</b>
          <b>Điểm đổi</b>
          <b>Ngày tạo</b>
          <b>Hết hạn</b>
          <b>Trạng thái</b>
          <b>Hành động</b>
        </div>

        {vouchers.map((v, index) => (
          <div className="voucher-row voucher-item" key={v._id}>
            <p>{index + 1}</p>
            <p>{v.code}</p>
            <p>{formatVND(v.discountPercent)} VND</p>
            <p>{formatVND(v.pointsRequired)}</p>
            <p>{new Date(v.createdAt).toLocaleDateString("vi-VN")}</p>
            <p>{new Date(v.expiryDate).toLocaleDateString("vi-VN")}</p>
            <p>
              {new Date(v.expiryDate) < new Date()
                ? "Hết hạn"
                : v.isActive
                ? "Hoạt động"
                : "Tắt"}
            </p>
            <button className="delete-btn" onClick={() => deleteVoucher(v._id)}>
              Xóa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
