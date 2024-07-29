import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import icon from "./images/image.png";
import spinner from "./images/loading.gif";
import Navbar from "./components/Navbar";

function Convert() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [progressDetails, setProgressDetails] = useState({});

  const handleConvert = async (format) => {
    setMessage("");
    setProgress(0);
    setDownloadUrl("");
    setProgressDetails({});
    if (!url) {
      setMessage("Please enter a valid YouTube URL.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/convert", {
        url,
        format,
      });

      if (response.data.success) {
        setDownloadUrl(`http://localhost:5000${response.data.downloadUrl}`);
        setMessage("Conversion complete! Click the download button.");
      } else {
        setMessage(`Error: ${response.data.error}`);
      }
    } catch (error) {
      setMessage("Failed to connect to the server. Please ensure the server is running.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (url) {
      const eventSource = new EventSource(`http://localhost:5000/progress/${url}`);
      eventSource.onmessage = function (event) {
        const data = JSON.parse(event.data);
        setProgressDetails(data);
        if (data.total_bytes) {
          setProgress((data.downloaded_bytes / data.total_bytes) * 100);
        }
        if (data.status === 'finished') {
          eventSource.close();
        }
      };
      return () => {
        eventSource.close();
      };
    }
  }, [url]);

  return (
    <div className="App">
      <Navbar />
      <header className="App-header">
        <img src={icon} alt="App Icon" className="App-icon" />
        <h1>YouTube Converter</h1>
        <input
          type="text"
          className="form-control w-50 rounded my-2"
          placeholder="Enter YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        <div className="button-group">
          <button
            className="btn btn-primary"
            onClick={() => handleConvert("mp3")}
            disabled={loading}
          >
            Convert to MP3
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleConvert("mp4")}
            disabled={loading}
          >
            Convert to MP4
          </button>
        </div>
        {loading && (
          <>
            <img src={spinner} alt="Loading" className="loading-gif" />
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-details">
              {progressDetails.status === 'downloading' && (
                <div>
                  <p>Filename: {progressDetails.filename}</p>
                  <p>Speed: {progressDetails.speed} bytes/s</p>
                  <p>ETA: {progressDetails.eta} seconds</p>
                </div>
              )}
            </div>
          </>
        )}
        <div
          className="message"
          dangerouslySetInnerHTML={{ __html: message }}
        />
        {downloadUrl && (
          <button
            className="btn btn-success"
            onClick={() => window.location.href = downloadUrl}
          >
            Download
          </button>
        )}
        <p className="footer">Created by Ahmed</p>
      </header>
    </div>
  );
}

export default Convert;
