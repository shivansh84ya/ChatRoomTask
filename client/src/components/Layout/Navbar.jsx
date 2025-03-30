import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Avatar, Box } from '@mui/material';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Chat App
        </Typography>
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button color="inherit" component={Link} to="/">
              Chats
            </Button>
            <Button color="inherit" component={Link} to="/users">
              Users
            </Button>
            <Button color="inherit" component={Link} to="/friends">
              Friends
            </Button>
            <Button color="inherit" component={Link} to="/requests">
              Requests
            </Button>
            <Avatar 
              alt={user.name} 
              src={user.profilePic} 
              sx={{ width: 40, height: 40 }}
            />
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;