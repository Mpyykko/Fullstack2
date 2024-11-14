const express = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = express.Router()
const jwt = require('jsonwebtoken')


const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}


// kaikki blogit
blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) {
    response.status(500).json({ error: 'Server error' })
  }
})

// blogi id:n perusteella
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

// uusi blogi
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(400).json({ error: 'Invalid userId' })
    }

    if (!body.title || !body.url) {
      return response.status(400).json({ error: 'Title or URL missing' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    console.error(error.message)
    response.status(500).json({ error: 'Server error' })
  }
})

// Poista blogi
blogsRouter.delete('/:id', async (request, response) => {
  const token = getTokenFrom(request)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

  
    if (blog.user.toString() !== decodedToken.id) {
      return response.status(403).json({ error: 'Unauthorized to delete this blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    console.error(error.message)
    response.status(500).json({ error: 'Server error' })
  }
})

// Päivitä 
blogsRouter.put('/:id', async (request, response, next) => {
  const { likes } = request.body

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true, runValidators: true, context: 'query' }
    )

    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).json({ error: 'Blog not found' })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter