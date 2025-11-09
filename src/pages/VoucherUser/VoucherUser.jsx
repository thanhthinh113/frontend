import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import "./VoucherUser.css";

export const VoucherUser = () => {
  const { url, token, user, setUser } = useContext(StoreContext);
  const [vouchers, setVouchers] = useState([]);
  const formatVND = (amount) => {
    return amount.toLocaleString("vi-VN");
  };

  // Lấy danh sách voucher có sẵn trên hệ thống
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

  // Đổi điểm lấy voucher
  const handleRedeem = async (voucherId, pointsRequired) => {
    if (user.points < pointsRequired) {
      toast.warning("Bạn không đủ điểm để đổi voucher này");
      return;
    }

    try {
      const res = await axios.post(
        `${url}/api/voucher/redeem`,
        { voucherId },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Đổi voucher thành công 🎉");

        // Cập nhật điểm & danh sách voucher đã đổi
        const newVoucher = res.data.voucher;
        const updatedUser = {
          ...user,
          points: user.points - pointsRequired,
          redeemedVouchers: [
            ...(user.redeemedVouchers || []),
            {
              code: newVoucher.code,
              discountPercent: newVoucher.discountPercent,
              expiryDate: newVoucher.expiryDate,
            },
          ],
        };

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        toast.error(res.data.message || "Đổi voucher thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error("Đổi voucher thất bại");
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return (
    <div className="voucher-page">
      <h2>Tích điểm & Ưu đãi</h2>
      <p className="user-points">
        Điểm hiện có: <b> {formatVND(user?.points || 0)}</b>
      </p>

      {/* Danh sách voucher có thể đổi */}
      <div className="voucher-section">
        <h3>🎁 Voucher có thể đổi</h3>
        <div className="voucher-list">
          {vouchers.length === 0 ? (
            <p>Hiện chưa có voucher nào.</p>
          ) : (
            vouchers.map((v) => (
              <div key={v._id} className="voucher-card">
                <h3>{v.code}</h3>
                <p>
                  Giảm giá:
                  {formatVND(v.discountPercent)} VND
                </p>
                <p>Yêu cầu: {formatVND(v.pointsRequired)} điểm</p>
                <p>Hết hạn: {new Date(v.expiryDate).toLocaleDateString()}</p>
                <button
                  onClick={() => handleRedeem(v._id, v.pointsRequired)}
                  disabled={user.points < v.pointsRequired}
                >
                  {user.points >= v.pointsRequired
                    ? "Đổi ngay"
                    : "Không đủ điểm"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Danh sách voucher đã đổi */}
      {/* Danh sách voucher đã đổi */}
      <div className="voucher-section">
        <h3>🧾 Voucher của bạn</h3>
        <div className="voucher-list">
          {!user?.redeemedVouchers || user.redeemedVouchers.length === 0 ? (
            <p>Bạn chưa đổi voucher nào.</p>
          ) : (
            // ✅ Gộp voucher trùng code
            Object.entries(
              user.redeemedVouchers.reduce((acc, v) => {
                const key = v.code;
                if (!acc[key]) acc[key] = { ...v, count: 0 };
                acc[key].count += 1;
                return acc;
              }, {})
            ).map(([code, v]) => (
              <div key={code} className="voucher-card owned">
                {/* 🟢 Huy hiệu số lượng */}
                {v.count > 1 && (
                  <span className="voucher-badge">x{v.count}</span>
                )}

                <h3>{v.code}</h3>
                <p>Giảm giá: {formatVND(v.discountPercent)} VND</p>
                <p>Hết hạn: {new Date(v.expiryDate).toLocaleDateString()}</p>
                <p
                  className={
                    new Date(v.expiryDate) < new Date() ? "expired" : "active"
                  }
                >
                  {new Date(v.expiryDate) < new Date()
                    ? "⛔ Hết hạn"
                    : "✅ Còn hiệu lực"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
