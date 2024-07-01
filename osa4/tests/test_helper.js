const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    title: 'Eka blogi',
    author: 'Joku Kirjoittaja',
    url: 'http://esimerkki.fi',
    likes: 10,
  },
  {
    title: 'Toka blogi',
    author: 'Joku Toinen',
    url: 'http://esimerkki2.fi',
    likes: 5,
  }
 

]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'Joku', url: 'http://esim.fi', likes: 0 })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const getTokenForUser = (user) => {
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  return jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' })
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  getTokenForUser
}
