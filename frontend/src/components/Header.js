import React, { useState, useEffect } from "react";
import "./Header.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  FaTachometerAlt,
  FaBell,
  FaCog,
  FaBars,
  FaTimes,
  FaUser,
  FaHistory,
  FaVideo,
  FaChartBar
} from "react-icons/fa";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user data from Firestore
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (menuOpen) setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Handle detection page navigation or redirect
  const isActivePath = (path) => {
    if (path === "/detection") {
      return location.pathname === "/" || location.pathname === "/detection";
    }
    return location.pathname === path;
  };

  const handleUserClick = () => {
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo + Title */}
        <div className="logo-container" onClick={() => navigate("/detection")} style={{ cursor: "pointer" }}>
          <div className="logo">🚗</div>
          <div className="title-container">
            <h1>NapGuard</h1>
            <p>Real-time monitoring for safer driving</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`nav-items ${menuOpen ? "nav-open" : ""}`}>
          <ul>
                {/* Dashboard Tab (Points to Detection) */}
                <li>
                  <Link
                    to="/detection"
                    className={`nav-item ${
                      isActivePath("/detection") ? "active" : ""
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaVideo className="nav-icon" />
                    <span className="nav-text">Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/statistics"
                    className={`nav-item ${
                      isActivePath("/statistics") ? "active" : ""
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaChartBar className="nav-icon" />
                    <span className="nav-text">Statistics</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/history"
                    className={`nav-item ${
                      isActivePath("/history") ? "active" : ""
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaHistory className="nav-icon" />
                    <span className="nav-text">Detection History</span>
                  </Link>
                </li>
            {user && (
              <>
                <li>
                  <Link
                    to="/settings"
                    className={`nav-item ${
                      isActivePath("/settings") ? "active" : ""
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaCog className="nav-icon" />
                    <span className="nav-text">Settings</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Right side controls */}
        <div className="header-controls">
          {user ? (
            <div className="user-section">
              <div className="user-info-bubble">
                <span className="user-welcome">Hello,</span>
                <span className="user-display-name">{userData?.name || user.email.split('@')[0]}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="login-section" onClick={handleUserClick} title="Click to login">
              <div className="login-icon-circle">
                <FaUser className="user-icon" />
              </div>
              <span className="login-label">Login</span>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="menu-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      <div className="header-wave"></div>
    </header>
  );
}

export default Header;