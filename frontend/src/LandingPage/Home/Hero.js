import React from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { useAuth } from "../../AuthjsContext";
import { useNavigate } from "react-router-dom";


function Hero() {
  
  const navigate = useNavigate();
  const { user } = useAuth();

  const backendUrl = "https://findbuddy-back.onrender.com" || "http://localhost:3001";
  const dashboardUrl = "https://findbuddy-dash.onrender.com" || "http://localhost:3002";
  const frontendUrl = "https://findbuddy-lsdc.onrender.com" || "http:localhost:3000";

  const start = async () => {
    if (!user) {
      toast.info("Please Login first");
      navigate("/login");
      return; // Stop execution if not logged in
    }

    try {
      const token = localStorage.getItem('token');

      // 1. Verify user with backend (Port 3001)
      const res = await axios.get(`${backendUrl}/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const hasCompletedProfile = res.data.hasCompleteProfile; // Ensure this matches your Schema key

      // 2. Redirect with Token Hand-off
      // We use window.location.href to jump ports
      if (!hasCompletedProfile) {
        window.location.href = `${dashboardUrl}/complete-profile?token=${token}`;
      } else {
        window.location.href = `${dashboardUrl}/?token=${token}`;
      }

    } catch (err) {
      console.error("Auth error:", err);
      // If the token on 3000 is actually bad, clear it and log in again
      localStorage.removeItem('token');
      window.location.href = `${frontendUrl}/login`;
    }
  };

  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-content">
          <h2>Transform Your Body, Transform Your Life</h2>
          <p>Join the most advanced fitness community with state-of-the-art equipment, expert trainers, and results-driven programs designed for every fitness level.</p>
          <div className="hero-buttons">
            <button onClick={start} className="cta-button" style={{ backgroundColor: "#ff3d00", color: "white", borderRadius: "10rem", border: "none", height: "3rem", width: "11rem" }}>Start Free Trial <i className="fas fa-play-circle"></i></button>
            <Button className="secondary-button" style={{ backgroundColor: "white", color: "black", height: "3rem", width: "13rem", brder: "none", borderRadius: "25px" }} onClick={() => { navigate("/membership") }}>View Membership Plans</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;