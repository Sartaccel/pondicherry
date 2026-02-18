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

  // =============== STORAGE SEMI-CIRCLE ===============
  const storageChart = {
    series: [75, 25],
    options: {
      chart: { type: "donut" },
      labels: [ "Storage used", "Remaining Storage"],
      colors: ["#3294e4", "#0bbd2c"],
      stroke: { width: 0, colors: ["#1a237e"] },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          offsetY: 10,
          donut: {
            size: "80%",
            labels: {
              show: false
            }
          }
        }
      },
      dataLabels: { enabled: false },
      legend: { show: false },
      states: {
        hover: { filter: { type: "none" } },
        active: { filter: { type: "none" } }
      }
    },
  };

  // =============== STORAGE GAUGE VARIABLES ===============
  const stroke = 14;
  const circumference = Math.PI * 90; // ≈ 282.74
  const usedLength = (75 / 100) * circumference;
  const remainLength = (25 / 100) * circumference;

  // =============== SUBSCRIPTION DONUT ===============
  const subscriptionChart = {
    series: [225, 225, 50],
    options: {
      chart: { type: "donut" },
      labels: ["Free Plan", "Base Plan", "Business Plan"],
      colors: ["#47C47A", "#64B5F6", "#1B1464"],
      stroke: { width: 1, colors: ["#ffffff"] },
      plotOptions: {
        pie: {
          donut: {
            size: "70%",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "14px",
                color: "#217dff",
                offsetY: -10
              },
              value: {
                show: true,
                fontSize: "42px",
                fontWeight: 700,
                color: "#000000",
                offsetY: 10,
                
              },
              total: {
                show: true,
                label: "Total",
                fontSize: "14px",
                color: "#888",
                formatter: function () { return "500"; }
              }
            }
          }
        }
      },
      dataLabels: { enabled: false },
      legend: { show: false }
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
            <div className="chart-box large storage-card">
              <h4>Storage overview</h4>

              <div className="gauge">
                <svg viewBox="15 25 210 115">
                  {/* dotted ticks */}
                  <path
                    d="M30 130 A90 90 0 0 1 210 130"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                    strokeDasharray="2 9"
                    fill="none"
                  />

                  {/* used arc */}
                  <path
                    d="M30 130 A90 90 0 0 1 210 130"
                    stroke="#1B1464"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${usedLength} ${circumference}`}
                  />

                  {/* remaining arc */}
                  <path
                    d="M30 130 A90 90 0 0 1 210 130"
                    stroke="#47C47A"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${remainLength} ${circumference}`}
                    strokeDashoffset={-usedLength}
                  />
                </svg>

                {/* center text */}
                <div className="center">
                  <h1>75GB</h1>
                  <p>current storage status</p>
                </div>
              </div>

              {/* legend */}
              <div className="legend">
                <span><i className="dot total"></i>Total storage : 100GB</span>
                <span><i className="dot used"></i>Storage used : 75GB</span>
                <span><i className="dot remain"></i>Remaining : 25GB</span>
              </div>
            </div>

            <div className="chart-box small">
              <h4>Subscription Overview</h4>
              <Chart
                options={subscriptionChart.options}
                series={subscriptionChart.series}
                type="donut"
                height={240}
              />

              <div className="subscription-legend">
                <span><i className="dot sub-free"></i> Free Plan: 225</span>
                <span><i className="dot sub-base"></i> Base Plan: 225</span>
                <span><i className="dot sub-business"></i> Business Plan: 50</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
