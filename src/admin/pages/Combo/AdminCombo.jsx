import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./AdminCombo.css";
import { StoreContext } from "../../../context/StoreContext";

export const AdminCombo = () => {
  const [combos, setCombos] = useState([]);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    discountPrice: "",
    items: [],
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const { url } = useContext(StoreContext);

  const formatCurrency = (value) =>
    !value ? "0" : value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const parseCurrency = (value) => value.toString().replace(/,/g, "");

  const fetchCombos = async () => {
    const res = await axios.get(`${url}/api/combos`);
    setCombos(res.data);
  };

  const fetchFoods = async () => {
    const res = await axios.get(`${url}/api/food`);
    setFoods(res.data.data || []);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${url}/api/categories`);
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCombos();
    fetchFoods();
    fetchCategories();
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

      return {
        ...prev,
        items: updatedItems,
        price: updateTotalPrice(updatedItems),
      };
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

      return {
        ...prev,
        items: updatedItems,
        price: updateTotalPrice(updatedItems),
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("discountPrice", parseCurrency(formData.discountPrice));
    data.append("items", JSON.stringify(formData.items.map((i) => i.id)));
    if (formData.image) data.append("image", formData.image);

    try {
      if (editingId) {
        await axios.put(`${url}/api/combos/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa combo này?")) {
      await axios.delete(`${url}/api/combos/${id}`);
      fetchCombos();
    }
  };

  // --- Lọc món ăn theo danh mục ---
  const filteredFoods =
    selectedCategory === "all"
      ? foods
      : foods.filter((f) => {
          const categoryId =
            typeof f.categoryId === "object" ? f.categoryId._id : f.categoryId;
          return categoryId?.toString() === selectedCategory.toString();
        });
  return (
    <div className="admin-combo">
      <h2 className="title">🎁 Quản lý Combo Ưu Đãi</h2>

      <form className="combo-form glassy" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* TRƯỜNG 1: Tên combo */}
          <div className="input-group">
            <p className="input-label">Tên combo:</p>
            <input
              type="text"
              placeholder="Nhập tên combo (ví dụ: Combo Tiết Kiệm)"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* TRƯỜNG 2: Giá ưu đãi */}
          <div className="input-group">
            <p className="input-label">Giá ưu đãi:</p>
            <input
              type="text"
              placeholder="Nhập giá ưu đãi (ví dụ: 120,000)"
              value={formatCurrency(formData.discountPrice)}
              onChange={(e) =>
                setFormData({ ...formData, discountPrice: e.target.value })
              }
            />
          </div>

          {/* TRƯỜNG 3: Giá gốc */}
          <div className="input-group">
            <p className="input-label">Giá gốc (Tự động tính):</p>
            <input
              type="text"
              placeholder="Giá gốc"
              value={formatCurrency(formData.price)}
              readOnly
            />
          </div>
        </div>
        <p className="input-label combo">Mô tả:</p>
        <textarea
          placeholder="Mô tả combo..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <label className="section-label">🍱 Chọn danh mục món ăn:</label>
        <div className="category-buttons">
          <button
            type="button"
            className={selectedCategory === "all" ? "active" : ""}
            onClick={() => setSelectedCategory("all")}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              type="button"
              className={selectedCategory === cat._id ? "active" : ""}
              onClick={() => setSelectedCategory(cat._id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="food-list">
          {filteredFoods.map((food) => {
            const item = formData.items.find((i) => i.id === food._id);
            return (
              <div key={food._id} className="food-item-row">
                <img src={`${food.image}`} alt={food.name} />
                <div className="food-info">
                  <span>{food.name}</span>
                  <p>{formatCurrency(food.price)}₫</p>
                </div>
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

        <label className="section-label">📷 Ảnh combo:</label>
        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
        />

        <button type="submit" className="btn-submit">
          {editingId ? "💾 Cập nhật Combo" : "➕ Thêm Combo"}
        </button>
      </form>

      <h3 className="subtitle">Danh sách Combo</h3>
      <div className="combo-list-admin">
        {combos.map((combo) => (
          <div key={combo._id} className="combo-card-admin">
            {/* <img src={`${url}/uploads/${combo.image}`} alt={combo.name} /> */}
            <img src={combo.image} alt={combo.name} />
            <div className="combo-info">
              <h4>{combo.name}</h4>
              <p className="desc">{combo.description}</p>
              <p className="price">
                <del>{formatCurrency(combo.price)}₫</del>{" "}
                <strong>{formatCurrency(combo.discountPrice)}₫</strong>
              </p>
              <p className="items">
                Món:{" "}
                {combo.items
                  .map((i) => `${i.name || i.id} x${i.quantity || 1}`)
                  .join(", ")}
              </p>
              <div className="btn-group">
                <button className="edit" onClick={() => handleEdit(combo)}>
                  Sửa
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(combo._id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCombo;
