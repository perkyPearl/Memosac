import React from "react";
import profilePic from "../Images/DefaultUserImg.png";
import "../styles/Profile.css";

const ProfilePage = () => {
    return (
        <div className="profile-container">
            <div className="profile">
                <img src={profilePic} alt="Profile" className="profile-pic" />
                <div className="profile-details">
                    <h2 className="username">Random Guy</h2>
                    <div className="info">
                        <label>Date of Birth:</label>
                        <span>01/01/1990</span>
                    </div>
                    <div className="info">
                        <label>Phone No:</label>
                        <span>+1234567890</span>
                    </div>
                    <div className="info">
                        <label>Email:</label>
                        <span>randomguy@example.com</span>
                    </div>
                    <div className="info">
                        <label>Gender:</label>
                        <span>Male</span>
                    </div>
                    <div className="info">
                        <label>Relationship Status:</label>
                        <span>Single</span>
                    </div>
                    <div className="info">
                        <label>Nationality:</label>
                        <span>American</span>
                    </div>
                    <div className="info">
                        <label>Address:</label>
                        <span>1234 Heirloom Street, Vault City</span>
                    </div>
                    <div className="info">
                        <label>Account Created On:</label>
                        <span>01/11/2024</span>
                    </div>
                    <div className="info bio">
                        <label>Bio:</label>
                        <span>
                            Just a random guy exploring the world and keeping my memories safe in the Digital Heirloom Vault.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;