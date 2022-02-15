import axios from "axios";

const apiClient = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

export default apiClient;
