import { useEffect, useState } from "react";
import axios from "axios";
import "../Categories/Categories.css"; 

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/categories");
    setCategories(res.data);
  };

  const addCategory = async () => {
    await axios.post("http://localhost:5000/api/categories", { name, description });
    setName("");
    setDescription("");
    fetchCategories();
  };

  return (
    <div className="categories-container">
      <h2 className="categories-title">Quản lý Danh mục</h2>

      <div className="categories-form">
        <input
          className="categories-input"
          placeholder="Tên danh mục"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="categories-input"
          placeholder="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="categories-btn" onClick={addCategory}>
          Thêm
        </button>
      </div>

      <ul className="categories-list">
        {categories.map((c) => (
          <li className="categories-item" key={c.id}>
            <span className="categories-name">{c.name}</span>
            <span className="categories-desc">{c.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
