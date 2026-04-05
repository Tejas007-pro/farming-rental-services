const getApiUrl = () => {
  // If environment variable is set, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Auto-detect based on current hostname
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment && typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If localhost or 127.0.0.1, use as-is
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://localhost:5000`;
    }
    // Otherwise use detected IP with port 5000
    return `http://${hostname}:5000`;
  }

  // Fallback
  return 'http://localhost:5000';
};

const API_BASE_URL = getApiUrl();

export default API_BASE_URL;
