import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const StoreContext = createContext();

const StoreContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const url = "http://localhost:4000";

  // ========================= 👤 USER =========================
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  // ========================= 🛍️ CART =========================
  const [guestCartItems, setGuestCartItems] = useState(() => {
    const stored = localStorage.getItem("guestCart");
    return stored ? JSON.parse(stored) : {};
  });
  const [userCartItems, setUserCartItems] = useState(() => {
    const backup = localStorage.getItem("userCartBackup");
    return backup ? JSON.parse(backup) : {};
  });

  const [food_list, setFoodList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [combos, setCombos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // ⚙️ Giỏ hàng hiển thị (chỉ dùng để render)
  const cartItems = token ? userCartItems : guestCartItems;

  // ========================= 🛒 ADD TO CART =========================
  const addToCart = async (itemOrId, quantity = 1, type = "food") => {
    const id = typeof itemOrId === "object" ? itemOrId._id : itemOrId;
    const key = `${type}_${id}`;
    const qty = Number(quantity);

    if (!token) {
      setGuestCartItems((prev) => {
        const updated = { ...prev, [key]: (prev[key] || 0) + qty };
        localStorage.setItem("guestCart", JSON.stringify(updated));
        return updated;
      });
      return;
    }

    // Nếu có token
    setUserCartItems((prev) => {
      const updated = { ...prev, [key]: (prev[key] || 0) + qty };
      localStorage.setItem("userCartBackup", JSON.stringify(updated)); // ✅ backup
      return updated;
    });

    try {
      await axios.post(
        `${url}/api/cart/add`,
        { itemId: id, type, quantity: qty },
        { headers: { token } }
      );
    } catch (err) {
      console.error("❌ Error adding to user cart:", err);
    }
  };

  // ========================= 🗑️ REMOVE / UPDATE =========================
  const updateCartItem = async (itemId, type = "food", newQuantity = 0) => {
    const key = `${type}_${itemId}`;

    if (!token) {
      setGuestCartItems((prev) => {
        const updated = { ...prev };
        if (newQuantity > 0) updated[key] = newQuantity;
        else delete updated[key];
        localStorage.setItem("guestCart", JSON.stringify(updated));
        return updated;
      });
      return;
    }

    setUserCartItems((prev) => {
      const updated = { ...prev };
      if (newQuantity > 0) updated[key] = newQuantity;
      else delete updated[key];
      localStorage.setItem("userCartBackup", JSON.stringify(updated)); // ✅ backup mới
      return updated;
    });

    try {
      await axios.post(
        `${url}/api/cart/update`,
        { itemId, type, quantity: newQuantity },
        { headers: { token } }
      );
    } catch (err) {
      console.error("❌ Error updating user cart:", err);
    }
  };

  const removeFromCart = async (itemId, type = "food") => {
    const key = `${type}_${itemId}`;

    if (!token) {
      setGuestCartItems((prev) => {
        const updated = { ...prev };
        delete updated[key];
        localStorage.setItem("guestCart", JSON.stringify(updated));
        return updated;
      });
      return;
    }

    setUserCartItems((prev) => {
      const updated = { ...prev };
      delete updated[key];
      localStorage.setItem("userCartBackup", JSON.stringify(updated)); // ✅ backup mới
      return updated;
    });

    try {
      await axios.post(
        `${url}/api/cart/remove`,
        { itemId, type },
        { headers: { token } }
      );
    } catch (err) {
      console.error("❌ Error removing from user cart:", err);
    }
  };

  // ========================= 💰 TOTAL =========================
  const getTotalCartAmount = () => {
    let total = 0;
    const list = token ? userCartItems : guestCartItems;
    for (const key in list) {
      const qty = list[key] || 0;
      const [type, id] = key.split("_");
      const data = type === "combo" ? combos : food_list;
      const item = data.find((p) => p._id === id);
      if (item) {
        const price =
          type === "combo" ? item.discountPrice || item.price : item.price;
        total += price * qty;
      }
    }
    return total;
  };

  // ========================= 🧹 CLEAR CART =========================
  const clearCart = async () => {
    if (!token) {
      setGuestCartItems({});
      localStorage.removeItem("guestCart");
      return;
    }

    try {
      await axios.post(`${url}/api/cart/clear`, {}, { headers: { token } });
      setUserCartItems({});
      localStorage.removeItem("userCartBackup");
    } catch (err) {
      console.error("❌ Error clearing user cart:", err);
    }
  };

  // ========================= 🔁 FETCH DATA =========================
  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      setFoodList(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error("❌ Error fetching food:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${url}/api/categories`);
      setCategories(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error("❌ Error fetching categories:", err);
    }
  };

  const fetchCombos = async () => {
    try {
      const res = await axios.get(`${url}/api/combos`);
      setCombos(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error("❌ Error fetching combos:", err);
    }
  };

  // ========================= 🧠 LOAD USER CART =========================
  const loadUserCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${url}/api/cart/get`, {
        headers: { token },
      });

      const serverCart = res.data.cartData || {};

      if (Object.keys(serverCart).length > 0) {
        setUserCartItems(serverCart);
        localStorage.setItem("userCartBackup", JSON.stringify(serverCart));
      } else {
        // 🧩 Nếu BE không có, lấy bản backup cục bộ
        const backup = localStorage.getItem("userCartBackup");
        if (backup) setUserCartItems(JSON.parse(backup));
      }
    } catch (err) {
      console.error("❌ Error loading user cart:", err);
      // fallback local
      const backup = localStorage.getItem("userCartBackup");
      if (backup) setUserCartItems(JSON.parse(backup));
    }
  };

  // ========================= 🔐 AUTH =========================
  const loginUser = async (data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // 🔄 Đồng bộ giỏ guest → server
    if (Object.keys(guestCartItems).length > 0) {
      for (const key in guestCartItems) {
        const [type, id] = key.split("_");
        const qty = guestCartItems[key];
        try {
          await axios.post(
            `${url}/api/cart/add`,
            { itemId: id, type, quantity: qty },
            { headers: { token: data.token } }
          );
        } catch (err) {
          console.error("❌ Sync guest cart error:", err);
        }
      }
      localStorage.removeItem("guestCart");
      setGuestCartItems({});
    }

    await loadUserCart();
  };

  const logoutUser = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // ⚠️ KHÔNG reset userCartItems để giữ lại giỏ hàng backup
    navigate("/");
  };

  // ========================= INIT =========================
  useEffect(() => {
    fetchFoodList();
    fetchCategories();
    fetchCombos();

    if (token) {
      loadUserCart();
    } else {
      const backup = localStorage.getItem("userCartBackup");
      if (backup) {
        setUserCartItems(JSON.parse(backup));
      }
    }
  }, [token]);

  const contextValue = {
    url,
    user,
    token,
    food_list,
    categories,
    combos,
    setUser,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItem,
    getTotalCartAmount,
    clearCart,
    loginUser,
    logoutUser,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
