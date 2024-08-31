import React from 'react';
import "./LandingPage.css"

const LandingPage = () => {
    return (
        <div>
            <section className="hero">
                <div className="hero-content">
                    <h1>Preserve Your Legacy</h1>
                    <p>Store, organize, and share your most cherished memories and digital heirlooms for future generations.</p>
                    <div className="hero-buttons">
                        <button>Get Started</button>
                        <button>Learn More</button>
                    </div>
                </div>
            </section>

            <section className="features">
                <h2>Why Choose Digital Heirloom Vault?</h2>
                <div className="feature">
                    <h3>Secure Storage</h3>
                    <p>Your digital heirlooms are encrypted and safely stored.</p>
                </div>
                <div className="feature">
                    <h3>Organize Memories</h3>
                    <p>Easily categorize and tag your photos, videos, letters, and more.</p>
                </div>
                <div className="feature">
                    <h3>Share with Loved Ones</h3>
                    <p>Invite family and friends to access selected memories and stories.</p>
                </div>
            </section>

            <section className="how-it-works">
                <h2>How It Works</h2>
                <div className="step">
                    <h3>Sign Up</h3>
                    <p>Create a free account to get started.</p>
                </div>
                <div className="step">
                    <h3>Upload Heirlooms</h3>
                    <p>Store photos, videos, and more in a secure digital vault.</p>
                </div>
                <div className="step">
                    <h3>Organize & Tag</h3>
                    <p>Use categories and tags to keep everything organized.</p>
                </div>
                <div className="step">
                    <h3>Share</h3>
                    <p>Select specific heirlooms to share with family and friends.</p>
                </div>
            </section>

            <section className="testimonials">
                <h2>What People Are Saying</h2>
                <div className="testimonial">
                    <p>"Digital Heirloom Vault made it easy to organize my grandmother’s letters and share them with our family."</p>
                    <p>- Sarah T.</p>
                </div>
            </section>

            <section className="cta">
                <h2>Start Preserving Your Memories Today</h2>
                <button>Create Your Vault</button>
            </section>

            <footer className="footer">
                <p>&copy; 2024 Digital Heirloom Vault. All rights reserved.</p>
                <div className="footer-links">
                    <a href="#about">About Us</a>
                    <a href="#privacy">Privacy Policy</a>
                    <a href="#contact">Contact Us</a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;