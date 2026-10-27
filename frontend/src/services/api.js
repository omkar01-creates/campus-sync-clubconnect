import axios from 'axios';

// All requests go to /api (Vite forwards them to the backend in development)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

// Attach the JWT token to every request if the user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token has expired, log the user out and send them to the login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && localStorage.getItem('token')) {
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ---------- Small helper functions used by many pages ----------

export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function saveLogin(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Reads the error message sent by the backend
export function getError(error) {
  return error.response?.data?.message || 'Something went wrong. Please try again';
}

// "2026-10-25" -> "25 Oct 2026"
export function formatDate(value) {
  if (!value) return '';
  const date = new Date(value.slice(0, 10) + 'T00:00:00');
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function todayString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

// Picks a local image from /public/images based on the club category
const knownImages = ['technology', 'arts', 'culture', 'music', 'sports', 'literature'];

export function getImage(category) {
  const name = (category || '').toLowerCase();
  return knownImages.includes(name) ? `/images/${name}.jpg` : '/images/event.jpg';
}

// Picks a Font Awesome icon based on the club category
const icons = {
  technology: 'fa-code',
  arts: 'fa-camera',
  culture: 'fa-masks-theater',
  music: 'fa-music',
  sports: 'fa-futbol',
  literature: 'fa-book-open'
};

export function getIcon(category) {
  return icons[(category || '').toLowerCase()] || 'fa-users';
}

export default api;
