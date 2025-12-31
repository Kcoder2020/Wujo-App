import axios from "axios";

const apiService = axios.create({
  baseURL: "https://dat-server.ludoet.com/wujo-api/api", // Production server
  // baseURL: "http://localhost:3500/api", // Development server

  // For production, use: "https://app.wujo.app/api"
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default apiService;
