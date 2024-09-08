const { test, describe, expect } = require('@playwright/test')

describe('Blogien etusivu', () => {
  // etusivu näkyy, toimii
  test('Etusivu löytyy', async ({ page }) => {
    await page.goto('/')

 
    await expect(page.getByText('Blogs')).toBeVisible()
  })


})