import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import "./Adminlist.css";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";

const Adminlist = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  // 🔒 Prevent double API call in StrictMode
  const effectRan = useRef(false);

  // Fetch Admin List API
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/admin/all");
      setAdmins(response.data || []);
      setLoading(false);
      toast.success("Admin list loaded successfully!");
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to load admin list!");
      setLoading(false);
    }
  };

  // Load admins on page load (only once)
  useEffect(() => {
    if (!effectRan.current) {
      fetchAdmins();
      effectRan.current = true;
    }
  }, []);

  // 🔹 Pagination calculations
  const totalAdmins = admins.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAdmins = admins.slice(startIndex, endIndex);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="right-content">
        <Topbar />

        <div className="adminlist-container">
          <div className="header-row">
            <div>
              <h2 className="page-head">Admin List</h2>
              <p className="page-subtitle">Manage list and View Admin</p>
            </div>

            {userRole === "SUPER_ADMIN" && (
              <button
                className="add-admin-btn"
                onClick={() => navigate("/add-admin")}
              >
                Add Admin
              </button>
            )}
          </div>

          {/* SEARCH */}
          <div className="search-box admin-search">
            <input type="text" placeholder="Search by name or number" />
            <i className="ri-search-line"></i>
          </div>

          {/* TABLE */}
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile number</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : paginatedAdmins.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No admins found
                  </td>
                </tr>
              ) : (
                paginatedAdmins.map((admin) => (
                  <tr key={admin.id}>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>{admin.mobileNumber}</td>
                    <td>{admin.role}</td>
                    <td>{admin.status}</td>
                    <td>
                      <i
                        className="ri-eye-line table-view-icon"
                        onClick={() => navigate(`/admin-details/${admin.id}`)}
                        style={{ cursor: "pointer" }}
                      ></i>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          {!loading && totalAdmins > 0 && (
            <div className="figma-pagination">
              <span>
                Showing {startIndex + 1}–
                {Math.min(endIndex, totalAdmins)} of {totalAdmins}
              </span>

              <div className="figma-pagination-arrows">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  ◀
                </button>
                <button
                  disabled={endIndex >= totalAdmins}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  ▶
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Adminlist;
