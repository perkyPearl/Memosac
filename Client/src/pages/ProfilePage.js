import React, { useState, useEffect, useContext } from "react";
import profilePic from "../assets/profile-pic.png";
import "../styles/Profile.css";
import { UserContext } from "../UserContext";

const API_URL = "http://localhost:4000/api/profile";

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

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/${userInfo.userId}`);
        const data = await response.json();
        setProfile({
          username: data.username || "Chill Guy",
          dob: data.dob || "1990-01-01",
          gender: data.gender || "NA",
          relationshipStatus: data.relationshipStatus || "NA",
          phone: data.phone || "NA",
          email: data.email || "null",
          address: data.address || "null",
          hobbies: data.hobbies || [],
        });
        setProfilePicUrl(data.profilePic || profilePic);
        setSocialLinks(data.socialLinks || {});
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (userInfo) fetchProfile();
  }, [userInfo]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSocialLinksChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks((prevLinks) => ({
      ...prevLinks,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userId", userInfo.id);
    formData.append("username", profile.username);
    formData.append("dob", profile.dob);
    formData.append("gender", profile.gender);
    formData.append("relationshipStatus", profile.relationshipStatus);
    formData.append("phone", profile.phone);
    formData.append("email", profile.email);
    formData.append("address", profile.address);
    formData.append("hobbies", profile.hobbies.join(", "));
    formData.append("facebook", socialLinks.facebook);
    formData.append("twitter", socialLinks.twitter);
    formData.append("instagram", socialLinks.instagram);
    formData.append("linkedin", socialLinks.linkedin);

    try {
      const response = await fetch(`${API_URL}/${userInfo.userId}`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();
      setProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={profilePicUrl} alt="Profile" className="profile-pic" />
        <div className="header-info">
          <h2 className="username">{profile.username}</h2>
          <p className="tagline">"Living life, one memory at a time."</p>
        </div>
        <button onClick={handleEditClick} className="edit-button">Edit</button>
      </div>

      {isEditing ? (
        <form onSubmit={handleFormSubmit} className="profile-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={profile.dob}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Gender:</label>
            <input
              type="text"
              name="gender"
              value={profile.gender}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Relationship Status:</label>
            <input
              type="text"
              name="relationshipStatus"
              value={profile.relationshipStatus}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Hobbies:</label>
            <input
              type="text"
              name="hobbies"
              value={profile.hobbies.join(", ")}
              onChange={(e) =>
                setProfile((prevProfile) => ({
                  ...prevProfile,
                  hobbies: e.target.value.split(", "),
                }))
              }
            />
          </div>
          <div className="form-group">
            <label>Facebook:</label>
            <input
              type="text"
              name="facebook"
              value={socialLinks.facebook}
              onChange={handleSocialLinksChange}
            />
          </div>
          <div className="form-group">
            <label>Twitter:</label>
            <input
              type="text"
              name="twitter"
              value={socialLinks.twitter}
              onChange={handleSocialLinksChange}
            />
          </div>
          <div className="form-group">
            <label>Instagram:</label>
            <input
              type="text"
              name="instagram"
              value={socialLinks.instagram}
              onChange={handleSocialLinksChange}
            />
          </div>
          <div className="form-group">
            <label>LinkedIn:</label>
            <input
              type="text"
              name="linkedin"
              value={socialLinks.linkedin}
              onChange={handleSocialLinksChange}
            />
          </div>
          <button type="submit" className="save-button">Save</button>
        </form>
      ) : (
        <div className="profile-details">
          <div className="section">
            <h3 className="section-title">Personal Information</h3>
            <div className="info">
              <label>Date of Birth:</label>
              <span>{profile.dob || "Not Provided"}</span>
            </div>
            <div className="info">
              <label>Gender:</label>
              <span>{profile.gender || "Not Provided"}</span>
            </div>
            <div className="info">
              <label>Relationship Status:</label>
              <span>{profile.relationshipStatus || "Not Provided"}</span>
            </div>
            <div className="info">
              <label>Phone:</label>
              <span>{profile.phone || "Not Provided"}</span>
            </div>
            <div className="info">
              <label>Email:</label>
              <span>{profile.email || "Not Provided"}</span>
            </div>
            <div className="info">
              <label>Address:</label>
              <span>{profile.address || "Not Provided"}</span>
            </div>
            <div className="info">
              <label>Hobbies:</label>
              <span>{profile.hobbies.length > 0 ? profile.hobbies.join(", ") : "Not Provided"}</span>
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
      )}
    </div>
  );
};

export default ProfilePage;