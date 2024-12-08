import React, { useState, useEffect } from "react";
import "../styles/Homepage.css";

const Homepage = () => {
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDailyQuote = async () => {
      const today = new Date().toDateString();
      const savedQuote = JSON.parse(localStorage.getItem("dailyQuote"));

      if (savedQuote && savedQuote.date === today) {
        setQuote(savedQuote.quote);
      } else {
        try {
          const response = await fetch("https://api.quotable.io/quotes/random");
          if (!response.ok) {
            throw new Error("Failed to fetch the quote");
          }
          const [data] = await response.json();
          const newQuote = { content: data.content, author: data.author };
          setQuote(newQuote);
          localStorage.setItem(
            "dailyQuote",
            JSON.stringify({ date: today, quote: newQuote })
          );
        } catch (err) {
          setError(err.message);
        }
      }
    };

    fetchDailyQuote();
  }, []);

  return (
    <div className="home-flex">
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
      <div className="quote-section">
        <h2>Daily Inspiration</h2>
        {error ? (
          <p className="error">{error}</p>
        ) : quote ? (
          <blockquote className="quote">
            <p>"{quote.content}"</p>
            <footer>- {quote.author}</footer>
          </blockquote>
        ) : (
          <p>Loading quote...</p>
        )}
      </div>
    </div>
  );
};

export default Homepage;
