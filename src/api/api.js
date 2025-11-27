import axios from "axios";

const API = axios.create({
  //baseURL: "http://localhost:5000/api", // backend URL
  baseURL: "https://myloginapp-backend.vercel.app/api", // backend URL LIVE VERCEL
});

// Add token to headers if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
