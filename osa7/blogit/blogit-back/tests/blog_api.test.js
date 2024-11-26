const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const helper = require('./test_helper');

const Blog = require('../models/blog');
const User = require('../models/user');

let token = null;

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
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const user = new User({
    username: 'testuser111',
    passwordHash: 'passwordhash',
  });
  await user.save();

  token = helper.getTokenForUser(user);

  const blogObjects = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: user._id })
  );
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test('blogs are returned as json', async () => {
  const newBlog = {
    title: 'Eka testiblogi',
    author: 'testuser',
    url: 'http://testi.fi',
    likes: 10,
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.type, 'application/json');
});

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs');

  const titles = response.body.map((blog) => blog.title);
  assert(titles.includes('Eka blogi'));
});

test('adding a new blog succeeds', async () => {
  const newBlog = {
    title: 'Neljäs blogi',
    author: 'Kirjoittaja Nelonen',
    url: 'http://esimerkki4.fi',
    likes: 8,
  };

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  console.log(response.body);

  assert(response.body.title === newBlog.title);
  assert(response.body.author === newBlog.author);
  assert(response.body.url === newBlog.url);
  assert(response.body.likes === newBlog.likes);
});

test('adding a new blog fails with status 401 if token is missing', async () => {
  const newBlog = {
    title: 'Kolmas blogi',
    author: 'Kirjoittaja Kolmonen',
    url: 'http://esimerkki3.fi',
    likes: 8,
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)

    .expect(401);

  console.log(response.body);

  assert(response.body.error === 'token missing or invalid');
});

after(async () => {
  await mongoose.connection.close();
});
