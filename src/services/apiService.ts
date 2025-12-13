import axios from "axios";

const apiService = axios.create({
  baseURL: "http://localhost:3000/api", // Development server
  // For production, use: "https://app.wujo.app/api"
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default apiService;
