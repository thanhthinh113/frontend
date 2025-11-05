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
  const url_AI = "https://food-del-ai.onrender.com";

  const addToCart = async (itemOrId, quantity = 1) => {
    const itemId = typeof itemOrId === "object" ? itemOrId._id : itemOrId;

    // 🛒 Cập nhật giỏ hàng trong state
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + quantity : quantity,
    }));

    // 🔐 Nếu có token (đăng nhập)
    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId, quantity }, // ✅ gửi kèm quantity
          { headers: { token } }
        );
      } catch (err) {
        console.error("❌ Error adding to cart (user):", err);
      }
      return;
    }

    // 👤 Nếu là khách (localStorage)
    try {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "{}");
      guestCart[itemId] = guestCart[itemId]
        ? guestCart[itemId] + quantity
        : quantity;

      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCartItems(guestCart);

      console.log(`Added ${quantity} of ${itemId} to guest cart`);
    } catch (err) {
      console.error("❌ Error saving guest cart:", err);
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) updated[itemId] -= 1;
      else delete updated[itemId];
      return updated;
    });

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { token } }
        );
      } catch (err) {
        console.error("Error removing from cart", err);
      }
    }
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const item = food_list.find((f) => f._id === itemId);
        if (item) total += item.price * cartItems[itemId];
      }
    }
    return total;
  };

  // ================= FETCH FOOD & CATEGORIES & COMBO =================
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

  // ================= LOAD CART =================
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

  // ================= AUTH =================

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
    url_AI,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
