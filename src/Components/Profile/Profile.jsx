import React, { useEffect, useState } from "react";
import Sidebar from "../Login/Sidebar/Sidebar";
import Topbar from "../Login/Topbar/Topbar";
import axios from "axios";
import "./Profile.css";
import EditProfile from "../EditProfile/EditProfile";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loginActivity, setLoginActivity] = useState([]);
  const [showEdit, setShowEdit] = useState(false);

  const adminId = localStorage.getItem("adminId");

  // =========================
  // FETCH PROFILE
  // =========================
  useEffect(() => {
    if (!adminId) return;

    axios
      .get(`http://localhost:8080/api/admin/profile/${adminId}`)
      .then((res) => {
        setProfile(res.data);

        // ✅ KEEP TOPBAR IMAGE IN SYNC
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("user") || "{}"),
            profilePhotoUrl: res.data.profilePhotoUrl || null,
          })
        );
      })
      .catch((err) => {
        console.error("Profile API error:", err);
      });
  }, [adminId]);

  // =========================
  // LOGIN ACTIVITY
  // =========================
  useEffect(() => {
    if (!adminId) return;

    axios
      .get(`http://localhost:8080/api/admin/login-activity/${adminId}`)
      .then((res) => {
        setLoginActivity(res.data || []);
      })
      .catch((err) => {
        console.error("Login activity API error:", err);
      });
  }, [adminId]);

  // =========================
  // FORMATTERS
  // =========================
  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const [hour, minute] = timeStr.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${formatDate(d)} at ${d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="right-content">
        <Topbar />

        <div className="profile-page">
          {/* HEADER */}
          <div className="profile-page-header">
            <div>
              <h2>Profile</h2>
              <p className="sub-text">Admin Details and activity log</p>
            </div>

            <div className="profile-actions">
              <button className="outline-btn">Change password</button>
              <button className="primary-btn" onClick={() => setShowEdit(true)}>
                Edit Profile
              </button>
            </div>
          </div>

          {/* PROFILE CARD */}
          <div className="profile-card">
            <div className="profile-content">
              {/* AVATAR */}
              <div className="profile-avatar-wrap">
                <img
                  src={
                    profile?.profilePhotoUrl ||
                    "https://i.pravatar.cc/120"
                  }
                  alt="profile"
                  className="profile-avatar"
                />
              </div>

              {/* DETAILS */}
              <div className="profile-details">
                <div className="profile-info">
                  <div><label>Name</label><p>{profile?.name || "-"}</p></div>
                  <div><label>Role</label><p>{profile?.role || "-"}</p></div>
                  <div><label>Email</label><p>{profile?.email || "-"}</p></div>
                  <div><label>Mobile Number</label><p>{profile?.mobileNumber || "-"}</p></div>
                  <div>
                    <label>Status</label>
                    <p className={profile?.status === "ACTIVE" ? "active" : ""}>
                      {profile?.status || "-"}
                    </p>
                  </div>
                </div>

                <div className="profile-divider"></div>

                <div className="profile-meta">
                  <div>
                    <label>Account Created</label>
                    <p>{formatDate(profile?.createdAt)}</p>
                  </div>
                  <div>
                    <label>Last Login</label>
                    <p>{formatDateTime(profile?.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LOGIN ACTIVITY */}
          <div className="activity-card">
            <div className="activity-header">
              <h3>Recent Login Activity</h3>
              <span className="view-link">View activity</span>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {loginActivity.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No login activity found
                    </td>
                  </tr>
                ) : (
                  loginActivity.map((item) => (
                    <tr key={item.id}>
                      <td>{formatDate(item.loginDate)}</td>
                      <td>{formatTime(item.loginTime)}</td>
                      <td className={item.status === "SUCCESS" ? "success" : "failed"}>
                        {item.status}
                      </td>
                      <td>
                        {item.ipAddress === "0:0:0:0:0:0:0:1"
                          ? "127.0.0.1"
                          : item.ipAddress}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showEdit && (
        <EditProfile
          profile={profile}
          adminId={adminId}
          onClose={() => setShowEdit(false)}
          onSuccess={(updatedProfile) => {
            setProfile(updatedProfile);

            // ✅ SYNC TOPBAR IMAGE AFTER UPDATE
            localStorage.setItem(
              "user",
              JSON.stringify({
                ...JSON.parse(localStorage.getItem("user") || "{}"),
                profilePhotoUrl: updatedProfile.profilePhotoUrl,
              })
            );

            setShowEdit(false);
          }}
        />
      )}
    </div>
  );
};

export default Profile;
