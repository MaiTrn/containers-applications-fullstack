import axios from "./apiClient";
const baseUrl = "/api/login";

const login = async (user) => {
  const response = await axios.post(baseUrl, user);
  return response.data;
};

export default { login };
