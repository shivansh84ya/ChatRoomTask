const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/db');
const bcrypt = require('bcryptjs')

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let profilePic = '';

    if (req.file) {
      profilePic = req.file.path;
    }

    const user = new User({
      name,
      email,
      password,
      profilePic
    });

    await user.save();
    const token = jwt.sign({ _id: user._id }, config.jwtSecret);
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Unable to login');
    }

    const token = jwt.sign({ _id: user._id }, config.jwtSecret);
    res.send({ user, token });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send({ error: err.message });
 }
};