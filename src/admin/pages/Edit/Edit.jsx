// import React, { useContext, useEffect, useState } from "react";
// import "./edit.css";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { StoreContext } from "../../../context/StoreContext";

// export const Edit = ({ food, onClose, onUpdated }) => {
//   const { url } = useContext(StoreContext);
//   const [image, setImage] = useState(null);

//   const [data, setData] = useState({
//     name: "",
//     description: "",
//     category: "Salad",
//     price: "",
//   });

//   // load sẵn dữ liệu cũ
//   useEffect(() => {
//     if (food) {
//       setData({
//         name: food.name,
//         description: food.description,
//         category: food.category,
//         price: food.price,
//       });
//     }
//   }, [food]);

//   const onChangeHandler = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({ ...prev, [name]: value }));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("id", food._id);
//     formData.append("name", data.name);
//     formData.append("description", data.description);
//     formData.append("category", data.category);
//     formData.append("price", Number(data.price));
//     if (image) formData.append("image", image);

//     try {
//       const response = await axios.put(`${url}/api/food/update`, formData);
//       if (response.data.success) {
//         toast.success(response.data.message);
//         onUpdated(); // reload list
//         onClose(); // đóng form
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (err) {
//       toast.error("Server error while updating food");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="edit-overlay">
//       <div className="edit-container">
//         <h3>Cập nhật sản phẩm</h3>
//         <form className="edit-form" onSubmit={onSubmit}>
//           <div className="form-group-image">
//             <p>Ảnh sản phẩm</p>
//             <label htmlFor="image" className="image-upload-label">
//               <img
//                 src={
//                   image
//                     ? URL.createObjectURL(image)
//                     : `${url}/images/${food.image}`
//                 }
//                 alt="Preview"
//               />
//             </label>
//             <input
//               onChange={(e) => setImage(e.target.files[0])}
//               type="file"
//               id="image"
//               hidden
//             />
//           </div>

//           <div className="form-group">
//             <p>Tên sản phẩm</p>
//             <input
//               onChange={onChangeHandler}
//               value={data.name}
//               type="text"
//               name="name"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <p>Mô tả sản phẩm</p>
//             <textarea
//               onChange={onChangeHandler}
//               value={data.description}
//               name="description"
//               rows="6"
//               required
//             />
//           </div>

//           <div className="form-group-flex">
//             <div className="form-group">
//               <p>Danh mục</p>
//               <select
//                 onChange={onChangeHandler}
//                 name="category"
//                 value={data.category}
//                 required
//               >
//                 <option value="Salad">Salad</option>
//                 <option value="Rolls">Rolls</option>
//                 <option value="Deserts">Deserts</option>
//                 <option value="Sandwich">Sandwich</option>
//                 <option value="Cake">Cake</option>
//                 <option value="Pure">Pure</option>
//                 <option value="Pasta">Pasta</option>
//                 <option value="Noodles">Noodles</option>
//               </select>
//             </div>
//             <div className="form-group">
//               <p>Giá sản phẩm</p>
//               <input
//                 onChange={onChangeHandler}
//                 value={data.price}
//                 type="number"
//                 name="price"
//                 required
//               />
//             </div>
//           </div>
//           <div className="form-buttons">
//             <button type="button" onClick={onClose} className="cancel-btn">
//               Hủy
//             </button>
//             <button type="submit" className="submit-btn">
//               LƯU THAY ĐỔI
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };
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
    category: food.category?._id || "",
    price: food.price || "",
  });

  // Lấy danh mục từ BE
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

  // Handle input
  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit cập nhật
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", Number(data.price));
    if (image) formData.append("image", image);

    try {
      const response = await axios.put(`${url}/api/food/${food._id}`, formData);
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
                    : `${url}/images/${food.image}`
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
