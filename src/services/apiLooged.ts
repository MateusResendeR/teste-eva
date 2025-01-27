import axios from "axios";

const apiLogged = axios.create({
  baseURL: import.meta.env.VITE_API_URL+'/private',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});

export default apiLogged;