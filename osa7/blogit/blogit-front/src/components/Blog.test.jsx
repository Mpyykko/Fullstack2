import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

const blog = {
  title: 'Test Blog',
  author: 'Mikko',
  url: 'http://www.fi',
  likes: 10,
  user: {
    username: 'testuser',
  },
};

const user = {
  username: 'testuser',
};

describe('<Blog />', () => {
  let mockHandleLikeUpdate, mockHandleDeleteBlog;

  beforeEach(() => {
    mockHandleLikeUpdate = vi.fn();
    mockHandleDeleteBlog = vi.fn();
    render(
      <Blog
        blog={blog}
        handleLikeUpdate={mockHandleLikeUpdate}
        handleDeleteBlog={mockHandleDeleteBlog}
        user={user}
      />
    );
  });

  // teht. 5.14 toimii

  test('Näytä lisätiedot jos klikataan', async () => {
    const userActions = userEvent.setup();
    const button = screen.getByText('Show more');
    await userActions.click(button);
    expect(screen.getByText('Writer: Mikko')).toBeInTheDocument();
    expect(screen.getByText('Url: http://www.fi')).toBeInTheDocument();
    expect(screen.getByText('Likes: 10')).toBeInTheDocument();
  });

  // teht. 5.15 ei toimi
  test('liken tuplaklikkaus', async () => {
    const userActions = userEvent.setup();
    const button = screen.getByText('Show more');
    await userActions.click(button);
    const likeButton = screen.getByText('Like');
    await userActions.click(likeButton);
    await userActions.click(likeButton);

    // tässä vika?
    expect(mockHandleLikeUpdate).toHaveBeenCalledTimes(2);
  });
});
