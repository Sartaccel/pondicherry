import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Sidebar from "../Components/Login/Sidebar/Sidebar";
import Topbar from "../Components/Login/Topbar/Topbar";

import "./Userdetails.css";

const Userdetails = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);

      const userRes = await axios.get(
        `http://localhost:8080/api/admin/users/${id}`
      );

      const userData = userRes.data;

      // Fetch profile image
      try {
        const profileRes = await axios.get(
          `http://localhost:8080/api/profile/view/${id}`
        );

        userData.profileImageUrl =
          profileRes.data?.data?.profileImageUrl || "/default-user.png";
      } catch (imageErr) {
        console.warn("Profile image not found.");
        userData.profileImageUrl = "/default-user.png";
      }

      setUser(userData);
      setActivity(userData.activity || []);
      setSummary(userData.summary || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  /* ---------------------------------------------------
        ⭐ BEAUTIFUL SKELETON LOADER UI ⭐
  --------------------------------------------------- */
  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="right-content">
          <Topbar />

          <div className="userdetails-container">

            <div className="sk-details-card">
              <div className="sk-photo"></div>

              <div className="sk-row">
                <div className="sk-line w-20"></div>
                <div className="sk-line w-20"></div>
                <div className="sk-line w-25"></div>
                <div className="sk-line w-20"></div>
                <div className="sk-line w-15"></div>
              </div>

              <div className="sk-divider"></div>

              <div className="sk-row">
                <div className="sk-line w-30"></div>
                <div className="sk-line w-25"></div>
                <div className="sk-line w-35"></div>
              </div>
            </div>

            {/* Activity Skeleton */}
            <div className="sk-table-box">
              <div className="sk-line w-20"></div>

              {Array(5).fill(0).map((_, i) => (
                <div className="sk-table-row" key={i}>
                  <div className="sk-line w-30"></div>
                  <div className="sk-line w-20"></div>
                  <div className="sk-line w-40"></div>
                  <div className="sk-line w-15"></div>
                </div>
              ))}
            </div>

            {/* Summary Skeleton */}
            <div className="sk-table-box">
              <div className="sk-line w-25"></div>

              {Array(4).fill(0).map((_, i) => (
                <div className="sk-table-row" key={i}>
                  <div className="sk-line w-40"></div>
                  <div className="sk-line w-10"></div>
                  <div className="sk-line w-30"></div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------
       ⭐ MAIN CONTENT (UNCHANGED) ⭐
  --------------------------------------------------- */

  if (!user) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="right-content">
          <Topbar />
          <h2 style={{ padding: "40px" }}>User Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="right-content">
        <Topbar />

        <div className="userdetails-container">
          <h2 className="page-title">User Details</h2>
          <p className="page-subtitle">Details and activity log</p>

          <div className="details-card">
            <img
              src={user.profileImageUrl || "/default-user.png"}
              alt="Profile"
              className="user-photo"
            />

            <div className="details-grid">
              <div className="row row-1">
                <p><strong>User name</strong><br />{user.name}</p>
                <p><strong>User ID</strong><br />{user.id}</p>
                <p><strong>Email</strong><br />{user.email}</p>
                <p><strong>Mobile Number</strong><br />{user.phone}</p>
                <p><strong>Status</strong><br /><span className="active">Active</span></p>
              </div>

              <div className="divider"></div>

              <div className="row row-1">
                <p>
                  <strong>Account Created</strong><br />
                  {new Date(user.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

                <p><strong>Device</strong><br />{user.device}</p>

                <p>
                  <strong>Last Login</strong><br />
                  {user.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }) +
                      " at " +
                      new Date(user.updatedAt).toLocaleTimeString("en-IN", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "—"}
                </p>
              </div>

            </div>
          </div>

          {/* Activity Section */}
          <div className="activity-section">

            <div className="recent-box">
              <div className="box-header">
                <h3>Recent Activity</h3>
                <a href="#">View activity</a>
              </div>

              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Activity</th>
                    <th>Details</th>
                  </tr>
                </thead>

                <tbody>
                  {activity.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: "center" }}>No activity found</td></tr>
                  ) : (
                    activity.map((a, i) => (
                      <tr key={i}>
                        <td>{a.date}</td>
                        <td>{a.time}</td>
                        <td>{a.action}</td>
                        <td>{a.details}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

            </div>

            <div className="summary-box">
              <h3>Activity Summary</h3>

              <table className="summary-table">
                <thead>
                  <tr>
                    <th>Activity Type</th>
                    <th>Count</th>
                    <th>Last Activity</th>
                  </tr>
                </thead>

                <tbody>
                  {summary.length === 0 ? (
                    <tr><td colSpan="3" style={{ textAlign: "center" }}>No summary available</td></tr>
                  ) : (
                    summary.map((s, i) => (
                      <tr key={i}>
                        <td>{s.type}</td>
                        <td>{s.count}</td>
                        <td>{s.last}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Userdetails;
