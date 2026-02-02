import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import "./Topbar.css";

const Topbar = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
    if (!adminId) return;

    axios
      .get(`http://localhost:8080/api/admin/profile/${adminId}`)
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.error("Profile API error:", err);
      });
  }, [adminId]);

  return (
    <header className="topbar">
      <h3>Dashboard</h3>

      <div className="topbar-right">
        <div className="notify-box">
          <i className="ri-notification-3-line"></i>
          <span className="notify-dot"></span>
        </div>

        <div
          className="profile"
          onClick={() => navigate("/profile")}
          style={{ cursor: "pointer" }}
        >
          <img
            src={
              profile?.profilePhotoUrl ||
              "https://i.pravatar.cc/40"
            }
            alt="user"
          />

          <div className="profile-text">
            <h4>{profile?.name || "-"}</h4>
            <p>{profile?.role || "-"}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
