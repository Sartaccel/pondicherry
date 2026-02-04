import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import "./Subscription.css";

const SubscriptionList = () => {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:8080/api/subscriptions/list"
      );

      setPlans(response.data); // ✅ API data
    } catch (error) {
      console.error("Error fetching subscriptions", error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="right-content">
        <Topbar />

        <div className="subscription-container">

          {/* HEADER */}
          <div className="sub-header-row">
            <div>
              <h2 className="page-head">Subscription Management</h2>
              <p className="page-subtitle">Manage User subscription plans</p>
            </div>

            <button
              className="add-plan-btn"
              onClick={() => navigate("/add-plan")}
            >
              Add Plan
            </button>
          </div>

          {/* LOADER */}
          {loading ? (
            <div className="sub-skeleton-table">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div className="sk-row" key={i}></div>
                ))}
            </div>
          ) : (
            <table className="subscription-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Participant Limit</th>
                  <th>Photo limit</th>
                  <th>Duration</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {plans.length === 0 ? (
                  <tr>
                    <td colSpan="7" >
                      No subscription plans found
                    </td>
                  </tr>
                ) : (
                  plans.map((plan) => (
                    <tr key={plan.id}>
                      <td>{plan.planName}</td>
                      <td>₹ {plan.price}</td>
                      <td className="desc-col">{plan.description}</td>
                      <td>{plan.participantLimit}</td>
                      <td>{plan.maxPhotoPerParticipant}</td>
                      <td>{plan.eventDuration}</td>
                      <td>
                        <i className="ri-edit-line action-icon"></i>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionList;
