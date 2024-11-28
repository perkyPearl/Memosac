import React, { useState, useEffect } from "react";
import "../styles/timeCapsule.css";

const TimeCapsulePage = () => {
  const targetDate = new Date().getTime() + 60 * 1000; 

  const [timeRemaining, setTimeRemaining] = useState(targetDate - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeRemaining(0);
      } else {
        setTimeRemaining(distance);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  return (
    <div className="time-capsule-container">
      <div className="time-capsule-header">
        <h1>Your Time Capsules</h1>
      </div>
      <div className="time-capsule-timer">
        <span>{days}d</span>:<span>{hours}h</span>:<span>{minutes}m</span>:<span>{seconds}s</span>
      </div>
    </div>
  );
};

export default TimeCapsulePage;