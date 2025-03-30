import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';
import userService from '../../services/users';
import AuthContext from '../../context/AuthContext';

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await userService.getFriends();
        setFriends(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (friends.length === 0) {
    return <Typography>No friends yet</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Your Friends
      </Typography>
      <List>
        {friends.map((friend) => (
          <ListItem 
            key={friend._id} 
            button 
            component={Link} 
            to={`/chat/${friend._id}`}
          >
            <ListItemAvatar>
              <Avatar src={friend.profilePic} />
            </ListItemAvatar>
            <ListItemText
              primary={friend.name}
              secondary={friend.email}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FriendList;