import React, { useEffect, useState } from "react";
import dhash from "../../../images/bellylogo.jpeg";
import "remixicon/fonts/remixicon.css";
import "./Dashboard.css";
import Chart from "react-apexcharts";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";

const Dashboard = () => {
  // =============== STATE ===============
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(true); // 👈 ADDED LOADER STATE

  // =============== FETCH USER COUNT ===============
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/admin/user-count");
        const data = await response.json();
        setTotalUsers(data.count);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    const fetchEventCount = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/admin/event-count");
        const data = await response.json();
        setTotalEvents(data.count);
      } catch (error) {
        console.error("Error fetching event count:", error);
      }
    };

    fetchUserCount();
    fetchEventCount();

    // ⏳ Fake loading delay (for skeleton)
    setTimeout(() => setLoading(false), 300);

  }, []);

  // =============== LINE CHART ===============
  const revenueChart = {
    series: [
      {
        name: "Revenue",
        data: [30, 28, 45, 22, 50, 35, 48, 40, 38, 43, 37, 45],
      },
    ],
    options: {
      chart: {
        type: "line",
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      stroke: { curve: "smooth", width: 3, colors: ["#3C82F6"] },
      xaxis: {
        categories: [
          "Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec",
        ],
      },
      yaxis: { labels: { formatter: (val) => `${val}K` } },
      grid: { borderColor: "#e6e6e6" },
    },
  };

  // =============== BAR CHART ===============
  const userChart = {
    series: [{ name: "Users", data: [2000, 4500, 3200, 8000, 9000, 3000, 8500] }],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 5, columnWidth: "40%" } },
      colors: ["#3C82F6"],
      xaxis: { categories: ["S", "M", "T", "W", "T", "F", "S"] },
      grid: { borderColor: "#e6e6e6" },
    },
  };

  // =============== STORAGE RADIAL ===============
  const storageChart = {
    series: [75],
    options: {
      chart: { type: "radialBar", toolbar: { show: false } },
      plotOptions: {
        radialBar: {
          startAngle: -120,
          endAngle: 120,
          hollow: { size: "60%" },
          track: { background: "#e9edf7" },
          dataLabels: {
            name: { show: false },
            value: { fontSize: "32px", color: "#333", offsetY: 10 },
          },
        },
      },
      colors: ["#02f85cff"],
    },
  };

  // =============== SUBSCRIPTION DONUT ===============
  const subscriptionChart = {
    series: [225, 225, 50],
    options: {
      chart: { type: "donut" },
      labels: ["Free Plan", "Base Plan", "Business Plan"],
      colors: ["#D8E6FF", "#3C82F6", "#7EB5FF"],
      legend: { position: "bottom" },
    },
  };

  /* ---------------------------------------------------
        ⭐ SKELETON LOADER UI ⭐
  --------------------------------------------------- */
  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="right-content">
          <Topbar />

          <div className="dashboard-skeleton">
            <div className="sk-line w-30"></div>

            <div className="sk-cards">
              <div className="sk-card"></div>
              <div className="sk-card"></div>
              <div className="sk-card"></div>
              <div className="sk-card"></div>
            </div>

            <div className="sk-charts">
              <div className="sk-chart"></div>
              <div className="sk-chart small"></div>
            </div>

            <div className="sk-charts">
              <div className="sk-chart"></div>
              <div className="sk-chart small"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------
       ⭐ ACTUAL DASHBOARD CONTENT (unchanged)
  --------------------------------------------------- */

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="right-content">
        <Topbar />

        <div className="main-content1">
          <h4 className="section-title">Overview</h4>

          {/* CARDS ROW */}
          <div className="cards-row">

            {/* TOTAL USERS */}
            <div className="card">
              <div className="card-left">
                <div className="card-icon yellow">
                  <i className="ri-group-line"></i>
                </div>
              </div>
              <div className="card-right">
                <p className="title">Total Users</p>
                <h2 className="value">{totalUsers}</h2>
                <span className="percentage green">+12%</span>
              </div>
            </div>

            {/* ACTIVE USERS */}
            <div className="card">
              <div className="card-left">
                <div className="card-icon blue">
                  <i className="ri-team-line"></i>
                </div>
              </div>
              <div className="card-right">
                <p className="title">Active Users</p>
                <h2 className="value">{totalUsers}</h2>
                <span className="percentage green">+35%</span>
              </div>
            </div>

            {/* TOTAL EVENTS */}
            <div className="card">
              <div className="card-left">
                <div className="card-icon pink">
                  <i className="ri-time-line"></i>
                </div>
              </div>
              <div className="card-right">
                <p className="title">Total Events</p>
                <h2 className="value">{totalEvents}</h2>
                <span className="percentage red">-5%</span>
              </div>
            </div>

            {/* PAYMENTS */}
            <div className="card">
              <div className="card-left">
                <div className="card-icon purple">
                  <i className="ri-bank-card-line"></i>
                </div>
              </div>
              <div className="card-right">
                <p className="title">Payments</p>
                <h2 className="value">$956.00</h2>
                <span className="percentage red">-5%</span>
              </div>
            </div>
          </div>

          {/* CHART ROW 1 */}
          <div className="charts-row">
            <div className="chart-box large">
              <h4>
                Overall revenue <span className="green">+20%</span>
              </h4>
              <Chart
                options={revenueChart.options}
                series={revenueChart.series}
                type="line"
                height={300}
              />
            </div>

            <div className="chart-box small">
              <h4>
                User Activity <span className="red">-20%</span>
              </h4>
              <Chart
                options={userChart.options}
                series={userChart.series}
                type="bar"
                height={300}
              />
            </div>
          </div>

          {/* CHART ROW 2 */}
          <div className="charts-row">
            <div className="chart-box large">
              <h4>Storage overview</h4>

              <Chart
                options={storageChart.options}
                series={storageChart.series}
                type="radialBar"
                height={330}
              />

              <div className="storage-legend">
                <span><i className="dot blue-dark"></i> Total storage: 100GB</span>
                <span><i className="dot blue-light"></i> Storage used: 75GB</span>
                <span><i className="dot greeen"></i> Remaining Storage: 25GB</span>
              </div>
            </div>

            <div className="chart-box small">
              <h4>Subscription Overview</h4>
              <Chart
                options={subscriptionChart.options}
                series={subscriptionChart.series}
                type="donut"
                height={300}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
