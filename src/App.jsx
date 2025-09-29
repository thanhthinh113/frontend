import React, { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";

import { Navbar } from "./components/Navbar/Navbar";
import { Footer } from "./components/Footer/Footer";
import { LoginPopup } from "./components/LoginPopup/LoginPopup";

import { Home } from "./pages/Home/Home";
import { Cart } from "./pages/Cart/Cart";
import { PlaceOrder } from "./pages/PlaceOrder/PlaceOrder";
import { Verify } from "./pages/Verify/Verify";
import { MyOrders } from "./pages/MyOrders/MyOrders";
import { Profile } from "./components/Profile/Profile";

import CheckAdmin from "./CheckAdmin/CheckAdmin";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// Admin
import { Navbar as NavbarAdmin } from "./admin/components/Navbar/Navbar";
import { Sidebar } from "./admin/components/Sidebar/Sidebar";
import { Add } from "./admin/pages/Add/Add";
import { List } from "./admin/pages/List/List";
import { Orders } from "./admin/pages/Orders/Orders";
import { User } from "./admin/pages/User/User";
import { Categories } from "./admin/pages/Categories/Categories";

const UserLayout = ({ setShowLogin }) => (
  <>
    <Navbar setShowLogin={setShowLogin} />
    <Outlet />
    <Footer />
  </>
);

export const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <ToastContainer autoClose={3000} transition={Slide} />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <Routes>
        {/* USER LAYOUT */}
        <Route path="/" element={<UserLayout setShowLogin={setShowLogin} />}>
          <Route index element={<Home />} />
          <Route path="cart" element={<Cart />} />
          <Route path="order" element={<PlaceOrder />} />
          <Route path="verify" element={<Verify />} />
          <Route
            path="myorders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<h2>404 - Not Found</h2>} />
        </Route>

        {/* ADMIN LAYOUT */}
        <Route
          path="/admin"
          element={
            <CheckAdmin>
              <NavbarAdmin />
              <hr />
              <div className="app-content">
                <Sidebar />
                <div className="app-admin-pages">
                  <Outlet />
                </div>
              </div>
            </CheckAdmin>
          }
        >
          <Route path="add" element={<Add />} />
          <Route path="list" element={<List />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<User />} />
          <Route path="categories" element={<Categories />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
