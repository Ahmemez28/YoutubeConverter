// src/components/Video.js
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar'; // Adjust the import if the path is different
import { fetchVideos } from '../services/YoutubeService';
import '../App.css';
import icon from './images/image.png'; // Ensure the correct path to your icon image

function Video() {
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState('');

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

  return (
    <div className="App">
      <Navbar />
      <header className="App-header">
        <img src={icon} alt="icon" className="App-icon" />
        <h1>YouTube Video Titles</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
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
