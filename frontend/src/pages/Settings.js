import React from "react";
import "./Settings.css";

function Settings() {
  return (
    <div className="settings-container">
      <h2>App Settings</h2>
      <div className="settings-card">
        <h3>Detection Preferences</h3>
        <div className="setting-item">
          <span>Sensitivity Threshold</span>
          <input type="range" min="0" max="1" step="0.01" defaultValue="0.21" />
        </div>
        <div className="setting-item">
          <span>Alarm Sound</span>
          <select>
            <option>Default Buzzer</option>
            <option>Gentle Alert</option>
            <option>Loud Warning</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Settings;
