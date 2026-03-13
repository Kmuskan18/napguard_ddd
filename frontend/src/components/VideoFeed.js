import React, { useState, useEffect, useRef } from "react";
import "./VideoFeed.css";
import io from "socket.io-client";
import { auth, db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function VideoFeed({ setDrowsy, setAlertMsg }) {
  const [isDetectionActive, setIsDetectionActive] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState("normal");
  const [performanceMetrics, setPerformanceMetrics] = useState({ fps: 0, latency: 0 });
  const [showOverlay, setShowOverlay] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const alarmRef = useRef(null);
  const lastDrowsyTime = useRef(0);

  const drowsyCounter = useRef(0);

  // Initialize Socket.IO
  useEffect(() => {
    socketRef.current = io("http://127.0.0.1:5000");

    socketRef.current.on("connect", () => {
      console.log("Connected to backend socket");
    });

    socketRef.current.on("response", (data) => {
      if (data.error) {
        console.error("Backend error:", data.error);
        return;
      }

      setFaceDetected(data.face_detected);
      
      if (!data.face_detected) {
        setDetectionStatus("inactive");
        setAlertMsg("Waiting for Face...");
        drowsyCounter.current = 0;
        setDrowsy(false);
      } else if (data.drowsy) {
        drowsyCounter.current += 1;
        // Require 3 consecutive frames (~600ms) to trigger alert
        if (drowsyCounter.current >= 3) {
          setDetectionStatus("critical");
          setAlertMsg(`🚨 DROWSY! [${data.reasons.join(", ")}]`);
          setDrowsy(true);
          handleDrowsyDetection(data);
        }
      } else {
        drowsyCounter.current = 0;
        setDetectionStatus("normal");
        setAlertMsg("✅ Driver Alert & Focused");
        setDrowsy(false);
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [setDrowsy, setAlertMsg]);

  // Handle Drowsy Detection (Alarm + Firestore)
  const handleDrowsyDetection = async (data) => {
    // Play sound
    if (alarmRef.current) {
      alarmRef.current.play().catch(e => console.error("Audio play error:", e));
    }

    // Save to Firestore every 10 seconds to avoid spamming
    const now = Date.now();
    if (now - lastDrowsyTime.current > 10000 && auth.currentUser) {
      lastDrowsyTime.current = now;
      try {
        await addDoc(collection(db, "detections"), {
          userId: auth.currentUser.uid,
          timestamp: serverTimestamp(),
          status: "drowsy",
          reasons: data.reasons,
          ear: data.ear,
          mar: data.mar
        });
        console.log("Detection saved to Firestore");
      } catch (e) {
        console.error("Error saving detection:", e);
      }
    }
  };

  // Start/Stop Camera
  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    if (isDetectionActive) {
      startCamera();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    }

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [isDetectionActive]);

  // Frame Capture Loop
  useEffect(() => {
    let intervalId;

    if (isDetectionActive && socketRef.current) {
      intervalId = setInterval(() => {
        if (videoRef.current && canvasRef.current) {
          const context = canvasRef.current.getContext("2d");
          context.drawImage(videoRef.current, 0, 0, 640, 480);
          const imageData = canvasRef.current.toDataURL("image/jpeg", 0.5);
          socketRef.current.emit("image", imageData);
        }
      }, 200); // 5 FPS
    }

    return () => clearInterval(intervalId);
  }, [isDetectionActive]);

  return (
    <div className="video-monitor">
      <audio ref={alarmRef} src="/alarm.mp3" preload="auto" />
      <div className="monitor-header">
        <h3>Live Driver Monitoring</h3>
        <div className="header-controls">
          <button 
            className={`detection-btn ${isDetectionActive ? 'active' : ''}`}
            onClick={() => setIsDetectionActive(!isDetectionActive)}
          >
            <span className="detection-indicator"></span>
            {isDetectionActive ? 'Stop Detection' : 'Start Detection'}
          </button>
          <button className="overlay-btn" onClick={() => setShowOverlay(!showOverlay)}>
            {showOverlay ? 'Hide Overlay' : 'Show Overlay'}
          </button>
        </div>
      </div>
      
      <div className="video-container">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="video-feed"
          style={{ transform: "scaleX(-1)" }} // Mirror effect
        />
        <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />
        
        {showOverlay && (
          <div className="video-overlay">
            <div className="overlay-top">
              <div className={`status-indicator ${detectionStatus} ${!isDetectionActive ? 'inactive' : ''}`}>
                {!isDetectionActive && "🔴 System Inactive"}
                {isDetectionActive && !faceDetected && "🟠 Searching for Face..."}
                {isDetectionActive && faceDetected && detectionStatus === "normal" && "✅ Driver Alert"}
                {isDetectionActive && faceDetected && detectionStatus === "critical" && "🚨 Drowsiness Detected!"}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="video-controls">
        <div className="system-status">
          <div className={`detection-status ${isDetectionActive ? 'active' : 'inactive'}`}>
            <span className="status-dot"></span>
            Detection: {isDetectionActive ? 'ACTIVE' : 'INACTIVE'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoFeed;