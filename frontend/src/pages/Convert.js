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
      }, {
        responseType: 'stream'
      });

      const reader = response.data.getReader();
      const stream = new ReadableStream({
        async start(controller) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
            const progressEvent = { loaded: value.length, total: response.headers['content-length'] };
            const total = progressEvent.total || 1;
            const current = progressEvent.loaded;
            const percentage = Math.floor((current / total) * 100);
            setProgress(percentage);
          }
          controller.close();
        }
      });

      const downloadUrl = URL.createObjectURL(await new Response(stream).blob());
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${new Date().getTime()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setLoading(false);
      setMessage("Download complete!");
    } catch (error) {
      setMessage("Failed to connect to the server. Please ensure the server is running.");
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Navbar />
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

export default Convert;
