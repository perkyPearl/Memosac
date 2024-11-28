import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function TimeCapsule() {
  const { id } = useParams();
  const [timeCapsule, setTimeCapsule] = useState(null);

  useEffect(() => {
    const fetchTimeCapsule = async () => {
      const response = await fetch(`/time-capsules/${id}`);
      const data = await response.json();
      setTimeCapsule(data);
    };

    fetchTimeCapsule();
  }, [id]);

  return (
    <div>
      {timeCapsule ? (
        timeCapsule.status === 'unlocked' ? (
          <div>
            <h2>Your Time Capsule</h2>
            <p>{timeCapsule.content}</p>
          </div>
        ) : (
          <div>
            <h2>Time Capsule Locked</h2>
            <p>{timeCapsule.message}</p>
          </div>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}