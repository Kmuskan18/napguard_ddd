import React, { useState } from "react";
import "./Settings.css";

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    emailNotifications: true,
    drowsinessSensitivity: 70,
    alarmVolume: 80,
    enableVoiceAlerts: true,
    enableVibration: true,
    autoSaveReports: false,
    detectionFrequency: 30,
    enableGPSLogging: false,
    emergencyContact: "",
    sleepDetection: true,
    distractionDetection: false,
    enableCamera: true,
    alertDuration: 10,
    enableAutoStart: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSave = () => {
    // Here you would typically send the settings to your backend
    alert("Settings saved successfully!");
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all settings to default?")) {
      setSettings({
        darkMode: false,
        emailNotifications: true,
        drowsinessSensitivity: 70,
        alarmVolume: 80,
        enableVoiceAlerts: true,
        enableVibration: true,
        autoSaveReports: false,
        detectionFrequency: 30,
        enableGPSLogging: false,
        emergencyContact: "",
        sleepDetection: true,
        distractionDetection: false,
        enableCamera: true,
        alertDuration: 10,
        enableAutoStart: false
      });
      alert("Settings reset to default values.");
    }
  };

  return (
    <div className={`settings-page ${settings.darkMode ? "dark-mode" : ""}`}>
      <div className="settings-header">
        <h2>Driver Drowsiness Detection Settings</h2>
        <p>Configure your driver safety monitoring preferences</p>
      </div>

      <div className="settings-grid">
        {/* Detection Settings Card */}
        <div className="settings-card">
          <h3>Detection Settings</h3>
          
          <div className="setting-option">
            <label>
              Drowsiness Sensitivity
              <span className="value-display">{settings.drowsinessSensitivity}%</span>
            </label>
            <input
              type="range"
              name="drowsinessSensitivity"
              min="0"
              max="100"
              value={settings.drowsinessSensitivity}
              onChange={handleChange}
            />
            <div className="hint">How sensitive the system is to detecting drowsiness</div>
          </div>

          <div className="setting-option">
            <label>
              Detection Frequency
              <span className="value-display">{settings.detectionFrequency} seconds</span>
            </label>
            <input
              type="range"
              name="detectionFrequency"
              min="5"
              max="60"
              step="5"
              value={settings.detectionFrequency}
              onChange={handleChange}
            />
            <div className="hint">How often the system checks for drowsiness</div>
          </div>

          <div className="setting-option">
            <label>
              <input
                type="checkbox"
                name="sleepDetection"
                checked={settings.sleepDetection}
                onChange={handleChange}
              />
              Enable Sleep Detection
            </label>
          </div>

          <div className="setting-option">
            <label>
              <input
                type="checkbox"
                name="distractionDetection"
                checked={settings.distractionDetection}
                onChange={handleChange}
              />
              Enable Distraction Detection
            </label>
          </div>
        </div>

        {/* Alert Settings Card */}
        <div className="settings-card">
          <h3>Alert Settings</h3>
          
          <div className="setting-option">
            <label>
              Alarm Volume
              <span className="value-display">{settings.alarmVolume}%</span>
            </label>
            <input
              type="range"
              name="alarmVolume"
              min="0"
              max="100"
              value={settings.alarmVolume}
              onChange={handleChange}
            />
          </div>

          <div className="setting-option">
            <label>
              Alert Duration
              <span className="value-display">{settings.alertDuration} seconds</span>
            </label>
            <input
              type="range"
              name="alertDuration"
              min="5"
              max="30"
              step="5"
              value={settings.alertDuration}
              onChange={handleChange}
            />
            <div className="hint">How long alerts remain active</div>
          </div>

          <div className="setting-option">
            <label>
              <input
                type="checkbox"
                name="enableVoiceAlerts"
                checked={settings.enableVoiceAlerts}
                onChange={handleChange}
              />
              Enable Voice Alerts
            </label>
          </div>

          <div className="setting-option">
            <label>
              <input
                type="checkbox"
                name="enableVibration"
                checked={settings.enableVibration}
                onChange={handleChange}
              />
              Enable Vibration Alerts
            </label>
          </div>
        </div>

        {/* Notification Settings Card */}
        <div className="settings-card">
          <h3>Notification Settings</h3>
          
          <div className="setting-option">
            <label>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
              />
              Email Notifications
            </label>
          </div>

          <div className="setting-option">
            <label>
              Emergency Contact
              <input
                type="text"
                name="emergencyContact"
                placeholder="Enter phone number"
                value={settings.emergencyContact}
                onChange={handleChange}
              />
            </label>
            <div className="hint">Contact to notify in case of severe drowsiness</div>
          </div>
        </div>

        {/* System Settings Card */}
        <div className="settings-card">
          <h3>System Settings</h3>
          
          <div className="setting-option">
            <label>
              <input
                type="checkbox"
                name="darkMode"
                checked={settings.darkMode}
                onChange={handleChange}
              />
              Enable Dark Mode
            </label>
          </div>

          <div className="setting-option">
            <label>
              <input
                type="checkbox"
                name="autoSaveReports"
                checked={settings.autoSaveReports}
                onChange={handleChange}
              />
              Auto-save Detection Reports
            </label>
          </div>

          <div className="setting-option">
            <label>
              <input
                type="checkbox"
                name="enableGPSLogging"
                checked={settings.enableGPSLogging}
                onChange={handleChange}
              />
              Enable GPS Logging
            </label>
            <div className="hint">Record location data during alerts</div>
          </div>

          <div className="setting-option">
            <label>
              <input
                type="checkbox"
                name="enableCamera"
                checked={settings.enableCamera}
                onChange={handleChange}
              />
              Enable Camera
            </label>
            <div className="hint">Allow system to access camera for detection</div>
          </div>

          <div className="setting-option">
            <label>
              <input
                type="checkbox"
                name="enableAutoStart"
                checked={settings.enableAutoStart}
                onChange={handleChange}
              />
              Auto-start on Device Boot
            </label>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="save-btn" onClick={handleSave}>Save Changes</button>
        <button className="reset-btn" onClick={handleReset}>Reset to Default</button>
      </div>
    </div>
  );
};

export default Settings;