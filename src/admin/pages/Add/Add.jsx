import React, { useContext, useState, useEffect } from "react";
import "./Add.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../../assets/assets";
import { StoreContext } from "../../../context/StoreContext";

export const Add = () => {
  const { url } = useContext(StoreContext);
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  const [data, setData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
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
    if (!image) {
      toast.error("Vui lòng chọn ảnh sản phẩm");
      return;
    }
    // ⚠️ Kiểm tra giá sản phẩm
    const priceValue = Number(data.price);

    if (data.price === "") {
      toast.error("Giá sản phẩm không được để trống");
      return;
    }

    if (isNaN(priceValue)) {
      toast.error("Giá sản phẩm phải là số hợp lệ");
      return;
    }

    if (priceValue <= 0) {
      toast.error("Giá sản phẩm phải lớn hơn 0");
      return;
    }
    const stockValue = Number(data.stock);

    if (data.stock === "") {
      toast.error("Tồn kho không được để trống");
      return;
    }

    if (isNaN(stockValue) || stockValue < 0) {
      toast.error("Tồn kho phải là số không âm");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("categoryId", data.category);
    formData.append("price", priceValue);
    formData.append("stock", stockValue);
    if (image) formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Thêm sản phẩm thành công");
        setData({
          name: "",
          description: "",
          category: "",
          price: "",
          stock: "",
        });
        setImage(null);
      } else {
        toast.error(response.data.message || "Không thể thêm sản phẩm");
      }
    } catch (err) {
      toast.error("Lỗi khi thêm sản phẩm");
      console.error(err);
    }
  };

  return (
    <div className="add-container">
      <form className="add-form" onSubmit={onSubmit}>
        <div className="form-group-image">
          <p>Tải ảnh lên</p>
          <label htmlFor="image" className="image-upload-label">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload Area"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            // required
          />
        </div>

        <div className="form-group">
          <p>Tên sản phẩm</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Nhập tên sản phẩm"
            required
          />
        </div>

        <div className="form-group">
          <p>Mô tả sản phẩm</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Viết mô tả chi tiết tại đây"
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
            <p>Giá sản phẩm</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="₫50,000"
              required
            />
          </div>
          <div className="form-group">
            <p>Số lượng tồn kho</p>
            <input
              onChange={onChangeHandler}
              value={data.stock}
              type="number"
              name="stock"
              placeholder="VD: 20"
              min="0"
              required
            />
          </div>
        </div>
        <button type="submit" className="submit-btn">
          THÊM SẢN PHẨM
        </button>
      </form>
    </div>
  );
};
