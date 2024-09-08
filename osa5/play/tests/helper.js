const loginWith = async (page, username, password) => {
    await page.getByRole('button', { name: 'Log in' }).click()
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
  }
  
  const createBlog = async (page, title, author, url) => {
    await page.locator('button', { hasText: 'New blog' }).click()

    await page.locator('input[name="title"]').fill(title)
    await page.locator('input[name="author"]').fill(author)
    await page.locator('input[name="url"]').fill(url)
 
    await page.locator('button', { hasText: 'Create' }).click()
    await page.waitForSelector(`text=${title}`, { state: 'visible'})
}



  
  
  export { loginWith, createBlog }
  