import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
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
  const fileInputRef = useRef(null); // 👈 thêm ref

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${url}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      toast.error("Lỗi khi tải danh mục");
      console.error(err);
    }
  }, [url]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

      // ✅ Reset form
      setNewName("");
      setNewImage(null);
      setEditing(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; // 👈 reset file input

      fetchCategories();
    } catch (err) {
      toast.error("Lỗi khi lưu danh mục");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/api/categories/${id}`);
      toast.success("Xóa danh mục thành công");
      fetchCategories();
    } catch (err) {
      toast.error("Lỗi khi xóa danh mục");
      console.error(err);
    }
  };

  const totalCategories = categories.length;

  return (
    <div className="categories-container">
      <div className="categories-header">
        <div>
          <h3>Quản lý Danh mục</h3>
          <p>
            Theo dõi toàn bộ danh mục món ăn, thêm hình minh họa và cập nhật tên
            tiện lợi.
          </p>
        </div>
      </div>

      <div className="category-metrics single">
        <div className="metric-card">
          <span className="metric-label">Tổng danh mục</span>
          <strong className="metric-value">{totalCategories}</strong>
        </div>
      </div>

      <div className="category-layout">
        <form className="category-form" onSubmit={handleSubmit}>
          <h4>{editing ? "Cập nhật danh mục" : "Thêm danh mục mới"}</h4>
          <label className="form-label">Tên danh mục</label>
          <input
            type="text"
            placeholder="Nhập tên danh mục"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <label className="form-label">Hình ảnh</label>
          <label className="upload-dropzone">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => setNewImage(e.target.files[0])}
            />
            <span>
              {newImage
                ? newImage.name
                : "Kéo & thả hoặc chọn ảnh (PNG, JPG...)"}
            </span>
          </label>
          <div className="form-actions">
            <button type="submit" className="primary-btn">
              {editing ? "Lưu thay đổi" : "Thêm mới"}
            </button>
            {editing && (
              <button
                type="button"
                className="ghost-btn"
                onClick={() => {
                  setEditing(null);
                  setNewName("");
                  setNewImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Hủy
              </button>
            )}
          </div>
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
                  className="edit-pill"
                  type="button"
                  onClick={() => {
                    setEditing(cat);
                    setNewName(cat.name);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  Sửa
                </button>
                <button
                  className="delete-pill"
                  type="button"
                  onClick={() => {
                    const confirmed = window.confirm(
                      `Bạn có chắc muốn xóa danh mục "${cat.name}"?`
                    );
                    if (confirmed) handleDelete(cat._id);
                  }}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
          {!categories.length && (
            <div className="empty-state">
              <p>Chưa có danh mục nào. Bắt đầu thêm danh mục mới!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
