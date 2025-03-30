import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';
import chatService from '../../services/chat';
import AuthContext from '../../context/AuthContext';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  console.log("workinggg");
  
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await chatService.getChatList();
        setChats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (chats.length === 0) {
    return <Typography>No chats yet</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Your Chats
      </Typography>
      <List>
        {chats.map((chat) => (
          <ListItem 
            key={chat.friend._id} 
            button 
            component={Link} 
            to={`/chat/${chat.friend._id}`}
          >
            <ListItemAvatar>
              <Avatar src={chat.friend.profilePic} />
            </ListItemAvatar>
            <ListItemText
              primary={chat.friend.name}
              secondary={
                chat.lastMessage 
                  ? `${chat.lastMessage.content.substring(0, 30)}...` 
                  : 'No messages yet'
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ChatList;