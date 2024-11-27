import { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function TimeCapsuleCreator() {
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const timeCapsuleData = {
      content,
      scheduled_date: scheduledDate,
    };

    const response = await fetch('http://localhost:4000/time-capsules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(timeCapsuleData),
    });

    if (response.ok) {
      alert("Time Capsule Created!");
      history.push("/time-capsules");
    } else {
      alert("Error creating time capsule.");
    }
  };

  return (
    <div className="time-capsule-creator">
      <h2>Create Time Capsule</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your message or content"
          required
        />
        <input
          type="datetime-local"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          required
        />
        <button type="submit">Create Time Capsule</button>
      </form>
    </div>
  );
}