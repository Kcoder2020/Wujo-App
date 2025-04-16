import axios from "axios";

const apiService = axios.create({
  baseURL: "https://app.wujo.app/api/", // Replace with your API base URL
});

export default apiService;
