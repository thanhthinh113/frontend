import React, { useContext, useEffect, useState } from "react";
import "./Edit.css";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../../context/StoreContext";

export const Edit = ({ food, onClose, onUpdated }) => {
  const { url } = useContext(StoreContext);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);

  const [data, setData] = useState({
    name: food.name || "",
    description: food.description || "",
    category: food.categoryId?._id || "",
    price: food.price || "",
    stock: food.stock || 0,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${url}/api/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, [url]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // 📌 Tên sản phẩm
    if (!data.name.trim()) {
      toast.error("Tên sản phẩm không được để trống");
      return;
    }

    // 📌 Mô tả
    if (!data.description.trim()) {
      toast.error("Mô tả không được để trống");
      return;
    }

    // 📌 Danh mục
    if (!data.category) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    // 📌 Giá
    const priceValue = Number(data.price);
    if (data.price === "") {
      toast.error("Giá sản phẩm không được để trống");
      return;
    }
    if (isNaN(priceValue)) {
      toast.error("Giá phải là số hợp lệ");
      return;
    }
    if (priceValue <= 0) {
      toast.error("Giá sản phẩm phải lớn hơn 0");
      return;
    }

    // 📌 Tồn kho
    const stockValue = Number(data.stock);
    if (data.stock === "") {
      toast.error("Tồn kho không được để trống");
      return;
    }
    if (isNaN(stockValue) || stockValue < 0) {
      toast.error("Tồn kho phải là số không âm");
      return;
    }

    // 📦 Tạo FormData
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("categoryId", data.category);
    formData.append("price", priceValue);
    formData.append("stock", stockValue);
    if (image) formData.append("image", image);

    try {
      const response = await axios.put(
        `${url}/api/food/${food._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success("Cập nhật sản phẩm thành công");
        onUpdated();
        onClose();
      } else {
        toast.error(response.data.message || "Không thể cập nhật sản phẩm");
      }
    } catch (err) {
      toast.error("Lỗi khi cập nhật sản phẩm");
      console.error(err);
    }
  };

  return (
    <div className="edit-popup">
      <div className="edit-content">
        <h3>Sửa sản phẩm</h3>

        <form onSubmit={onSubmit}>
          <div className="form-group-image">
            <p>Ảnh sản phẩm</p>
            <label htmlFor="edit-image" className="image-upload-label">
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : food.image?.startsWith("https://")
                    ? food.image
                    : `${url}/${food.image}`
                }
                alt="Ảnh sản phẩm"
              />
            </label>

            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="edit-image"
              hidden
            />
          </div>

          <div className="form-group">
            <p>Tên sản phẩm</p>
            <input
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              name="name"
              required
            />
          </div>

          <div className="form-group">
            <p>Mô tả</p>
            <textarea
              onChange={onChangeHandler}
              value={data.description}
              name="description"
              rows="4"
              required
            />
          </div>

          <div className="form-group-flex">
            <div className="form-group">
              <p>Danh mục</p>
              <select
                onChange={onChangeHandler}
                name="category"
                value={data.category}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <p>Giá</p>
              <input
                onChange={onChangeHandler}
                value={data.price}
                type="number"
                name="price"
                required
              />
            </div>

            <div className="form-group">
              <p>Tồn kho</p>
              <input
                onChange={onChangeHandler}
                value={data.stock}
                type="number"
                name="stock"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              Lưu
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
