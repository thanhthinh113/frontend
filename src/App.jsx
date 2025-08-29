import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";

import { Navbar } from "./components/Navbar/Navbar";
import { Footer } from "./components/Footer/Footer";
import { LoginPopup } from "./components/LoginPopup/LoginPopup";

import { Home } from "./pages/Home/Home";
import { Cart } from "./pages/Cart/Cart";
import { PlaceOrder } from "./pages/PlaceOrder/PlaceOrder";
import { Verify } from "./pages/Verify/Verify";
import { MyOrders } from "./pages/MyOrders/MyOrders";
import { Admin } from "./pages/Admin/Admin";
import CheckAdmin from "./CheckAdmin/CheckAdmin";

export const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <ToastContainer autoClose={3000} transition={Slide} />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <Routes>
        {/* USER LAYOUT */}
        <Route
          path="/*"
          element={
            <div className="app">
              <Navbar setShowLogin={setShowLogin} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order" element={<PlaceOrder />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/myorders" element={<MyOrders />} />
              </Routes>
              <Footer />
            </div>
          }
        />

        {/* ADMIN LAYOUT */}
        <Route
          path="/admin/*"
          element={
            <CheckAdmin>
              <div className="admin-layout flex">
                {/* Sidebar + Content */}
                <div className="w-1/5 bg-gray-800 text-white p-4">
                  Sidebar menu
                </div>
                <div className="w-4/5 p-4">
                  <Routes>
                    <Route path="dashboard" element={<Admin />} />
                  </Routes>
                </div>
              </div>
            </CheckAdmin>
          }
        />
      </Routes>
    </>
  );
};

export default App;
