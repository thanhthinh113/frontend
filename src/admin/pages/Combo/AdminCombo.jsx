import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminCombo.css";

export const AdminCombo = () => {
  const [combos, setCombos] = useState([]);
  const [foods, setFoods] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    discountPrice: "",
    items: [],
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const url = "http://localhost:4000";

  // ===== Helper =====
  const formatCurrency = (value) => {
    if (!value) return "0";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseCurrency = (value) => value.toString().replace(/,/g, "");

  const fetchCombos = async () => {
    const res = await axios.get(`${url}/api/combos`);
    setCombos(res.data);
  };

  const fetchFoods = async () => {
    const res = await axios.get(`${url}/api/food`);
    setFoods(res.data.data || []);
  };

  useEffect(() => {
    fetchCombos();
    fetchFoods();
  }, []);

  const updateTotalPrice = (itemsList) => {
    const total = itemsList.reduce((sum, item) => {
      const food = foods.find((f) => f._id === item.id);
      return sum + (food ? food.price * item.quantity : 0);
    }, 0);
    return total;
  };

  const addItem = (foodId) => {
    setFormData((prev) => {
      const existing = prev.items.find((i) => i.id === foodId);
      let updatedItems;

      if (existing) {
        updatedItems = prev.items.map((i) =>
          i.id === foodId ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedItems = [...prev.items, { id: foodId, quantity: 1 }];
      }

      return { ...prev, items: updatedItems, price: updateTotalPrice(updatedItems) };
    });
  };

  const removeItem = (foodId) => {
    setFormData((prev) => {
      const existing = prev.items.find((i) => i.id === foodId);
      if (!existing) return prev;

      let updatedItems;
      if (existing.quantity > 1) {
        updatedItems = prev.items.map((i) =>
          i.id === foodId ? { ...i, quantity: i.quantity - 1 } : i
        );
      } else {
        updatedItems = prev.items.filter((i) => i.id !== foodId);
      }

      return { ...prev, items: updatedItems, price: updateTotalPrice(updatedItems) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("discountPrice", parseCurrency(formData.discountPrice));
    data.append("items", JSON.stringify(formData.items));
    if (formData.image) data.append("image", formData.image);

    try {
      if (editingId) {
        // CẬP NHẬT
        if (formData.image) {
          await axios.post(`${url}/api/combos/${editingId}?_method=PUT`, data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await axios.put(
            `${url}/api/combos/${editingId}`,
            {
              name: formData.name,
              description: formData.description,
              price: formData.price,
              discountPrice: parseCurrency(formData.discountPrice),
              items: formData.items.map((i) => ({
                _id: i.id,
                quantity: i.quantity,
              })),
            },
            { headers: { "Content-Type": "application/json" } }
          );
        }
      } else {
        // THÊM MỚI
        await axios.post(`${url}/api/combos`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setFormData({
        name: "",
        description: "",
        price: 0,
        discountPrice: "",
        items: [],
        image: null,
      });
      setEditingId(null);
      fetchCombos();
    } catch (err) {
      console.error("❌ Lỗi khi lưu combo:", err);
      alert("Không thể lưu combo. Kiểm tra console để xem chi tiết.");
    }
  };

  const handleEdit = (combo) => {
    setEditingId(combo._id);
    setFormData({
      name: combo.name,
      description: combo.description,
      price: combo.price,
      discountPrice: combo.discountPrice.toString(),
      items: combo.items.map((i) => ({
        id: i._id || i.id,
        quantity: i.quantity || 1,
      })),
      image: null,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa combo này?")) {
      await axios.delete(`${url}/api/combos/${id}`);
      fetchCombos();
    }
  };

  return (
    <div className="admin-combo">
      <h2>Quản lý Combo Ưu Đãi</h2>

      <form className="combo-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên combo"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <textarea
          placeholder="Mô tả"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <input
          type="text"
          placeholder="Giá gốc"
          value={formatCurrency(formData.price)}
          readOnly
        />

        <input
          type="text"
          placeholder="Giá ưu đãi"
          value={formatCurrency(formData.discountPrice)}
          onChange={(e) =>
            setFormData({ ...formData, discountPrice: e.target.value })
          }
        />

        <label>Chọn món trong combo:</label>
        <div className="food-checkboxes">
          {foods.map((food) => {
            const item = formData.items.find((i) => i.id === food._id);
            return (
              <div key={food._id} className="food-item-row">
                <span>
                  {food.name} ({formatCurrency(food.price)}₫)
                </span>
                <div className="quantity-controls">
                  <button type="button" onClick={() => removeItem(food._id)}>
                    -
                  </button>
                  <span>{item ? item.quantity : 0}</span>
                  <button type="button" onClick={() => addItem(food._id)}>
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
        />

        <button type="submit">
          {editingId ? "Cập nhật Combo" : "Thêm Combo"}
        </button>
      </form>

      <h3>Danh sách Combo</h3>
      <div className="combo-list-admin">
        {combos.map((combo) => (
          <div key={combo._id} className="combo-card-admin">
            <img src={`${url}/${combo.image}`} alt={combo.name} />
            <div>
              <h4>{combo.name}</h4>
              <p>{combo.description}</p>
              <p>
                Giá: <del>{formatCurrency(combo.price)}₫</del>{" "}
                <strong>{formatCurrency(combo.discountPrice)}₫</strong>
              </p>
              <p>
                Món:{" "}
                {combo.items
                  .map((i) => `${i.name} x${i.quantity || 1}`)
                  .join(", ")}
              </p>
              <button onClick={() => handleEdit(combo)}>Sửa</button>
              <button onClick={() => handleDelete(combo._id)}>Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCombo;
