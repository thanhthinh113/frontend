// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./AdminCombo.css";

// export const AdminCombo = () => {
//   const [combos, setCombos] = useState([]);
//   const [foods, setFoods] = useState([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     discountPrice: "",
//     items: [],
//     image: null,
//   });
//   const [editingId, setEditingId] = useState(null);

//   const url = "http://localhost:4000";

//   // ===== Helper format =====
//   const formatCurrency = (value) => {
//     if (!value) return "";
//     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   };

//   const parseCurrency = (value) => {
//     return value.replace(/,/g, "");
//   };

//   // Fetch combos
//   const fetchCombos = async () => {
//     const res = await axios.get(`${url}/api/combos`);
//     setCombos(res.data);
//   };

//   // Fetch foods
//   const fetchFoods = async () => {
//     const res = await axios.get(`${url}/api/food`);
//     setFoods(res.data.data || []);
//   };

//   useEffect(() => {
//     fetchCombos();
//     fetchFoods();
//   }, []);

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "image") {
//       setFormData({ ...formData, image: files[0] });
//     } else if (name === "price" || name === "discountPrice") {
//       const numericValue = value.replace(/[^\d,]/g, "");
//       setFormData({ ...formData, [name]: numericValue });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   // Handle select items
//   const toggleItem = (id) => {
//     setFormData((prev) => {
//       const newItems = prev.items.includes(id)
//         ? prev.items.filter((item) => item !== id)
//         : [...prev.items, id];
//       return { ...prev, items: newItems };
//     });
//   };

//   // Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = new FormData();
//     Object.keys(formData).forEach((key) => {
//       if (key === "items") {
//         data.append("items", JSON.stringify(formData.items));
//       } else if (key === "price" || key === "discountPrice") {
//         data.append(key, parseCurrency(formData[key]));
//       } else {
//         data.append(key, formData[key]);
//       }
//     });

//     if (editingId) {
//       await axios.put(`${url}/api/combos/${editingId}`, data);
//     } else {
//       await axios.post(`${url}/api/combos`, data);
//     }

//     setFormData({
//       name: "",
//       description: "",
//       price: "",
//       discountPrice: "",
//       items: [],
//       image: null,
//     });
//     setEditingId(null);
//     fetchCombos();
//   };

//   // Edit
//   const handleEdit = (combo) => {
//     setEditingId(combo._id);
//     setFormData({
//       name: combo.name,
//       description: combo.description,
//       price: combo.price.toString(),
//       discountPrice: combo.discountPrice.toString(),
//       items: combo.items.map((i) => i._id),
//       image: null,
//     });
//   };

//   // Delete
//   const handleDelete = async (id) => {
//     if (window.confirm("Bạn có chắc muốn xóa combo này?")) {
//       await axios.delete(`${url}/api/combos/${id}`);
//       fetchCombos();
//     }
//   };

//   return (
//     <div className="admin-combo">
//       <h2>Quản lý Combo Ưu Đãi</h2>

//       <form className="combo-form" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Tên combo"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//         <textarea
//           name="description"
//           placeholder="Mô tả"
//           value={formData.description}
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name="price"
//           placeholder="Giá gốc"
//           value={formatCurrency(formData.price)}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="discountPrice"
//           placeholder="Giá ưu đãi"
//           value={formatCurrency(formData.discountPrice)}
//           onChange={handleChange}
//         />
//         <label>Chọn món trong combo:</label>
//         <div className="food-checkboxes">
//           {foods.map((food) => (
//             <label key={food._id}>
//               <input
//                 type="checkbox"
//                 checked={formData.items.includes(food._id)}
//                 onChange={() => toggleItem(food._id)}
//               />
//               {food.name}
//             </label>
//           ))}
//         </div>
//         <input type="file" name="image" onChange={handleChange} />

//         <button type="submit">
//           {editingId ? "Cập nhật Combo" : "Thêm Combo"}
//         </button>
//       </form>

//       <h3>Danh sách Combo</h3>
//       <div className="combo-list-admin">
//         {combos.map((combo) => (
//           <div key={combo._id} className="combo-card-admin">
//             <img src={`${url}/${combo.image}`} alt={combo.name} />
//             <div>
//               <h4>{combo.name}</h4>
//               <p>{combo.description}</p>
//               <p>
//                 Giá:{" "}
//                 <del>{formatCurrency(combo.price)}₫</del>{" "}
//                 <strong>{formatCurrency(combo.discountPrice)}₫</strong>
//               </p>
//               <p>Món: {combo.items.map((i) => i.name).join(", ")}</p>
//               <button onClick={() => handleEdit(combo)}>Sửa</button>
//               <button onClick={() => handleDelete(combo._id)}>Xóa</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminCombo;
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

  // ===== Helper format =====
  const formatCurrency = (value) => {
    if (!value) return "0";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseCurrency = (value) => {
    return value.toString().replace(/,/g, "");
  };

  // Fetch combos
  const fetchCombos = async () => {
    const res = await axios.get(`${url}/api/combos`);
    setCombos(res.data);
  };

  // Fetch foods
  const fetchFoods = async () => {
    const res = await axios.get(`${url}/api/food`);
    setFoods(res.data.data || []);
  };

  useEffect(() => {
    fetchCombos();
    fetchFoods();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else if (name === "discountPrice") {
      const numericValue = value.replace(/[^\d,]/g, "");
      setFormData({ ...formData, discountPrice: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle select items
  const toggleItem = (id) => {
    setFormData((prev) => {
      const newItems = prev.items.includes(id)
        ? prev.items.filter((item) => item !== id)
        : [...prev.items, id];

      // Tính lại giá gốc
      const totalPrice = newItems.reduce((sum, itemId) => {
        const food = foods.find((f) => f._id === itemId);
        return sum + (food ? food.price : 0);
      }, 0);

      return { ...prev, items: newItems, price: totalPrice };
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("discountPrice", parseCurrency(formData.discountPrice));
    data.append("items", JSON.stringify(formData.items));
    if (formData.image) data.append("image", formData.image);

    if (editingId) {
      await axios.put(`${url}/api/combos/${editingId}`, data);
    } else {
      await axios.post(`${url}/api/combos`, data);
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
  };

  // Edit
  const handleEdit = (combo) => {
    setEditingId(combo._id);
    setFormData({
      name: combo.name,
      description: combo.description,
      price: combo.price,
      discountPrice: combo.discountPrice.toString(),
      items: combo.items.map((i) => i._id),
      image: null,
    });
  };

  // Delete
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
          name="name"
          placeholder="Tên combo"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Mô tả"
          value={formData.description}
          onChange={handleChange}
        />

        {/* Giá gốc: chỉ hiển thị, không nhập tay */}
        <input
          type="text"
          name="price"
          placeholder="Giá gốc"
          value={formatCurrency(formData.price)}
          readOnly
        />

        <input
          type="text"
          name="discountPrice"
          placeholder="Giá ưu đãi"
          value={formatCurrency(formData.discountPrice)}
          onChange={handleChange}
        />

        <label>Chọn món trong combo:</label>
        <div className="food-checkboxes">
          {foods.map((food) => (
            <label key={food._id}>
              <input
                type="checkbox"
                checked={formData.items.includes(food._id)}
                onChange={() => toggleItem(food._id)}
              />
              {food.name} ({formatCurrency(food.price)}₫)
            </label>
          ))}
        </div>

        <input type="file" name="image" onChange={handleChange} />

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
              <p>Món: {combo.items.map((i) => i.name).join(", ")}</p>
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
