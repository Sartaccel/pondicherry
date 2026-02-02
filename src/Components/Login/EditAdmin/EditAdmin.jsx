import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import "./EditAdmin.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const EditAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  const [admin, setAdmin] = useState({
    name: "",
    role: "",
    email: "",
    mobileNumber: "",
    status: "ACTIVE",
    profileImg: "",
  });

  // ----------------------------------
  // 🔵 LOAD ADMIN DETAILS
  // ----------------------------------
  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/admin/all/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = res.data;

        setAdmin({
          name: data.name || "",
          role: data.role || "",
          email: data.email || "",
          mobileNumber: data.mobileNumber || "",
          status: data.status || "ACTIVE",
          profileImg: data.profilePhotoUrl || "",
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load admin details");
      }
    };

    loadAdmin();
  }, [id]);

  // ----------------------------------
  // 🔵 IMAGE UPLOAD PREVIEW
  // ----------------------------------
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setAdmin((prev) => ({ ...prev, profileImg: previewUrl }));
  };

  // ----------------------------------
  // 🔵 UPDATE ADMIN
  // ----------------------------------
  const handleSave = async () => {
    try {
      const formData = new FormData();

      const adminPayload = {
        name: admin.name,
        role: admin.role,
        email: admin.email,
        mobileNumber: admin.mobileNumber,
        status: admin.status, // ACTIVE / INACTIVE
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

  // ----------------------------------
  // UI
  // ----------------------------------
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="right-content">
        <Topbar />

        <div className="edit-admin-page">
          <div className="edit-container">
            <h2>Edit Admin</h2>
            <p className="sub-text">Update admin information</p>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
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

                {/* FORM */}
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
                        setAdmin({
                          ...admin,
                          mobileNumber: e.target.value,
                        })
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

                {/* ACTION BUTTONS */}
                <div className="action-buttons">
                  <button className="cancel-btn" onClick={() => navigate(-1)}>
                    Cancel
                  </button>

                  <button className="save-btn" onClick={handleSave}>
                    Save Changes
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAdmin;
