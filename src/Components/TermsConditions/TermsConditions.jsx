import React, { useEffect, useState } from "react";
import "./TermsConditions.css";
import Sidebar from "../Login/Sidebar/Sidebar";
import Topbar from "../Login/Topbar/Topbar";
import axios from "axios";

const TermsConditions = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [terms, setTerms] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/terms/latest")
      .then((res) => {
        setTerms(res.data.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch terms", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <div className="page-content terms-wrapper">
          <div className="terms-header">
            <div>
              <h2>Terms & Conditions</h2>
              <p>Manage list and View user</p>
            </div>

            <button className="edit-btn" onClick={() => setIsEdit(!isEdit)}>
              Edit
            </button>
          </div>

          <div className="terms-box">
            {loading ? (
              <p>Loading...</p>
            ) : isEdit ? (
              <textarea
                className="terms-textarea"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
              />
            ) : (
              <div
                className="terms-content"
                dangerouslySetInnerHTML={{ __html: terms }}
              />
            )}
          </div>

          <div className="terms-actions">
            <button className="cancel-btn">Cancel</button>
            <button className="publish-btn">Publish</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
