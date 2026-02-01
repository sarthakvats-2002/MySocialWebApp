import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8800/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(baseUrl + "/auth/login", userCredential);
    
    // Store token and user data
    const userData = {
      ...res.data.user,
      token: res.data.token,
    };
    
    localStorage.setItem("user", JSON.stringify(userData));
    dispatch({ type: "LOGIN_SUCCESS", payload: userData });
  } catch (err) {
    dispatch({ 
      type: "LOGIN_FAILURE", 
      payload: err.response?.data?.message || "Login failed" 
    });
    throw err;
  }
};

export const logoutCall = async (userId, dispatch) => {
  try {
    await axios.post(baseUrl + "/auth/logout", { userId });
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  } catch (err) {
    console.error("Logout error:", err);
  }
};

export default api;