import { useState, useEffect } from "react";
import axios from "axios";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:4000/api/categories");
    setCategories(res.data);
  };

  const addCategory = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", image);

    await axios.post("http://localhost:4000/api/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setName("");
    setDescription("");
    setImage(null);
    fetchCategories();
  };

  return (
    <div>
      <h2>Quản lý Danh mục (S3)</h2>

      <input
        placeholder="Tên danh mục"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Mô tả"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={addCategory}>Thêm</button>

      <ul>
        {categories.map((c) => (
          <li key={c._id}>
            <img src={c.imageUrl} alt={c.name} width="80" />
            <strong>{c.name}</strong> - {c.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
