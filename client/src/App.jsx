import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import PrivateRoute from './components/Layout/PrivateRoute';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserList from './components/Friends/UserList';
import FriendList from './components/Friends/FriendList';
import FriendRequest from './components/Friends/FriendRequest';
import ChatList from './components/Chat/ChatList';
import ChatWindow from './components/Chat/ChatWindow';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<ChatList />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/friends" element={<FriendList />} />
            <Route path="/requests" element={<FriendRequest />} />
            <Route path="/chat/:friendId" element={<ChatWindow />} />
          </Route>
        </Routes>
      </Box>
    </Box>
  );
}

export default App;