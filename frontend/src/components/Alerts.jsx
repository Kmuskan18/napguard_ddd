import React, { useState } from "react";
import "./Alerts.css";

const Alerts = () => {
  const [filter, setFilter] = useState("all");
  const [muteAll, setMuteAll] = useState(false);

  const alertsData = [
    {
      id: 1,
      type: "critical",
      title: "Drowsiness Detected!",
      message: "Driver showed signs of drowsiness for 15 seconds. Immediate attention required.",
      time: "2 minutes ago",
      read: false,
      actionRequired: true
    },
    {
      id: 2,
      type: "warning",
      title: "Distraction Alert",
      message: "Driver was distracted for 10 seconds. Please stay focused on the road.",
      time: "15 minutes ago",
      read: true,
      actionRequired: false
    },
    {
      id: 3,
      type: "info",
      title: "System Update",
      message: "New detection algorithms have been installed. System will restart at next stop.",
      time: "1 hour ago",
      read: true,
      actionRequired: false
    },
    {
      id: 4,
      type: "success",
      title: "Drive Completed Safely",
      message: "The journey was completed with 98% alertness score. Well done!",
      time: "3 hours ago",
      read: true,
      actionRequired: false
    },
    {
      id: 5,
      type: "critical",
      title: "Emergency Protocol Activated",
      message: "Vehicle safely pulled over after detecting severe drowsiness patterns.",
      time: "Yesterday",
      read: false,
      actionRequired: true
    }
  ];

  const filteredAlerts = filter === "all" 
    ? alertsData 
    : alertsData.filter(alert => alert.type === filter);

  const unreadCount = alertsData.filter(alert => !alert.read).length;
  const criticalCount = alertsData.filter(alert => alert.type === "critical" && !alert.read).length;

  const markAsRead = (id) => {
    // In a real app, this would update the state or make an API call
    console.log(`Marking alert ${id} as read`);
  };

  const clearAll = () => {
    // In a real app, this would clear all alerts
    console.log("Clearing all alerts");
  };

  return (
    <div className="alerts-page">
      <div className="alerts-header">
        <div className="header-content">
          <h1>Alerts & Notifications</h1>
          <p>Monitor system alerts and driver notifications</p>
        </div>
        <div className="alert-stats">
          <div className="stat-item">
            <span className="stat-count">{unreadCount}</span>
            <span className="stat-label">Unread</span>
          </div>
          <div className="stat-item critical">
            <span className="stat-count">{criticalCount}</span>
            <span className="stat-label">Critical</span>
          </div>
        </div>
      </div>

      <div className="alerts-controls">
        <div className="filter-buttons">
          <button 
            className={filter === "all" ? "active" : ""} 
            onClick={() => setFilter("all")}
          >
            All Alerts
          </button>
          <button 
            className={filter === "critical" ? "active" : ""} 
            onClick={() => setFilter("critical")}
          >
            Critical
          </button>
          <button 
            className={filter === "warning" ? "active" : ""} 
            onClick={() => setFilter("warning")}
          >
            Warnings
          </button>
          <button 
            className={filter === "info" ? "active" : ""} 
            onClick={() => setFilter("info")}
          >
            Info
          </button>
        </div>
        
        <div className="action-buttons">
          <button className="mute-btn" onClick={() => setMuteAll(!muteAll)}>
            {muteAll ? "🔔 Unmute All" : "🔕 Mute All"}
          </button>
          <button className="clear-btn" onClick={clearAll}>
            Clear All
          </button>
        </div>
      </div>

      <div className="alerts-list">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <div 
              key={alert.id} 
              className={`alert ${alert.type} ${alert.read ? "read" : "unread"}`}
            >
              <div className="alert-icon">
                {alert.type === "critical" && "🚨"}
                {alert.type === "warning" && "⚠️"}
                {alert.type === "info" && "ℹ️"}
                {alert.type === "success" && "✅"}
              </div>
              
              <div className="alert-content">
                <div className="alert-header">
                  <h3>{alert.title}</h3>
                  <span className="alert-time">{alert.time}</span>
                </div>
                <p>{alert.message}</p>
                
                {alert.actionRequired && (
                  <div className="action-required">
                    <span>Action Required</span>
                  </div>
                )}
              </div>
              
              <div className="alert-actions">
                {!alert.read && (
                  <button 
                    className="mark-read-btn"
                    onClick={() => markAsRead(alert.id)}
                  >
                    Mark as Read
                  </button>
                )}
                <button className="more-options">⋯</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-alerts">
            <div className="no-alerts-icon">📋</div>
            <h3>No alerts found</h3>
            <p>You're all caught up! No {filter !== "all" ? filter : ""} alerts to display.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;