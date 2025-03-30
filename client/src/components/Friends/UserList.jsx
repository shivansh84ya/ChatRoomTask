import React, { useState, useEffect, useContext } from 'react';
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, Typography } from '@mui/material';
import userService from '../../services/users';
import AuthContext from '../../context/AuthContext';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.getAllUsers();
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSendRequest = async (userId) => {
    try {
      await userService.sendFriendRequest(userId);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (users.length === 0) {
    return <Typography>No users found</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        All Users
      </Typography>
      <List>
        {users.map((userItem) => (
          <ListItem key={userItem._id}>
            <ListItemAvatar>
              <Avatar src={userItem.profilePic} />
            </ListItemAvatar>
            <ListItemText
              primary={userItem.name}
              secondary={userItem.email}
            />
            <Button
              variant="contained"
              onClick={() => handleSendRequest(userItem._id)}
            >
              Send Request
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserList;