const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const usersRouter = express.Router();

// uusi käyttäjä
usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (!password || password.length < 3) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 3 characters long' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();

    res.status(201).json({
      username: savedUser.username,
      name: savedUser.name,
      id: savedUser._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// hae kaikki
usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.find({}).populate('blogs', { author: 1, likes: 1 });
    const usersWithBlogCount = users.map(user => ({
      ...user.toObject(),
      blogCount: user.blogs.length
    }));

    response.json(usersWithBlogCount);
  } catch (error) {
    response.status(500).json({ error: 'Server error' });
  }
});

// Yksittäinen käyttäjä
usersRouter.get('/:id', async (request, response) => {
  try {
    const user = await User.findById(request.params.id).populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
      likes: 1,
    });

    if (user) {
      response.json({
        username: user.username,
        name: user.name,
        blogs: user.blogs,
        blogCount: user.blogs.length,
      });
    } else {
      response.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    response.status(500).json({ error: 'Server error' });
  }
});

module.exports = usersRouter;
