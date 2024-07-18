import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Create a CSS file for styles
import icon from "./images/image.png"; // Ensure the correct path to your icon image
import spinner from "./images/loading.gif"; // Path to spinner gif

function App() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async (format) => {
    setMessage("");
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
        setMessage(
          `Download Here: <a href="http://localhost:5000${response.data.downloadUrl}" download>Click to Download</a>`
        );
      } else {
        setMessage(`Error: ${response.data.error}`);
      }
    } catch (error) {
      setMessage(
        "Failed to connect to the server. Please ensure the server is running."
      );
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={icon} alt="App Icon" className="App-icon" />
        <h1>YouTube Converter</h1>
        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        <div>
          <button onClick={() => handleConvert("mp3")} disabled={loading}>
            Convert to MP3
          </button>
          <button onClick={() => handleConvert("mp4")} disabled={loading}>
            Convert to MP4
          </button>
        </div>
        {loading && <img src={spinner} alt="Loading" className="loading-gif" />}
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
  