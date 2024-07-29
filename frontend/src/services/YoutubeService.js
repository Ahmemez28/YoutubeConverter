// src/services/youtubeService.js
import axios from 'axios';

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const fetchVideos = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults: 24,
        key: API_KEY,
        type: 'video',
        q: query, // Add the query parameter
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching videos', error);
    throw error;
  }
};
