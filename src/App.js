import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./Components/Login/Login";
import Dashboard from "./Components/Login/Dashboard/Dashboard";
import Userlist from "./Userlist/Userlist";
import Userdetails from "./UserDeatail/Userdetails";
import Adminlist from "./Components/Login/Adminlist/Adminlist";
import AddAdmin from "./Components/Login/AddAdmin/AddAdmin";
import AdminDetails from "./Components/Login/AdminDetail/AdminDetails";
import EditAdmin from "./Components/Login/EditAdmin/EditAdmin";
import SubscriptionList from "./Components/Login/Subscription/SubscriptionList";
import AddPlan from "./Components/Login/AddPlan/AddPlan";
import Pushnotifications from "./Components/PushNotification/Pushnotifications";
import EventManagement from "./Components/EventManagement/EventManagement";
import Profile from "./Components/Profile/Profile";
import TermsConditions from "./Components/TermsConditions/TermsConditions";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Userlist />} />
        <Route path="/user/:id" element={<Userdetails />} />
        <Route path="/admin-list" element={<Adminlist />} />
        <Route path="/add-admin" element={<AddAdmin />} />
        <Route path="/admin-details/:id" element={<AdminDetails />} />
        <Route path="/edit-admin/:id" element={<EditAdmin />} />
        <Route path="/subscriptions" element={<SubscriptionList />} />
        <Route path="/add-plan" element={<AddPlan />} />
        <Route
          path="/notifications/create"
          element={<Pushnotifications />}
        />
        <Route path="/events" element={<EventManagement />} />
         <Route path="/profile" element={<Profile />} />
         <Route path="/terms-conditions" element={<TermsConditions />} />


      </Routes>
       <ToastContainer position="top-right" autoClose={2500} />
    </Router>
  );
}

export default App;
