import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';

const Message = ({ message, isOwnMessage, friendPic }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
        mb: 2
      }}
    >
      {!isOwnMessage && (
        <Avatar src={friendPic} sx={{ mr: 1 }} />
      )}
      <Box
        sx={{
          p: 2,
          backgroundColor: isOwnMessage ? 'primary.main' : 'grey.200',
          color: isOwnMessage ? 'white' : 'text.primary',
          borderRadius: isOwnMessage 
            ? '18px 18px 0 18px' 
            : '18px 18px 18px 0',
          maxWidth: '70%'
        }}
      >
        <Typography>{message.content}</Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block',
            color: isOwnMessage ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            textAlign: 'right'
          }}
        >
          {new Date(message.createdAt).toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default Message;