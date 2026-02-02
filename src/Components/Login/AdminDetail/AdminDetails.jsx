import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import "./AdminDetail.css";

const AdminDetails = () => {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
const [deleting, setDeleting] = useState(false);
const [showStatusPopup, setShowStatusPopup] = useState(false);
const [updatingStatus, setUpdatingStatus] = useState(false);
const [showEditPopup, setShowEditPopup] = useState(false);
const successToast = (msg) => toast.success(msg);
const errorToast = (msg) => toast.error(msg);

 const [imageFile, setImageFile] = useState(null);



  const navigate = useNavigate();

  // =========================
  // Fetch Admin Details API
  // =========================
  const fetchAdminDetails = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:8080/api/admin/all/${id}`
      );

      if (response.data) {
       setAdmin({
    ...response.data,
    profileImg: response.data.profilePhotoUrl || null, // ✅ FIX
  });
        toast.success("Admin details loaded");
      } else {
        setAdmin(null);
      }
    } catch (error) {
      console.error("Error fetching admin:", error);
      toast.error("Failed to load admin details");
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };
  // =========================
// Deactivate / Activate Admin
// =========================
// =========================
// Confirmed Activate / Deactivate
// =========================
const handleConfirmToggleStatus = async () => {
  try {
    setUpdatingStatus(true);

    const response = await axios.put(
      `http://localhost:8080/api/admin/deactivate/${id}`
    );

    toast.success(response.data.message || "Status updated");

    setAdmin(prev => ({
      ...prev,
      status: prev.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
    }));

    setShowStatusPopup(false);

  } catch (error) {
    console.error("Status update failed:", error);
    toast.error("Failed to update status");
  } finally {
    setUpdatingStatus(false);
  }
};

 const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setAdmin((prev) => ({ ...prev, profileImg: previewUrl }));
  };

const handleSave = async () => {
  try {
    const formData = new FormData();

    const adminPayload = {
      name: admin.name,
      role: admin.role,
      email: admin.email,
      mobileNumber: admin.mobileNumber,
      status: admin.status,
    };

  
        // ✅ IMPORTANT KEYS (MATCH BACKEND)
        formData.append("admin", JSON.stringify(adminPayload));
  
        if (imageFile) {
          formData.append("profilePhoto", imageFile);
        }
  
        await axios.put(
          `http://localhost:8080/api/admin/all/update/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
  
        toast.success("Admin updated successfully");
        navigate("/admin-list");
  
      } catch (err) {
        console.error(err);
        toast.error("Failed to update admin");
      }
    };
  


  // =========================
// Delete Admin (Public API)
// =========================
const handleDeleteAdmin = async () => {
  try {
    setDeleting(true);

    const response = await axios.delete(
      `http://localhost:8080/api/admin/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    toast.success(
      response?.data?.message || "Employee removed successfully"
    );

    setShowDeletePopup(false);

    setTimeout(() => {
      navigate("/admin-list");
    }, 800);

  } catch (error) {
    console.error("Delete failed:", error);

    toast.error(
      error?.response?.data?.message ||
      "Failed to remove employee"
    );
  } finally {
    setDeleting(false);
  }
};


  useEffect(() => {
    fetchAdminDetails();
  }, [id]);

  // Dummy login activity
  const loginActivity = [
    { date: "05 Jan 2025", time: "3:45 PM", status: "Successful", ip: "192.168.1.4" },
    { date: "05 Jan 2025", time: "3:45 PM", status: "Successful", ip: "192.168.1.4" },
    { date: "05 Jan 2025", time: "3:45 PM", status: "Successful", ip: "192.168.1.4" },
    { date: "05 Jan 2025", time: "3:45 PM", status: "Successful", ip: "192.168.1.4" }
  ];

  // ==================================
  // Skeleton Loader UI
  // ==================================
  if (loading) {
    return (
      <div className="dashboard-layout">
        
        <Sidebar />
        <div className="right-content">
          <Topbar />
          <div className="skeleton-card">
            <div className="skeleton-circle"></div>
            <div className="skeleton-details">
              <div className="skeleton-line w-40"></div>
              <div className="skeleton-line w-60"></div>
              <div className="skeleton-line w-50"></div>
              <div className="skeleton-line w-30"></div>
              <div className="skeleton-line w-25"></div>
            </div>
          </div>

          <div className="skeleton-box">
            <div className="skeleton-line w-30"></div>
            <div className="skeleton-table">
              <div className="skeleton-line w-90"></div>
              <div className="skeleton-line w-80"></div>
              <div className="skeleton-line w-85"></div>
              <div className="skeleton-line w-70"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================================
  // Admin Not Found UI
  // ==================================
  if (!admin) {
    return (
      <div className="dashboard-layout">
        <ToastContainer position="top-right" autoClose={2000} />

        <Sidebar />
        <div className="right-content">
          <Topbar />
          <div className="notfound-container">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png"
              alt="Not found"
            />
            <h2>Admin Not Found</h2>
            <p>The requested admin ID does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  // ==================================
  // Main UI
  // ==================================
  return (
    <div className="dashboard-layout">
      <ToastContainer position="top-right" autoClose={2000} />

      <Sidebar />
      <div className="right-content">
        <Topbar />

        <div className="admin-details-container">

          <div className="header-row">
            <div>
              <h2 className="page-title">Admin Details</h2>
              <p className="page-subtitle">Details and activity log</p>
            </div>
            {showEditPopup && (
  <div className="popup-overlay">
    <div className="popup-box large-popup">
      
      <h3 style={{textAlign:"left"}}>Edit Profile</h3>
      <p style={{textAlign:"left"}} className="popup-subtitle">Admin Details and activitylog</p>

          
                {/* PROFILE IMAGE */}
                <div className="photo-upload-row">
                  <img
                    src={admin.profileImg || "/default-user.png"}
                    alt="Profile"
                    className="profile-img"
                  />

                  <input
                    type="file"
                    id="fileUpload"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    hidden
                  />

                  <label htmlFor="fileUpload" className="upload-btn">
                    Upload Photo
                  </label>
                </div>

      {/* ===== EDIT FORM (SAME STRUCTURE) ===== */}
      <div className="form-grid">

        <div className="form-group">
          <label>Name</label>
          <input
            value={admin.name}
            onChange={(e) =>
              setAdmin({ ...admin, name: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <input value={admin.role} readOnly />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input value={admin.email} readOnly />
        </div>

        <div className="form-group">
          <label>Mobile Number</label>
          <input
            value={admin.mobileNumber}
            onChange={(e) =>
              setAdmin({ ...admin, mobileNumber: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            value={admin.status}
            onChange={(e) =>
              setAdmin({ ...admin, status: e.target.value })
            }
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

      </div>

      {/* ===== ACTIONS ===== */}
      <div className="popup-actions">
        <button
          className="cancels-btn"
          onClick={() => setShowEditPopup(false)}
        >
          Cancel
        </button>

        <button
          className="confirm-btn"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>

    </div>
  </div>
)}


           <button
  className="edit-btn"
  onClick={() => setShowEditPopup(true)}
>
  Edit Profile
</button>

          </div>

          <div className="details-card">
          <img
  src={admin.profileImg || "/default-user.png"}
  alt="Admin"
  className="admin-photo"
/>


            <div className="details-grid">

              <div className="row row-1">
                <p><strong>Employee name</strong><br />{admin.name}</p>
                <p><strong>Role</strong><br />{admin.role}</p>
                <p><strong>Email</strong><br />{admin.email}</p>
                <p><strong>Mobile Number</strong><br />{admin.mobileNumber}</p>
                <p>
                  <strong>Status</strong><br />
               <span className={admin.status === "ACTIVE" ? "active" : "inactive"}>
  {admin.status}
</span>

                </p>
              </div>

              <div className="divider"></div>

              <div className="row row-1">
                <p><strong>Account Created</strong><br /> {new Date(admin.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}</p>
                <p><strong>Created By</strong><br />{admin.createdBy}Super Admin</p>
                <p><strong>Last Login</strong><br />{admin.lastLogin}</p>
              </div>
            </div>
          </div>

          <div className="lower-section">

            <div className="activity-box">
              <div className="box-header">
                <h3>Recent Login Activity</h3>
                <a href="#">View activity</a>
              </div>

              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>IP Address</th>
                  </tr>
                </thead>

                <tbody>
                  {loginActivity.map((log, i) => (
                    <tr key={i}>
                      <td>{log.date}</td>
                      <td>{log.time}</td>
                      <td className="success">{log.status}</td>
                      <td>{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="quick-actions">
              <h3>Quick Action</h3>
              <button className="action-btn">Reset password</button>
              {showStatusPopup && (
  <div className="popup-overlay">
    <div className="popup-box">
      <h3>
        {admin.status === "ACTIVE"
          ? "Deactivate Employee"
          : "Activate Employee"}
      </h3>

      <p>
        {admin.status === "ACTIVE"
          ? "Are you sure you want to deactivate this employee?"
          : "Are you sure you want to activate this employee?"}
      </p>

      <div className="popup-actions">
        <button
          className="cancel-btn"
          onClick={() => setShowStatusPopup(false)}
          disabled={updatingStatus}
        >
          Cancel
        </button>

        <button
          className="confirm-btn"
          onClick={handleConfirmToggleStatus}
          disabled={updatingStatus}
        >
          {updatingStatus
            ? "Updating..."
            : admin.status === "ACTIVE"
              ? "Yes, Deactivate"
              : "Yes, Activate"}
        </button>
      </div>
    </div>
  </div>
)}

      <button
  className="action-btn"
  onClick={() => setShowStatusPopup(true)}
>
  {admin.status === "ACTIVE" ? "Deactivate" : "Activate"}
</button>


              {showDeletePopup && (
  <div className="popup-overlay">
    <div className="popup-box">
      <h3>Remove Employee</h3>
      <p>Are you sure you want to remove this employee?</p>

      <div className="popup-actions">
        <button
          className="cancel-btn"
          onClick={() => setShowDeletePopup(false)}
          disabled={deleting}
        >
          Cancel
        </button>

        <button
          className="confirm-btn"
          onClick={handleDeleteAdmin}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Yes, Remove"}
        </button>
      </div>
    </div>
  </div>
)}

   <button
  className="remove-btn"
  onClick={() => setShowDeletePopup(true)}
>
  Remove Employee
</button>


            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDetails;
