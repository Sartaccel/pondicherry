import React, { useEffect, useState, useRef } from "react";

import Sidebar from "../Login/Sidebar/Sidebar";
import Topbar from "../Login/Topbar/Topbar";
import "./EventManagement.css";
import axios from "axios";

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("ACTIVE");

  // ✅ DATE & TIME FILTER STATES
  const [filterDate, setFilterDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const dateInputRef = useRef(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);



  const pageSize = 10;


  

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ Reset page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, status, filterDate, startTime, endTime]);

  const fetchEvents = async (searchValue = "") => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8080/api/admin/events",
        {
          params: {
            search: searchValue,
          },
        }
      );
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAMPM = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${minutes} ${ampm}`;
  };

  // ✅ FRONTEND FILTERING (DATE + TIME RANGE + STATUS)
  const filteredEvents = events.filter((event) => {
    // Status filter
    if (status && event.status !== status) return false;

    // Date filter
    if (filterDate && event.eventDate !== filterDate) return false;

    // Time range filter (within selected date)
    if (startTime || endTime) {
      const eventTime = event.startTime; // HH:mm

      if (startTime && eventTime < startTime) return false;
      if (endTime && eventTime > endTime) return false;
    }

    return true;
  });

  // ✅ Pagination
  const totalPages = Math.ceil(filteredEvents.length / pageSize);

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <div className="page-content">
          {/* HEADER */}
          <div className="event-header">
            <h2>Event Management</h2>
            <p>Manage list and View Admin</p>
          </div>

          {/* FILTERS */}
          <div className="event-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by Event Name"
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  fetchEvents(value);
                }}
              />
              <i className="ri-search-line"></i>
            </div>

            <div className="filter-actions">
              <button className="filter-btn">
                <i className="ri-filter-3-line"></i>
                <span>Filter By</span>
              </button>

      <div className="filter-field">
  <i
    className="ri-calendar-line"
    style={{ cursor: "pointer" }}
    onClick={() => {
      if (dateInputRef.current?.showPicker) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }}
  ></i>

  <input
    ref={dateInputRef}
    type="date"
    value={filterDate}
    onChange={(e) => setFilterDate(e.target.value)}
  />
</div>




              {/* ⏰ START TIME */}
             <div className="filter-field">
  <i
    className="ri-time-line"
    style={{ cursor: "pointer" }}
    onClick={() => {
      if (startTimeRef.current?.showPicker) {
        startTimeRef.current.showPicker();
      } else {
        startTimeRef.current.focus();
      }
    }}
  ></i>

  <input
    ref={startTimeRef}
    type="time"
    value={startTime}
    onChange={(e) => setStartTime(e.target.value)}
  />
</div>


              <div className="filter-field">
  <i
    className="ri-time-line"
    style={{ cursor: "pointer" }}
    onClick={() => {
      if (endTimeRef.current?.showPicker) {
        endTimeRef.current.showPicker();
      } else {
        endTimeRef.current.focus();
      }
    }}
  ></i>

  <input
    ref={endTimeRef}
    type="time"
    value={endTime}
    onChange={(e) => setEndTime(e.target.value)}
  />
</div>


              {/* STATUS */}
              <div className="filter-field">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="UPCOMING">Upcoming</option>
                </select>
                <i className="ri-arrow-down-s-line arrow"></i>
              </div>

              {/* RESET */}
              <button
                className="reset-btn"
                onClick={() => {
                  setSearch("");
                 setStatus("ACTIVE");
                  setFilterDate("");
                  setStartTime("");
                  setEndTime("");
                  fetchEvents("");
                }}
              >
                <i className="ri-refresh-line"></i>
                Reset Filter
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="event-table">
            <table>
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                   <th>Created By</th>
                    <th>Joined Users</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {paginatedEvents.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No events found
                    </td>
                  </tr>
                ) : (
                  paginatedEvents.map((event) => (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>{event.description}</td>
                      <td>{event.eventDate}</td>
                      <td>{formatTimeAMPM(event.startTime)}</td>
                      <td>{formatTimeAMPM(event.endTime)}</td>
                      <td>{event.creatorName || "-"}</td>
                       <td>
          {event.joinedUsers && event.joinedUsers.length > 0 ? (
            event.joinedUsers.map((user, index) => (
              <span key={index}>
                {user.name}
                {index < event.joinedUsers.length - 1 ? ", " : ""}
              </span>
            ))
          ) : (
            " "
          )}
        </td>
                      
                      <td>
                        <span
                          className={`status ${event.status?.toLowerCase()}`}
                        >
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="table-footer">
            <span>
              Showing {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filteredEvents.length)} of{" "}
              {filteredEvents.length}
            </span>

            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                 ◀
              </button>

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                  ▶
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManagement;
