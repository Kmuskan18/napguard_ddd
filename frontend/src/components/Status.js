import React, { useState, useEffect } from "react";
import "./Status.css";

function Status({ drowsy, alertMsg }) {
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState({
    duration: "0:00",
    severity: "Low",
    confidence: "92%"
  });

  // Simulate updating stats when status changes
  useEffect(() => {
    if (drowsy) {
      setStats({
        duration: "0:45",
        severity: drowsy ? "High" : "Low",
        confidence: `${Math.floor(Math.random() * 10) + 85}%`
      });
    }
  }, [drowsy, alertMsg]);

  return (
    <div className={`status-container ${drowsy ? "danger" : "safe"}`}>
      <div className="status-header">
        <div className="status-icon">
          {drowsy ? (
            <div className="icon-danger">⚠️</div>
          ) : (
            <div className="icon-safe">✅</div>
          )}
        </div>
        <div className="status-message">
          <h3>{alertMsg}</h3>
          <p>{drowsy ? "Immediate attention required!" : "All systems normal"}</p>
        </div>
        <button 
          className="details-toggle"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {showDetails && (
        <div className="status-details">
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-label">Status Duration</span>
              <span className="stat-value">{stats.duration}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Severity Level</span>
              <span className="stat-value">{stats.severity}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Confidence</span>
              <span className="stat-value">{stats.confidence}</span>
            </div>
          </div>
          
          <div className="recommendations">
            <h4>Recommendations:</h4>
            {drowsy ? (
              <ul>
                <li>Take immediate break</li>
                <li>Pull over safely if driving</li>
                <li>Consume caffeine if appropriate</li>
                <li>Get fresh air</li>
              </ul>
            ) : (
              <ul>
                <li>Continue regular monitoring</li>
                <li>Stay hydrated</li>
                <li>Take breaks every 2 hours</li>
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="status-footer">
        <div className="status-indicator">
          <div className={`pulse ${drowsy ? "pulse-danger" : "pulse-safe"}`}></div>
          <span>Live Monitoring Active</span>
        </div>
        <div className="last-updated">Last updated: Just now</div>
      </div>
    </div>
  );
}

export default Status;