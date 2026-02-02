import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Components/Login/Sidebar/Sidebar";
import Topbar from "../Components/Login/Topbar/Topbar";
import "./Userlist.css";

const Userlist = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const dateInputRef = useRef(null);

  // 🔹 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/admin/users");
      setUsers(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error loading users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDate]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
  };

  // FILTER USERS
  const filteredUsers = users.filter((user) => {
    const name = user.name?.toLowerCase() || "";
    const mobile = (user.mobileNumber || user.phone || "").toString();

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      mobile.includes(searchTerm);

    const matchesDate = selectedDate
      ? new Date(user.createdAt).toISOString().split("T")[0] === selectedDate
      : true;

    return matchesSearch && matchesDate;
  });

  // PAGINATION LOGIC
  const totalUsers = filteredUsers.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="right-content">
        <Topbar />

        <div className="users-container">
          <h2 className="page-title">Users Management</h2>
          <p className="page-subtitle">Manage list and View user</p>

          {/* SEARCH & FILTER */}
          <div className="user-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name or number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="ri-search-line"></i>
            </div>

            <div className="filters">
              <button className="filter-btn">
                <i className="ri-filter-3-line"></i> Filter By
              </button>

              <div className="filter-field">
                <i
                  className="ri-calendar-line"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    dateInputRef.current?.showPicker
                      ? dateInputRef.current.showPicker()
                      : dateInputRef.current.focus();
                  }}
                ></i>

                <input
                  ref={dateInputRef}
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <button className="reset-btn" onClick={resetFilters}>
                <i className="ri-refresh-line"></i> Reset Filter
              </button>
            </div>
          </div>

          {/* TABLE */}
          {loading ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile number</th>
                  <th>Joined Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Array(8)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index}>
                      <td><div className="sk-line w-70"></div></td>
                      <td><div className="sk-line w-80"></div></td>
                      <td><div className="sk-line w-60"></div></td>
                      <td><div className="sk-icon"></div></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <>
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mobile number</th>
                    <th>Joined Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        No users found
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.mobileNumber || user.phone}</td>
                        <td>
                          {new Date(user.createdAt).toLocaleDateString("en-IN")}
                        </td>
                        <td>
                          <i
                            className="ri-eye-line table-view-icon"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/user/${user.id}`)}
                          ></i>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* ✅ EXACT FIGMA PAGINATION */}
              {totalUsers > 0 && (
                <div className="figma-pagination">
                  <span>
                    Showing {startIndex + 1}–
                    {Math.min(endIndex, totalUsers)} of {totalUsers}
                  </span>

                  <div className="figma-pagination-arrows">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                    ◀
                    </button>
                    <button
                      disabled={endIndex >= totalUsers}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                       ▶
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Userlist;
