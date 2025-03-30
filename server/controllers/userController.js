const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id, $nin: req.user.friends },
    }).select("name email profilePic");

    res.send(users);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};





































exports.sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).send({ error: "User not found" });
    }

    if (req.user.friends.includes(receiverId)) {
      return res.status(400).send({ error: "Already friends" });
    }

    const existingRequest = await FriendRequest.findOne({
      sender: req.user._id,
      receiver: receiverId,
    });

    if (existingRequest) {
      return res.status(400).send({ error: "Friend request already sent" });
    }

    const friendRequest = new FriendRequest({
      sender: req.user._id,
      receiver: receiverId,
    });

    await friendRequest.save();
    res.status(201).send(friendRequest);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.getFriendRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      receiver: req.user._id,
      status: "pending",
    }).populate("sender", "name email profilePic");

    res.send(requests);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.respondToFriendRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;

    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).send({ error: "Request not found" });
    }

    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: "Unauthorized" });
    }

    if (action === "accept") {
      request.status = "accepted";
      await request.save();

      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { friends: request.sender },
      });

      await User.findByIdAndUpdate(request.sender, {
        $addToSet: { friends: req.user._id },
      });

      res.send({ message: "Friend request accepted" });
    } else if (action === "reject") {
      request.status = "rejected";
      await request.save();
      res.send({ message: "Friend request rejected" });
    } else {
      res.status(400).send({ error: "Invalid action" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friends",
      "name email profilePic"
    );
    res.send(user.friends);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
