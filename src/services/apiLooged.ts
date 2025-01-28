import axios from "axios";

const apiLogged = axios.create({
  baseURL: import.meta.env.VITE_API_URL+'/private',
});

export default apiLogged;