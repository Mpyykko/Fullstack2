const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

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
  },
]



beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('cleared')

  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
    console.log('saved:', blog.title)
  }
  console.log('done')
})

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 2)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(blog => blog.title)
  assert(titles.includes('Eka blogi'))
})


test('adding a new blog succeeds', async () => {
  const newBlog = {
    title: 'Kolmas blogi',
    author: 'Kirjoittaja Kolmonen',
    url: 'http://esimerkki3.fi',
    likes: 8,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(blog => blog.title)
  assert(titles.includes('Kolmas blogi'))
})


after(async () => {
  await mongoose.connection.close()
})
