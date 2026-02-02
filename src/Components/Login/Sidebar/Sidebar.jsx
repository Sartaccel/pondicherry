import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import dhash from "../../../images/bellylogo.jpeg";
import logoutIcon from "../../../images/Logout.svg";
import "remixicon/fonts/remixicon.css";
import "./Sidebar.css";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // 🔹 Logout popup state
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // ✅ ADMIN ID
  const adminId = localStorage.getItem("adminId");

  const menuItems = [
    { name: "Dashboard", icon: "ri-dashboard-line", path: "/dashboard" },
    { name: "Events", icon: "ri-calendar-event-line", path: "/events" },
    { name: "User Details", icon: "ri-user-line", path: "/users" },
    { name: "Admin List", icon: "ri-admin-line", path: "/admin-list" },
    { name: "Subscription", icon: "ri-bank-card-line", path: "/subscriptions" },
    { name: "Push Notification", icon: "ri-notification-3-line", path: "/notifications/create" },
    { name: "Settings", icon: "ri-settings-3-line", path: "/terms-conditions" }
  ];

  // ⭐ ACTIVE MENU LOGIC
  const getActiveClass = (item) => {
    const current = location.pathname;

    if (item.path === "/users" && current.startsWith("/user/")) return "active";
    if (
      item.path === "/admin-list" &&
      (current.startsWith("/admin-details") || current.startsWith("/add-admin"))
    ) {
      return "active";
    }

    return current === item.path ? "active" : "";
  };

  // ⏳ Skeleton Loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // 🔴 FINAL LOGOUT ACTION
  const handleConfirmLogout = async () => {
    setShowLogoutPopup(false);

    if (!adminId) {
      localStorage.clear();
      navigate("/");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/admin/logout/${adminId}`
      );

      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.response || error.message);
      alert("Logout failed");
    }
  };

  return (
    <>
      <aside className="sidebar">

        {/* -------- LOGO -------- */}
        <div className="sidebar-logo">
          {loading ? <div className="sk-logo"></div> : <img src={dhash} alt="logo" />}
        </div>

        {/* -------- MENU -------- */}
        <ul className="sidebar-menu">
          {loading ? (
            <>
              <li className="sk-menu"></li>
              <li className="sk-menu"></li>
              <li className="sk-menu"></li>
              <li className="sk-menu"></li>
              <li className="sk-menu"></li>
              <li className="sk-menu"></li>
            </>
          ) : (
            menuItems.map((item) => (
              <li
                key={item.name}
                className={getActiveClass(item)}
                onClick={() => navigate(item.path)}
              >
                <i className={item.icon}></i> {item.name}
              </li>
            ))
          )}
        </ul>

        {/* -------- LOGOUT -------- */}
        <div className="logout-container">
          <button
            onClick={() => setShowLogoutPopup(true)}
            className="logout-button"
          >
            <img src={logoutIcon} alt="Logout" className="menu-icon" />
            Logout
          </button>
        </div>

      </aside>

      {/* ===== LOGOUT CONFIRM POPUP ===== */}
      {showLogoutPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Logout</h3>
            <p>Are you sure you want to logout?</p>

            <div className="popup-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowLogoutPopup(false)}
              >
                Cancel
              </button>

              <button
                className="btn-confirm"
                onClick={handleConfirmLogout}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
