import React, { useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/timeCapsule.css";
import { UserContext } from '../UserContext';

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-bar">
      <div className="progress" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

const TimeCapsule = () => {
  const { userInfo } = useContext(UserContext);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [releaseDate, setReleaseDate] = useState('2024-12-01');
  const [releaseTime, setReleaseTime] = useState('12:00');
  const [title, setTitle] = useState('Some Audio');
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setUploadProgress({});
  };

  const handleReleaseDateChange = (event) => {
    setReleaseDate(event.target.value);
  };

  const handleReleaseTimeChange = (event) => {
    setReleaseTime(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleFileUpload = () => {
    if (!releaseDate || !releaseTime || !title) {
      toast.error('Please select a release date, time, and title!');
      return;
    }

    const fullReleaseDateTime = `${releaseDate} ${releaseTime}`;
    const uploadPromises = files.map((file) => uploadFile(file, fullReleaseDateTime));

    Promise.all(uploadPromises)
      .then(() => {
        toast.success(`Upload complete! Time Capsule titled "${title}" will open on ${fullReleaseDateTime}`);
      })
      .catch((error) => {
        console.error('Upload error:', error);
        toast.error('Upload failed. Please try again.');
      });
  };

  const uploadFile = (file, releaseDateTime) => {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('releaseDateTime', releaseDateTime);
    formData.append('title', title);
    formData.append('userId',userInfo.id);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:4000/timecapsule', true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress((prevProgress) => ({
            ...prevProgress,
            [file.name]: percentComplete,
          }));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          resolve(xhr.response);
          setUploadProgress((prevProgress) => ({
            ...prevProgress,
            [file.name]: 100,
          }));
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Upload failed: Network error'));
      };

      xhr.send(formData);
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
        <label>Set Title: </label>
        <input type="text" value={title} onChange={handleTitleChange} placeholder="Enter a title for your time capsule" />

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
                {file.name} - {uploadProgress[file.name] || 0}%
                <ProgressBar progress={uploadProgress[file.name] || 0} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {files.length > 0 && <button onClick={handleFileUpload}>Upload Time Capsule</button>}

      <ToastContainer />
    </div>
  );
};

export default TimeCapsule;