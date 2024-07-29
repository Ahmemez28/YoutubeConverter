import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar'; // Adjust the import if the path is different
import { fetchVideos } from '../services/YoutubeService';
import axios from 'axios';
import '../App.css';
import icon from './images/image.png'; // Ensure the correct path to your icon image
import spinner from './images/loading.gif'; // Ensure the correct path to your spinner image

function Video() {
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState({});
  const [downloadUrl, setDownloadUrl] = useState({});

  const getVideos = async (searchQuery) => {
    try {
      const videoData = await fetchVideos(searchQuery);
      setVideos(videoData);
    } catch (error) {
      console.error('Error fetching videos', error);
    }
  };

  useEffect(() => {
    getVideos(''); // Fetch default videos on initial load
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    getVideos(query);
  };

  const handleConvert = async (url, format, videoId) => {
    setLoading((prev) => ({ ...prev, [videoId]: true }));
    try {
      const response = await axios.post("http://localhost:5000/convert", {
        url,
        format,
      });
      if (response.data.success) {
        setDownloadUrl((prev) => ({
          ...prev,
          [videoId]: `http://localhost:5000${response.data.downloadUrl}`
        }));
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      alert("Failed to connect to the server. Please ensure the server is running.");
    }
    setLoading((prev) => ({ ...prev, [videoId]: false }));
  };

  return (
    <div className="App">
      <Navbar />
      <header className="App-header">
        <img src={icon} alt="icon" className="App-icon" />
        <h1>YouTube Video Search</h1>
        <form onSubmit={handleSearch} className="search-form ">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input "
            placeholder="Search for videos..."
          />
          <button type="submit" className="search-button">Search</button>
        </form>
        <div className="video-list">
          {videos.map((video) => (
            <div key={video.id.videoId} className="video-item">
              <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
                <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} className="video-thumbnail" />
              </a>
              <div className="video-details">
                <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer" className="video-title">
                  {video.snippet.title}
                </a>
                <p className="video-description">{video.snippet.description}</p>
                <div className="d-flex flex-column align-items-center">
                  <div className="button-group">
                    <button
                      className='rounded m-2 btn p-2 bg-dark text-white'
                      onClick={() => handleConvert(`https://www.youtube.com/watch?v=${video.id.videoId}`, 'mp3', video.id.videoId)}
                      disabled={loading[video.id.videoId]}
                    >
                      Download MP3
                    </button>
                    <button
                      className='rounded m-2 btn p-2 bg-dark text-white'
                      onClick={() => handleConvert(`https://www.youtube.com/watch?v=${video.id.videoId}`, 'mp4', video.id.videoId)}
                      disabled={loading[video.id.videoId]}
                    >
                      Download MP4
                    </button>
                  </div>
                  {loading[video.id.videoId] && (
                    <div className="loading-container">
                      <img src={spinner} alt="Loading" className="loading-spinner" />
                      <p>Downloading...</p>
                    </div>
                  )}
                  {downloadUrl[video.id.videoId] && !loading[video.id.videoId] && (
                    <button
                      className="btn btn-success"
                      onClick={() => window.location.href = downloadUrl[video.id.videoId]}
                    >
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="footer">Created by Ahmed</p>
      </header>
    </div>
  );
}

export default Video;
