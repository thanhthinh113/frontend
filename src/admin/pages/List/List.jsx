// List.jsx
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./List.css";
import { StoreContext } from "../../../context/StoreContext";

export const List = () => {
  const { url } = useContext(StoreContext);
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching list");
      }
    } catch (err) {
      toast.error("Server error while fetching list");
      console.error(err);
    }
  };

  const removeFood = async (id) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id });
      if (response.data.success) {
        toast.success("Food removed successfully");
        fetchList();
      } else {
        toast.error("Error removing food");
      }
    } catch (err) {
      toast.error("Server error while removing food");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list-container">
      <h3>Tất cả sản phẩm</h3>
      <div className="list-table">
        <div className="table-header table-row">
          <b>STT</b> {/* Thêm cột STT */}
          <b>Ảnh</b>
          <b>Tên</b>
          <b>Mô tả</b>
          <b>Danh mục</b>
          <b>Giá</b>
          <b>Hành động</b>
        </div>
        {list.map((item, index) => (
          <div className="table-row table-item" key={item._id}>
            <p className="item-number">{index + 1}</p>{" "}
            {/* Hiển thị số thứ tự */}
            <img src={`${url}/images/` + item.image} alt={item.name} />
            <p>{item.name}</p>
            <p className="item-description">{item.description}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <p onClick={() => removeFood(item._id)} className="remove-btn">
              Xóa
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
