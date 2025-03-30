import axios from 'axios';

const API_URL = '/api/auth';

const register = (name, email, password, profilePic) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);
  if (profilePic) {
    formData.append('profilePic', profilePic);
  }

  return axios.post(`${API_URL}/register`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

const logout = () => {
  return axios.post(`${API_URL}/logout`);
};

const authService = {
  register,
  login,
  logout
};

export default authService;