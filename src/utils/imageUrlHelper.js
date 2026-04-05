import API_BASE_URL from '../config';

export const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/150'; // fallback
  const cleanPath = path.replace(/\\/g, '/').replace(/^\/+/, '');
  return `${API_BASE_URL}/${cleanPath}`;
};
