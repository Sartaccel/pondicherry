import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../images/bellylogo.jpeg";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./login.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/admin/login",
        {
          email,
          password,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      // ✅ BACKEND RETURNS THIS
      const token = response.data.token;
      const userId = response.data.id;
      const role = response.data.role;
      const adminId = response.data.id;


      if (!token) {
        toast.error("Invalid login response from server");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
      localStorage.setItem("adminId", adminId);
      toast.success("Login successful!");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      const message =
        error.response?.data?.message ||
        "Login failed. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <div className="pattern"></div>
      </div>

      <div className="right-section">
        <div className="form-wrapper">
          <img src={logo} alt="Logo" className="logo" />
          <h3>Welcome to Belly Button</h3>

          <p className="signin-title">Sign in to your account</p>

          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <i className="fas fa-envelope icon"></i>
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} icon`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="options">
            <label>
              <input type="checkbox" /> Keep me signed in
            </label>
            <a href="#" className="forgot">Forgot password?</a>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default Login;
