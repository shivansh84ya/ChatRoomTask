import axios from 'axios';

const API_URL = '/api/users';

const getAllUsers = () => {
  return axios.get(`${API_URL}/`);
};

const sendFriendRequest = (receiverId) => {
  return axios.post(`${API_URL}/friend-request`, { receiverId });
};

const getFriendRequests = () => {
  return axios.get(`${API_URL}/friend-requests`);
};

const respondToFriendRequest = (requestId, action) => {
  return axios.post(`${API_URL}/friend-request/respond`, { requestId, action });
};

const getFriends = () => {
  return axios.get(`${API_URL}/friends`);
};

const userService = {
  getAllUsers,
  sendFriendRequest,
  getFriendRequests,
  respondToFriendRequest,
  getFriends
};

export default userService;