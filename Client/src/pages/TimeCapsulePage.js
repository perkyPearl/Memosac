import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/timeCapsule.css";

function getTimeRemaining(scheduledDate) {
  const now = new Date();
  const releaseDate = new Date(scheduledDate);
  const timeDiff = releaseDate - now;

  if (timeDiff <= 0) {
    return "Released!!";
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
  const seconds = Math.floor((timeDiff / 1000) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export default function TimeCapsulePage() {
  const [timeCapsules, setTimeCapsules] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/timecapsule", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setTimeCapsules(data))
      .catch((err) => console.error("Error fetching time capsules:", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prevTimeRemaining) => {
        const updatedTimeRemaining = { ...prevTimeRemaining };
        timeCapsules.forEach((capsule) => {
          updatedTimeRemaining[capsule._id] = getTimeRemaining(
            capsule.scheduled_date
          );
        });
        return updatedTimeRemaining;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeCapsules]);

  const handleCardClick = (capsule) => {
    if (timeRemaining[capsule._id] === "Released!!") {
      navigate(`/timecapsule/${capsule._id}`);
    } else {
      toast.error("This time capsule is locked.");
    }
  };

  return (
    <div className="time-capsule-container">
      <ToastContainer />
      <div className="time-capsule-heading">
        <h1>Your Time Capsules:</h1>
      </div>

      {timeCapsules.length === 0 ? (
        <p>No time capsules available</p>
      ) : (
        <div className="capsules-grid">
          {timeCapsules.map((capsule) => (
            <div
              key={capsule._id}
              className="capsule-card"
              onClick={() => handleCardClick(capsule)}
            >
              <div className="capsule-content">
                <h3>{capsule.title || "Untitled Capsule"}</h3>
              </div>
              <div className="time-remaining">
                {timeRemaining[capsule._id]}
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="floating-button" onClick={() => navigate("/create-timecapsule")}>
        +
      </button>
    </div>
  );
}
