const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const usersRouter = express.Router()


/*
// uusi käyttäjä
usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!password || password.length < 3) {
    return res.status(400).json({ error: 'Password must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  try {
    const savedUser = await user.save()

    res.status(201).json({
      username: savedUser.username,
      name: savedUser.name,
      id: savedUser._id
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

*/

// hae kaikki
usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.find({}).populate('blogs', { author: 1, likes: 1 })
    response.json(users)
  } catch (error) {
    response.status(500).json({ error: 'Server error' })
  }
})


// uutta käyttäjää?
const createNewUser = async (username, name, password) => {
  if (!password || password.length < 3) {
    throw new Error('Password must be at least 3 characters long')
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  try {
    const savedUser = await user.save()
    return savedUser
  } catch (error) {
    throw new Error(error.message)
  }
}

// Uuden käyttäjän luonti
/*
createNewUser('user', 'Test User', 'pass')
  .then(user => {
    console.log('Uusi käyttäjä luotu:', user)
  })
  .catch(error => {
    console.error('Virhe luodessa käyttäjää:', error)
  })
*/

module.exports = usersRouter
