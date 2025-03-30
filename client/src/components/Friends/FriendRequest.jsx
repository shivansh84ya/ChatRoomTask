import React, { useState, useEffect, useContext } from 'react';
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, Typography } from '@mui/material';
import userService from '../../services/users';
import AuthContext from '../../context/AuthContext';

const FriendRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await userService.getFriendRequests();
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleResponse = async (requestId, action) => {
    try {
      await userService.respondToFriendRequest(requestId, action);
      setRequests(requests.filter(req => req._id !== requestId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (requests.length === 0) {
    return <Typography>No pending friend requests</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Friend Requests
      </Typography>
      <List>
        {requests.map((request) => (
          <ListItem key={request._id}>
            <ListItemAvatar>
              <Avatar src={request.sender.profilePic} />
            </ListItemAvatar>
            <ListItemText
              primary={request.sender.name}
              secondary={request.sender.email}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleResponse(request._id, 'accept')}
              >
                Accept
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleResponse(request._id, 'reject')}
              >
                Reject
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FriendRequest;