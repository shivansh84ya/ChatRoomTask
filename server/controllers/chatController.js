const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!req.user.friends.includes(receiverId)) {
      return res.status(403).send({ error: 'You can only message friends' });
    }

    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      content
    });

    await message.save();
    res.status(201).send(message);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { friendId } = req.params;

    if (!req.user.friends.includes(friendId)) {
      return res.status(403).send({ error: 'Unauthorized' });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: friendId },
        { sender: friendId, receiver: req.user._id }
      ]
    }).sort({ createdAt: 1 });

    res.send(messages);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.getChatList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'name email profilePic');
    
    const chatList = await Promise.all(user.friends.map(async (friend) => {
      const lastMessage = await Message.findOne({
        $or: [
          { sender: req.user._id, receiver: friend._id },
          { sender: friend._id, receiver: req.user._id }
        ]
      }).sort({ createdAt: -1 }).limit(1);
      
      return {
        friend,
        lastMessage: lastMessage || null
      };
    }));

    res.send(chatList);
  } catch (err) {
    res.status(500).send({ error: err.message });
 }
};