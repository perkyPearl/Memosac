import React from "react";
import "../styles/Homepage.css";

const Homepage = () => {
  
  return (
    <div className="homepage">
      <h1>Welcome to the platform!</h1>

      <p className="welcome-message">
        Check out these sections of the platform:
      </p>

      <div className="box-container">
        <a href="/posts" className="box box-post">
          Post
        </a>
        <a href="/timecapsule" className="box box-timecapsule">
          Time Capsule
        </a>
        <a href="/gallery" className="box box-gallery">
          Gallery
        </a>
        <a href="/recipes" className="box box-recipe">
          Recipe
        </a>
      </div>
    </div>
  );
};

export default Homepage;
