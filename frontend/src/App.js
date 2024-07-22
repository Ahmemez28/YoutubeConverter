import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Create a CSS file for styles
import icon from "./images/image.png"; // Ensure the correct path to your icon image
import spinner from "./images/loading.gif"; // Path to spinner gif

function App() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleConvert = async (format) => {
    setMessage("");
    setProgress(0);
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
        downloadFile(response.data.downloadUrl);
      } else {
        setMessage(`Error: ${response.data.error}`);
        setLoading(false);
      }
    } catch (error) {
      setMessage(
        "Failed to connect to the server. Please ensure the server is running."
      );
      setLoading(false);
    }
  };

  const downloadFile = (url) => {
    axios({
      url: `http://localhost:5000${url}`,
      method: "GET",
      responseType: "blob", // Important to handle binary data
      onDownloadProgress: (progressEvent) => {
        const total = progressEvent.total || 1;
        const current = progressEvent.loaded;
        const percentage = Math.floor((current / total) * 100);
        setProgress(percentage);
      },
    })
      .then((response) => {
        const blob = new Blob([response.data]);
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", url.split("/").pop() || "downloadedFile");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setLoading(false);
        setMessage("Download complete!");
      })
      .catch((error) => {
        setLoading(false);
        setMessage("Failed to download the file.");
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={icon} alt="App Icon" className="App-icon" />
        <h1>YouTube Converter</h1>
        <input
          type="text"
          className="form-control"
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
          </>
        )}
        <div
          className="message"
          dangerouslySetInnerHTML={{ __html: message }}
        />
        <p className="footer">Created by Ahmed</p>
      </header>
    </div>
  );
}

export default App;
