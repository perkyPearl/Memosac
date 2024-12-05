import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TimeCapsuleDetail = () => {
  const { id } = useParams();
  const [timeCapsule, setTimeCapsule] = useState(null);

  // Function to calculate the remaining time
  const getTimeRemaining = (scheduledDate) => {
    const now = new Date();
    const releaseDate = new Date(scheduledDate);
    const timeDifference = releaseDate - now;

    if (timeDifference <= 0) {
      return 'Released!';
    }

    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  };

  useEffect(() => {
    fetch(`http://localhost:4000/timecapsule/${id}`)
      .then((response) => response.json())
      .then((data) => setTimeCapsule(data))
      .catch((error) => console.error('Error fetching time capsule details:', error));
  }, [id]);

  if (!timeCapsule) {
    return <p>Loading...</p>;
  }

  return (
    <div className='time-capsule-container'>
      <h2>Time Capsule Details</h2>
      <div className="capsule-detail">
        <h3>{timeCapsule.title || 'Untitled Capsule'}</h3>
        <p>Status: {timeCapsule.status}</p>
        <p>Release Date: {new Date(timeCapsule.scheduled_date).toLocaleString()}</p>
        <p className="time-remaining">
          {getTimeRemaining(timeCapsule.scheduled_date)}
        </p>
        {timeCapsule.status === 'unlocked' && (
          <div>
            <p>Content: {timeCapsule.content || 'No content available'}</p>
            {timeCapsule.files.length > 0 && (
              <div>
                <h4>Files:</h4>
                {timeCapsule.files.map((file, index) => (
                  <a key={index} href={file} target="_blank" rel="noopener noreferrer">
                    File {index + 1}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
        {timeCapsule.status !== 'unlocked' && (
          <p>The time capsule is locked. It will be unlocked at {new Date(timeCapsule.scheduled_date).toLocaleString()}.</p>
        )}
      </div>
    </div>
  );
};

export default TimeCapsuleDetail;