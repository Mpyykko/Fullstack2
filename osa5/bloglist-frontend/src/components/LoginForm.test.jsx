import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from './LoginForm'


// teht. 5.16 toimii
test('<LoginForm /> lähettää lomakkeen tiedot', async () => {
  const handleSubmit = vi.fn()
  const handleUsernameChange = vi.fn()
  const handlePasswordChange = vi.fn()

  render(
    <LoginForm
      handleSubmit={handleSubmit}
      handleUsernameChange={handleUsernameChange}
      handlePasswordChange={handlePasswordChange}
      username=""
      password=""
    />
  )

  const usernameInput = screen.getByPlaceholderText('username')
  const passwordInput = screen.getByPlaceholderText('password')
  const loginButton = screen.getByText('login')

  await userEvent.type(usernameInput, 'testUser')
  await userEvent.type(passwordInput, 'testPass')
  await userEvent.click(loginButton)

  expect(handleSubmit).toHaveBeenCalledTimes(1)
  expect(handleUsernameChange).toHaveBeenCalled()
  expect(handlePasswordChange).toHaveBeenCalled()
})
