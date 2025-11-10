import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../../context/StoreContext";
import "./Categories.css";

export const Categories = () => {
  const { url } = useContext(StoreContext);
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [editing, setEditing] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${url}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      toast.error("Lỗi khi tải danh mục");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newName);
      if (newImage) formData.append("image", newImage);

      if (editing) {
        await axios.put(`${url}/api/categories/${editing._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Cập nhật danh mục thành công");
      } else {
        await axios.post(`${url}/api/categories`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Thêm danh mục thành công");
      }

      setNewName("");
      setNewImage(null);
      setEditing(null);
      fetchCategories();
    } catch (err) {
      toast.error("Lỗi khi lưu danh mục");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await axios.delete(`${url}/api/categories/${id}`);
      toast.success("Xóa danh mục thành công");
      fetchCategories();
    } catch (err) {
      toast.error("Lỗi khi xóa danh mục");
      console.error(err);
    }
  };

  return (
    <div className="categories-container">
      <h3>Quản lý Danh mục</h3>

      <form className="category-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập tên danh mục"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files[0])}
        />
        <button type="submit">{editing ? "Cập nhật" : "Thêm mới"}</button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setNewName("");
              setNewImage(null);
            }}
          >
            Hủy
          </button>
        )}
      </form>

      <div className="categories-grid">
        {categories.map((cat) => (
          <div className="category-card" key={cat._id}>
            {cat.image ? (
              <img src={cat.image} alt={cat.name} className="category-img" />
            ) : (
              <div className="category-placeholder">?</div>
            )}
            <p className="category-name">{cat.name}</p>
            <div className="category-actions">
              <button
                onClick={() => {
                  setEditing(cat);
                  setNewName(cat.name);
                }}
              >
                Sửa
              </button>
              <button onClick={() => handleDelete(cat._id)}>Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
