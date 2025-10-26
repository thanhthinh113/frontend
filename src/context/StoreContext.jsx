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
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("guestCart");
    return storedCart ? JSON.parse(storedCart) : {};
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [food_list, setFoodList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [combos, setCombos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const url = "http://localhost:4000";

  // ========================= 🛒 THÊM VÀO GIỎ =========================
  const addToCart = async (itemId, type = "food") => {
    const key = `${type}_${itemId}`;

    setCartItems((prev) => {
      const updated = { ...prev, [key]: (prev[key] || 0) + 1 };
      localStorage.setItem("guestCart", JSON.stringify(updated)); // ✅ Lưu lại
      return updated;
    });

    if (!token) return; // Nếu chưa đăng nhập thì chỉ lưu local

    try {
      await axios.post(
        `${url}/api/cart/add`,
        { itemId, type },
        { headers: { token } }
      );
    } catch (err) {
      console.error("❌ Error adding to cart", err);
    }
  };

  // ========================= 🗑️ XÓA KHỎI GIỎ =========================
  const removeFromCart = async (itemId, type = "food") => {
    const key = `${type}_${itemId}`;

    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[key] > 1) updated[key] -= 1;
      else delete updated[key];
      localStorage.setItem("guestCart", JSON.stringify(updated)); // ✅ Lưu lại
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

  // 🧹 Xóa toàn bộ giỏ hàng
   const clearCart = async () => {
  try {
    // ✅ Nếu user đã đăng nhập, gọi API backend để xóa luôn trên server
    if (token) {
      await axios.post(`${url}/api/cart/clear`, {}, { headers: { token } });
    }

    // ✅ Reset giỏ hàng local về rỗng
    setCartItems({});
    localStorage.removeItem("guestCart");

    console.log("🧹 Giỏ hàng đã được xóa toàn bộ!");
  } catch (err) {
    console.error("❌ Error clearing cart:", err);
  }
};


  // ========================= 📦 FETCH DỮ LIỆU =========================
  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      if (res.data.success) setFoodList(res.data.data);
      else if (Array.isArray(res.data)) setFoodList(res.data);
      else setFoodList([]);
    } catch (err) {
      console.error("❌ Error fetching food list:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${url}/api/categories`);
      if (res.data.success) setCategories(res.data.data || []);
      else if (Array.isArray(res.data)) setCategories(res.data);
      else setCategories([]);
    } catch (err) {
      console.error("❌ Error fetching categories:", err);
    }
  };

  const fetchCombos = async () => {
    try {
      const res = await axios.get(`${url}/api/combos`);
      if (res.data.success) setCombos(res.data.data || []);
      else if (Array.isArray(res.data)) setCombos(res.data);
      else setCombos([]);
    } catch (err) {
      console.error("❌ Error fetching combos:", err);
    }
  };

  // ========================= 🔁 LOAD CART (CHỈ KHI CẦN) =========================
  const loadCartData = async (token) => {
    try {
      const res = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token } }
      );
      if (res.data.cartData && Object.keys(res.data.cartData).length > 0) {
        setCartItems(res.data.cartData);
      }
    } catch (err) {
      console.error("❌ Error loading cart data:", err);
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
        console.warn("⚠️ Không thể lấy thông tin user:", res.data.message);
      }
    } catch (err) {
      console.error("❌ Lỗi tải user mới:", err);
    }
  };

  // ========================= 🧠 USE EFFECT CHÍNH =========================
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        // Tải song song để nhanh hơn
        await Promise.all([fetchFoodList(), fetchCategories(), fetchCombos()]);

        if (token) {
          await refreshUser();

          // ✅ Chỉ tải lại giỏ hàng nếu đang trống
          if (Object.keys(cartItems).length === 0) {
            const res = await axios.post(
              `${url}/api/cart/get`,
              {},
              { headers: { token } }
            );
            if (isMounted && res.data.cartData) {
              setCartItems(res.data.cartData);
            }
          }
        } else {
          // ✅ Chưa đăng nhập → chỉ khôi phục từ localStorage
          if (isMounted && Object.keys(cartItems).length === 0) {
            const stored = localStorage.getItem("guestCart");
            if (stored) {
              const parsed = JSON.parse(stored);
              if (Object.keys(parsed).length > 0) setCartItems(parsed);
            }
          }
        }
      } catch (err) {
        console.error("❌ Lỗi khi load dữ liệu:", err);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // ✅ Luôn lưu giỏ hàng xuống localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("guestCart", JSON.stringify(cartItems));
  }, [cartItems]);

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
    clearCart,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
