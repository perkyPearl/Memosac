import React, { useState } from 'react';
import "../styles/timeCapsule.css"

const TimeCapsule = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [releaseDate, setReleaseDate] = useState('');
  const [releaseTime, setReleaseTime] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setUploadProgress({});
    setUploadStatus('');
  };

  const handleReleaseDateChange = (event) => {
    setReleaseDate(event.target.value);
  };

  const handleReleaseTimeChange = (event) => {
    setReleaseTime(event.target.value);
  };

  const handleFileUpload = () => {
    if (!releaseDate || !releaseTime) {
      alert('Please select both a release date and time!');
      return;
    }

    const fullReleaseDateTime = `${releaseDate} ${releaseTime}`;

    setUploadStatus('Uploading...');
    const uploadPromises = files.map((file) => uploadFile(file, fullReleaseDateTime));

    Promise.all(uploadPromises).then(() => {
      setUploadStatus('Upload complete! Time Capsule will open on ' + fullReleaseDateTime);
    });
  };

  const uploadFile = (file, releaseDateTime) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('releaseDateTime', releaseDateTime);

    return fetch('http://localhost:4000/timecapsules', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setUploadProgress((prevProgress) => ({
          ...prevProgress,
          [file.name]: 100,
        }));
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        setUploadProgress((prevProgress) => ({
          ...prevProgress,
          [file.name]: 'Error',
        }));
      });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  return (
    <div className="time-capsule-container">
      <h1>Time Capsule</h1>

      <div className="release-date-time">
        <label>Set Release Date: </label>
        <input type="date" value={releaseDate} onChange={handleReleaseDateChange} />

        <label>Set Release Time: </label>
        <input type="time" value={releaseTime} onChange={handleReleaseTimeChange} />
      </div>

      <div
        className={`file-upload ${dragActive ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="fileInput"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div className="upload-box" onClick={() => document.getElementById('fileInput').click()}>
          <p>
            Drop your files here or <span style={{ cursor: 'pointer' }}>browse</span>
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          <h3>Files Selected:</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name} - {uploadProgress[file.name] || 0}% uploaded
              </li>
            ))}
          </ul>
        </div>
      )}

      {files.length > 0 && <button onClick={handleFileUpload}>Upload Time Capsule</button>}

      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default TimeCapsule;