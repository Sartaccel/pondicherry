import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddAdmin.css"

const AddAdmin = () => {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [formData, setFormData] = useState({
    employeeId: "",
    role: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    sendSetupLink: false,
    profilePhoto: null,
  });

  const [preview, setPreview] = useState(null);

  // Handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // File Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePhoto: file });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit Form
  const handleSubmit = async () => {
    if (!formData.role || !formData.email || !formData.phone) {
      return toast.error("Please fill all required fields!");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    try {
    const payload = new FormData();
payload.append("employeeId", formData.employeeId);
payload.append("role", formData.role);
payload.append("name", formData.name);                // <-- FIXED
payload.append("email", formData.email);
payload.append("phone", formData.phone);
payload.append("password", formData.password);
payload.append("confirmPassword", formData.confirmPassword);  // <-- FIXED
payload.append("sendSetupLink", formData.sendSetupLink);

if (formData.profilePhoto) {
  payload.append("profilePhoto", formData.profilePhoto);
}


      await axios.post("http://localhost:8080/api/admin/register", payload, {
        // headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Admin account created successfully!");
      navigate("/admin-list");

    } catch (error) {
      console.error(error);
      toast.error("Failed to create admin!");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="right-content">
        <Topbar />

        <div className="addadmin-container">
          <h2 className="page-title">Create Admin Account</h2>
          <p className="page-subtitle">Fill in the details to create an employee account.</p>

          <div className="form-card">

            {/* ROW 1 */}
            <div className="form-row">
              <div className="form-group">
                <label>Employee ID</label>
               <input
  type="text"
  name="employeeId"
  placeholder="Enter Employee ID"
  value={formData.employeeId}
  onChange={handleChange}
/>

              </div>


              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  name="role"
                  placeholder="Enter Employee Role"
                  value={formData.role}
                  onChange={handleChange}
                />
              </div>
                            <div className="form-group">
  <label>Name</label>
  <input
    type="text"
    name="name"
    placeholder="Enter Employee Name"
    value={formData.name}
    onChange={handleChange}
  />
</div>

             
            </div>

            {/* ROW 2 */}
            <div className="form-row">

               <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Employee Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
                 <div className="form-group">
                <label>Mobile number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter Employee Mobile Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Profile photo (optional)</label>

                <div className="upload-box">
                  <input type="file" onChange={handleFileChange} />
                  {preview ? (
                    <img src={preview} alt="preview" className="preview-img" />
                  ) : (
                    <span>Upload photo</span>
                  )}
                </div>
              </div>

           

            </div>

            {/* PASSWORD ROW */}
            {/* PASSWORD */}
<div className="formm-group password-wrapper">
  <label>Password</label>
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Enter a Secure Password"
    value={formData.password}
    onChange={handleChange}
  />
  <i
    className={showPassword ? "ri-eye-line toggle-eye" : "ri-eye-off-line toggle-eye"}
    onClick={() => setShowPassword(!showPassword)}
  ></i>
</div>

{/* CONFIRM PASSWORD */}
<div className="formm-group password-wrapper">
  <label>Confirm Password</label>
  <input
    type={showConfirmPassword ? "text" : "password"}
    name="confirmPassword"
    placeholder="Re-enter Password"
    value={formData.confirmPassword}
    onChange={handleChange}
  />
  <i
    className={showConfirmPassword ? "ri-eye-line toggle-eye" : "ri-eye-off-line toggle-eye"}
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  ></i>
</div>


            {/* CHECKBOX */}
            <div className="checkbox-row">
              <input
                type="checkbox"
                name="sendSetupLink"
                checked={formData.sendSetupLink}
                onChange={handleChange}
              />
              <label>Sends a setup link to the employee immediately after the account is created.</label>
            </div>

            {/* BUTTONS */}
            <div className="button-row">
              <button className="cancel-btn" onClick={() => navigate("/admin-list")}>
                Cancel
              </button>

              <button className="create-btn" onClick={handleSubmit}>
                Create Employee
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default AddAdmin
