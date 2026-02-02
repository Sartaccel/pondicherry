import React, { useState } from "react";
import Sidebar from "../Login/Sidebar/Sidebar";
import Topbar from "../Login/Topbar/Topbar";
import "./Pushnotification.css"

const Pushnotifications = () => {

    const [scheduleType, setScheduleType] = useState("now");

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT CONTENT */}
      <div className="right-content">
        <Topbar />

       <div className="push-page">
  <div className="push-header">
    <h2 className="page-title">Create Push Notification</h2>
    <p className="page-subtitle">
      Create a notification and Send to users
    </p>
  </div>

  <div className="push-card">
    <div className="push-grid">

      <div className="form-group">
        <label>Notification Title</label>
        <input type="text" placeholder="Enter Notification Title" />
      </div>

      <div className="form-group">
        <label>Photo (optional)</label>
        <div className="upload-input">
          <span>Upload photo</span>
          <i className="ri-upload-2-line"></i>
          <input type="file" />
        </div>
      </div>

      <div className="form-group full">
        <label>Description</label>
        <textarea placeholder="Eg. Check out our latest updates inside the app." />
      </div>

      <div className="form-group full">
        <label>Select</label>
        <div className="select-box">
          <button
            className={`select-btn ${scheduleType === "now" ? "active" : ""}`}
            onClick={() => setScheduleType("now")}
          >
            Send Now
          </button>

          <button
            className={`select-btn ${scheduleType === "later" ? "active" : ""}`}
            onClick={() => setScheduleType("later")}
          >
            Schedule for Later
            <i className="ri-calendar-line"></i>
          </button>
        </div>
      </div>

    </div>

    <div className="form-actions">
      <button className="cancel-btn">Cancel</button>
      <button className="send-btn">Send</button>
    </div>
  </div>


        </div>
      </div>
    </div>
  )
}

export default Pushnotifications
