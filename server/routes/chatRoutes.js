const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const chatController = require('../controllers/chatController');

router.post('/send', auth, chatController.sendMessage);
router.get('/messages/:friendId', auth, chatController.getMessages);
router.get('/list', auth, chatController.getChatList);

module.exports = router;