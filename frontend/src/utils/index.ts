import axios from "axios";

const API_URL = "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use((req) => {
  return req;
});
API.interceptors.response.use((res) => {
  return res;
});
export default API;
