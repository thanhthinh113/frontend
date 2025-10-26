import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const StoreContext = createContext();

const StoreContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [food_list, setFoodList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [combos, setCombos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const url = "http://localhost:4000";

  // ========================= 🛒 THÊM VÀO GIỎ =========================
  const addToCart = async (itemId, type = "food") => {
  const key = `${type}_${itemId}`; // key riêng cho combo và món ăn

  setCartItems((prev) => ({
    ...prev,
    [key]: prev[key] ? prev[key] + 1 : 1,
  }));

  // ✅ Lưu giỏ hàng tạm cho khách
  if (!token) {
    try {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "{}");
      guestCart[key] = guestCart[key] ? guestCart[key] + 1 : 1;
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCartItems(guestCart);
    } catch (err) {
      console.error("Error saving guest cart", err);
    }
    return;
  }

  // ✅ Nếu có token thì gửi lên server
  try {
    await axios.post(
      `${url}/api/cart/add`,
      { itemId, type },
      { headers: { token } }
    );
  } catch (err) {
    console.error("Error adding to cart", err);
  }
};

  // ========================= 🗑️ XÓA KHỎI GIỎ =========================
  const removeFromCart = async (itemId, type = "food") => {
    const key = `${type}_${itemId}`;

    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[key] > 1) updated[key] -= 1;
      else delete updated[key];
      return updated;
    });

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId, type },
          { headers: { token } }
        );
      } catch (err) {
        console.error("❌ Error removing from cart", err);
      }
    }
  };

  // ========================= 💰 TÍNH TỔNG GIÁ =========================
  const getTotalCartAmount = () => {
    let total = 0;
    for (const key in cartItems) {
      if (cartItems[key] > 0) {
        const [type, id] = key.split("_");
        let item = null;

        if (type === "combo") {
          item = combos.find((c) => c._id === id);
          if (item)
            total += (item.discountPrice || item.price) * cartItems[key];
        } else {
          item = food_list.find((f) => f._id === id);
          if (item) total += item.price * cartItems[key];
        }
      }
    }
    return total;
  };

  // ========================= 📦 FETCH DỮ LIỆU =========================
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setFoodList(response.data.data);
      } else if (Array.isArray(response.data)) {
        setFoodList(response.data);
      } else {
        setFoodList([]);
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/categories`);
      if (response.data.success) {
        setCategories(response.data.data || []);
      } else if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCombos = async () => {
    try {
      const response = await axios.get(`${url}/api/combos`);
      if (response.data.success) {
        setCombos(response.data.data || []);
      } else if (Array.isArray(response.data)) {
        setCombos(response.data);
      } else {
        setCombos([]);
      }
    } catch (error) {
      console.error("Error fetching combos:", error);
    }
  };

  // ========================= 🔁 LOAD CART =========================
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token } }
      );
      setCartItems(response.data.cartData || {});
    } catch (err) {
      console.error("Error loading cart data", err);
    }
  };

  // ========================= 👤 USER =========================
  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${url}/api/user/profile`, {
        headers: { token },
      });
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        console.warn("Không thể lấy thông tin user:", res.data.message);
      }
    } catch (err) {
      console.error("Lỗi tải user mới:", err);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      await fetchCategories();
      await fetchCombos();

      if (token) {
        await refreshUser();
        await loadCartData(token);
      }
    }
    loadData();
  }, [token]);

  // ========================= 🔐 AUTH =========================
  const logoutUser = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const loginUser = (data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  // ========================= 🌟 CONTEXT VALUE =========================
  const contextValue = {
    food_list,
    categories,
    combos,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    user,
    setUser,
    logoutUser,
    loginUser,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    refreshUser,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
