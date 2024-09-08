const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // tietokannan tyhjennys toimii
    const response = await request.post('http://localhost:3003/api/testing/reset')
    console.log(await response.text())
   

    // käyttäjän luominen onnistuu
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await page.goto('/')
  })


  test('blogit järkkään likejen mukaan', async ({ page }) => {
    // blogien luonti onnistuu
    await loginWith(page, 'mluukkai', 'salainen')
    const newBlogButton = page.locator('button', { hasText: 'New blog' })
    await newBlogButton.waitFor({ state: 'visible' })
    await newBlogButton.click()

    const createBlog = async (title, author, url) => {
      await page.fill('input[name="title"]', title)
      await page.fill('input[name="author"]', author)
      await page.fill('input[name="url"]', url)
      const createButton = page.locator('button', { hasText: 'Create' })
      await createButton.waitFor({ state: 'visible' })
      await createButton.click()
      
      await page.waitForSelector(`text=${title}`)
    }
    
    await createBlog('Blogi 1', 'Kirjoittaja 1', 'https://blogi1.fi')
    await createBlog('Blogi 2', 'Kirjoittaja 2', 'https://blogi2.fi')
    await createBlog('Blogi 3', 'Kirjoittaja 3', 'https://blogi3.fi')

    // blogit oikeassa järjestyksessä
 
    const blogs = page.locator('div[data-testid="blogit"]')

    const likeBlog = async (title, likeCount) => {
  const blog = blogs.nth(title)
  const showMoreButton = blog.locator('button[data-testid="show-more"]')
  await showMoreButton.waitFor({ state: 'visible' })
  await showMoreButton.click()
  const likeButton = blog.locator('button[data-testid="like-button"]')
  for (let i = 0; i < likeCount; i++) {
    await likeButton.waitFor({ state: 'visible' })
    await likeButton.click()
  }
}

    await likeBlog(0, 2)
    await likeBlog(1, 5)
    await likeBlog(2, 3)
    const blogTitles = await blogs.allTextContents()
    expect(blogTitles[0]).toContain('Blogi 2')
    expect(blogTitles[1]).toContain('Blogi 3')
    expect(blogTitles[2]).toContain('Blogi 1')
  })
})