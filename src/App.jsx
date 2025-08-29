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
import CheckAdmin from "./CheckAdmin/CheckAdmin";

import { Sidebar } from "./Admin/components/Sidebar/Sidebar";
import { Navbar as NavbarAdmin } from "./Admin/components/Navbar/Navbar";
import { Add } from "./admin/pages/Add/Add";
import { List } from "./admin/pages/List/List";
import { Orders } from "./admin/pages/Orders/Orders";

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
            <>
              <div className="app">
                <Navbar setShowLogin={setShowLogin} />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/order" element={<PlaceOrder />} />
                  <Route path="/verify" element={<Verify />} />
                  <Route path="/myorders" element={<MyOrders />} />
                </Routes>
              </div>
              <Footer />
            </>
          }
        />

        {/* ADMIN LAYOUT */}
        <Route
          path="/admin/*"
          element={
            <CheckAdmin>
              <NavbarAdmin />
              <hr />
              <div className="app-content">
                <Sidebar />
                <div className="app-admin-pages">
                  <Routes>
                    <Route path="/add" element={<Add />} />
                    <Route path="/list" element={<List />} />
                    <Route path="orders" element={<Orders />} />
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
