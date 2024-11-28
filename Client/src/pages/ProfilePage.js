import React, { useState, useEffect, useContext } from "react";
import profilePic from "../assets/profile-pic.png";
import "../styles/Profile.css";
import { UserContext } from "../UserContext";

const API_URL = "http://localhost:4000/user/profile";

const ProfilePage = () => {
  const { userInfo } = useContext(UserContext);

  const [profile, setProfile] = useState({
    username: "Chill Guy",
    dob: "1990-01-01",
    gender: "NA",
    relationshipStatus: "NA",
    phone: "NA",
    email: "null",
    address: "null",
    hobbies: [],
  });

  const [profilePicUrl, setProfilePicUrl] = useState(profilePic);
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: userInfo }),
        });

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setProfile({
          username: data.username || "Chill Guy",
          email: data.email || "null",
        });
        setProfilePicUrl(data.profilePic || profilePic);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (userInfo) fetchProfile();
  }, [userInfo]);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={profilePicUrl} alt="Profile" className="profile-pic" />
        <div className="header-info">
          <h2 className="username">{profile.username}</h2>
          <p className="tagline">"Living life, one memory at a time."</p>
        </div>
      </div>

      <div className="profile-details">
        <div className="section">
          <h3 className="section-title">Personal Information</h3>
          <div className="info">
            <label>Email:</label>
            <span>{profile.email}</span>
          </div>
        </div>

        <div className="section">
          <h3 className="section-title">Social Links</h3>
          <div>
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;