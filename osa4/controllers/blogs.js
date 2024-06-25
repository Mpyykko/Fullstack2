const express = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = express.Router()


// kaikki
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// id:n perusteella
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

// luo blogi
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'Title or URL missing' })
  }

  const user = await User.findById(body.userId)
 

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
})

// poista blogi
blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// päivitä
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
      response.status(404).json({ error: 'blog not found' })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
