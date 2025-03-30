import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Avatar, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Divider,
  Paper
} from '@mui/material';
import chatService from '../../services/chat';
import userService from '../../services/users';
import AuthContext from '../../context/AuthContext';

const ChatWindow = () => {
  const { friendId } = useParams();
  const [friend, setFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get friend details
        const friendsRes = await userService.getFriends();
        const foundFriend = friendsRes.data.find(f => f._id === friendId);
        setFriend(foundFriend);

        // Get messages
        const messagesRes = await chatService.getMessages(friendId);
        setMessages(messagesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [friendId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await chatService.sendMessage(friendId, newMessage);
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!friend) {
    return <Typography>Friend not found</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #eee' }}>
        <Avatar src={friend.profilePic} sx={{ width: 50, height: 50, mr: 2 }} />
        <Typography variant="h6">{friend.name}</Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        <List>
          {messages.map((message) => (
            <React.Fragment key={message._id}>
              <ListItem 
                sx={{ 
                  justifyContent: message.sender === user._id ? 'flex-end' : 'flex-start',
                  mb: 1
                }}
              >
                {message.sender !== user._id && (
                  <ListItemAvatar>
                    <Avatar src={friend.profilePic} />
                  </ListItemAvatar>
                )}
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 2,
                    backgroundColor: message.sender === user._id ? '#1976d2' : '#f5f5f5',
                    color: message.sender === user._id ? '#fff' : '#000',
                    borderRadius: message.sender === user._id 
                      ? '18px 18px 0 18px' 
                      : '18px 18px 18px 0'
                  }}
                >
                  <ListItemText 
                    primary={message.content} 
                    secondary={new Date(message.createdAt).toLocaleString()}
                    secondaryTypographyProps={{ 
                      color: message.sender === user._id ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
                    }}
                  />
                </Paper>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      <Box 
        component="form" 
        onSubmit={handleSendMessage}
        sx={{ p: 2, borderTop: '1px solid #eee' }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button 
            type="submit" 
            variant="contained" 
            disabled={!newMessage.trim()}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatWindow;