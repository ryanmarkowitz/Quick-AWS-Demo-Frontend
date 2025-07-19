import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Set a larger timeout for potentially large responses
  timeout: 30000, // 30 seconds
  // Allow large response sizes
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

export const fetchResults = async () => {
  try {
    const response = await api.get('/results');
    return response.data;
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
};