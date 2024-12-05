import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Import useNavigate
import "../styles/timeCapsule.css";

const TimeCapsulesList = () => {
  const [timeCapsules, setTimeCapsules] = useState([]);
  const navigate = useNavigate();  // Initialize navigate

  // Function to calculate the remaining time
  const getTimeRemaining = (scheduledDate) => {
    const now = new Date();
    const releaseDate = new Date(scheduledDate);
    const timeDifference = releaseDate - now;

    if (timeDifference <= 0) {
      return 'Released!';
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m remaining`;
  };

  useEffect(() => {
    fetch('http://localhost:4000/timecapsule')
      .then((response) => response.json())
      .then((data) => {setTimeCapsules(data)
        console.log(data)
      })
      .catch((error) => console.error('Error fetching time capsules:', error));
  }, []);

  return (
    <div className='time-capsule-container'>
      <h1>Your Time Capsules</h1>

      {/* Button to route to create-timecapsule page */}
      <button onClick={() => navigate('/create-timecapsule')}>
        Create a Time Capsule
      </button>

      {timeCapsules.length === 0 ? (
        <p>No time capsules available</p>
      ) : (
        <div className="">
          {timeCapsules.map((capsule) => (
            <div key={capsule._id} className={`capsule-card ${capsule.status}`} style={{ width: '100%' }}>
              <h3>{capsule.title || 'Untitled Capsule'}</h3>
              <p>Status: {capsule.status}</p>
              <p>Release Date: {new Date(capsule.scheduled_date).toLocaleString()}</p>
              <p className="time-remaining">
                {getTimeRemaining(capsule.scheduled_date)}
              </p>
              {capsule.status === 'unlocked' && (
                <div>
                  <p>Content: {capsule.content || 'No content available'}</p>
                  {capsule.files.length > 0 && (
                    <div>
                      <h4>Files:</h4>
                      {capsule.files.map((file, index) => (
                        <a key={index} href={file} target="_blank" rel="noopener noreferrer">
                          File {index + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <Link to={`/timecapsule/${capsule._id}`}>View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeCapsulesList;