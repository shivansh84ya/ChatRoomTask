import axios from 'axios';

const API_URL = '/api/chat';

const sendMessage = (receiverId, content) => {
  return axios.post(`${API_URL}/send`, { receiverId, content });
};

const getMessages = (friendId) => {
  return axios.get(`${API_URL}/messages/${friendId}`);
};

const getChatList = () => {
  return axios.get(`${API_URL}/list`);
};

const chatService = {
  sendMessage,
  getMessages,
  getChatList
};

export default chatService;