const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./list_helper')




const Blog = require('../models/blog')
const User = require('../models/user')

let token = null

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const user = new User({ username: 'testuser', passwordHash: 'passwordhash' })
  await user.save()

  token = helper.getTokenForUser(user)

  const blogObjects = helper.initialBlogs.map(blog => new Blog({ ...blog, user: user._id }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})


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
    {
        title: 'Kolmas blogi',
        author: 'Joku Kolmas',
        url: 'http://esimerkki3.fi',
        likes: 15,
      }
  ]


 ///////////////////////////

 test('palauttaa oikean määrän blogeja', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 4)
})


 ///////////////////////////

 test('id tulee oikeassa muodossa', async () => {
  const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)

  response.body.forEach(blog => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})


///////////////////////////

test('lisää uusi blogi', async () => {
  const newBlog = {
    title: 'Viides blogi',
    author: 'Testikirjoittaja5',
    url: 'http://esimerkki.fi/viides',
    likes: 10,
  }


  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  const response = await api.get('/api/blogs')

 
  assert.strictEqual(response.body.length, initialBlogs.length)


})


  ///////////////////////////

  test('jos likes-kentällä ei arvoa, sen arvo on 0', async () => {
    const newBlog = {
      title: 'Blogi ilman likejä',
      author: 'Kirjoittaja Nelonen',
      url: 'http://esimerkki4.fi'
    }
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    assert.strictEqual(response.body.likes, 0)
  })
 
 ///////////////////////////

 test('palauttaa 400, jos title puuttuu', async () => {
  const newBlog = {
    author: 'Ei titleä',
    url: 'http://esimerkki5.fi',
    likes: 4,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(400)
})
  
test('palauttaa 400, jos url puuttuu', async () => {
  const newBlog = {
    title: 'Ilman URLia',
    author: 'Kirjoittaja ilman URLia',
    likes: 4,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(400)
})

 ///////////////////////////

 test('blogin poisto', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  assert(!titles.includes(blogToDelete.title))
})

///////////////////////////
  
test('palauttaa 404 jos blogia ei löydy', async () => {
  const validNonexistentId = await helper.nonExistingId()

  await api
    .delete(`/api/blogs/${validNonexistentId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(404)
})

///////////////////////////

test('Päivitetään tykkäyksiä', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  const newLikes = blogToUpdate.likes + 1

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ likes: newLikes })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

  assert.strictEqual(updatedBlog.likes, newLikes)
})

after(async () => {
  await mongoose.connection.close()
})
  