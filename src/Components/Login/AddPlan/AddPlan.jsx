import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import "./AddPlan.css";

const AddPlan = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    planName: "",
    price: "",
    description: "",
    participantLimit: "",
    maxPhotoPerParticipant: "",
    eventDuration: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!formData.planName || !formData.price) {
      toast.error("Plan name and price are required");
      return;
    }

    fetch("http://localhost:8080/api/subscriptions/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        price: Number(formData.price),
        participantLimit: Number(formData.participantLimit),
        maxPhotoPerParticipant: Number(formData.maxPhotoPerParticipant),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add plan");
        return res.json();
      })
      .then(() => {
        toast.success("Subscription plan added successfully");
        navigate("/subscriptions");
      })
      .catch(() => {
        toast.error("Error adding plan");
      });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="right-content">
        <Topbar />

        <div className="addplan-page">
          <h2 className="page-title">Add Plan</h2>
          <p className="page-subtitle">Add the details below</p>

          <div className="addplan-card">
            <div className="form-grid">
              <div className="form-group">
                <label>Plan Name</label>
                <input
                  type="text"
                  name="planName"
                  placeholder="Enter plan name"
                  value={formData.planName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Participant Limit</label>
                <input
                  type="number"
                  name="participantLimit"
                  value={formData.participantLimit}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Photo Limit</label>
                <input
                  type="number"
                  name="maxPhotoPerParticipant"
                  value={formData.maxPhotoPerParticipant}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full">
                <label>Event Duration</label>
                <input
                  type="text"
                  name="eventDuration"
                  placeholder="eg. 2 hrs"
                  value={formData.eventDuration}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="cancel-btn" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSubmit}>
                Add Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Toast container */}
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default AddPlan;
