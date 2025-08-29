// Add.jsx
import React, { useContext, useState } from "react";
import "./add.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../../assets/assets";
import { StoreContext } from "../../../context/StoreContext";

export const Add = () => {
  const { url } = useContext(StoreContext);
  const [image, setImage] = useState(false);

  const [data, setData] = useState({
    name: "",
    description: "",
    category: "Salad",
    price: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", Number(data.price));
    formData.append("image", image);
    const response = await axios.post(`${url}/api/food/add`, formData);
    if (response.data.success) {
      setData({
        name: "",
        description: "",
        category: "Salad",
        price: "",
      });
      setImage(false);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
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
              alt="Khu vực tải ảnh lên"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
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
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure">Pure</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
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
        </div>
        <button type="submit" className="submit-btn">
          THÊM SẢN PHẨM
        </button>
      </form>
    </div>
  );
};
