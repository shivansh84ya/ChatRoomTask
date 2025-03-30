const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/', auth, userController.getAllUsers);
router.post('/friend-request', auth, userController.sendFriendRequest);
router.get('/friend-requests', auth, userController.getFriendRequests);
router.post('/friend-request/respond', auth, userController.respondToFriendRequest);
router.get('/friends', auth, userController.getFriends);

module.exports = router;