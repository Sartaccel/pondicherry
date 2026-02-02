import React, { useState } from "react";
import axios from "axios";
import "./EditProfile.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = ({ profile, adminId, onClose, onSuccess }) => {
  const [previewImage, setPreviewImage] = useState(
    profile?.profilePhotoUrl || "https://i.pravatar.cc/120"
  );

  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    mobileNumber: profile?.mobileNumber || "",
  });

  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const fd = new FormData();

      fd.append(
        "admin",
        JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          role: profile?.role,
          status: profile?.status,
        })
      );

      if (selectedFile) {
        fd.append("profilePhoto", selectedFile);
      }

      const res = await axios.put(
        `http://localhost:8080/api/admin/editprofile/${adminId}`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile updated successfully 🎉", {
        position: "top-right",
      });

      onSuccess(res.data);
      onClose();
    } catch (err) {
      console.error("Edit profile error:", err);

      toast.error("Failed to update profile ❌", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        {/* HEADER */}
        <div className="modal-header">
          <div>
            <h2>Edit Profile</h2>
            <p className="sub-text">Admin Details and activity log</p>
          </div>
        </div>

        {/* AVATAR */}
        <div className="modal-avatar">
          <img
            src={previewImage}
            alt="profile"
            className="profile-avatar"
          />

          <label className="upload-btn">
            Upload Photo <i className="ri-upload-2-line"></i>
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* FORM */}
        <div className="modal-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input type="text" value={profile?.role || ""} disabled />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="modal-actions">
          <button className="outline-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="primary-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        draggable={false}
      />
    </div>
  );
};

export default EditProfile;
