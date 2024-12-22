const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('../services/hash');
const { JWT_SECRET } = process.env;

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !bcrypt.comparePassword(password, user.password)) {
      return res.status(401).send({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).send({ user, token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function currentUser(req, res) {
  try {
    const user = req.user;
    res.status(200).send({ user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

module.exports = { login, currentUser };
