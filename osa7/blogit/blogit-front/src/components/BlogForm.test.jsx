import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlogForm from './BlogForm';

/// toimii
test('Löytyykö title?', () => {
  const blog = {
    title: 'Toka blogi',
    author: 'Joku Toinen',
    url: 'http://esimerkki2.fi',
  };
  render(<BlogForm blog={blog} />);
  expect(screen.getByText('Title:')).toBeInTheDocument();
});

/// toimii
test('Löytyykö Author?', () => {
  const blog = {
    title: 'Toka blogi',
    author: 'Joku Toinen',
    url: 'http://esimerkki2.fi',
  };
  render(<BlogForm blog={blog} />);
  expect(screen.getByText('Author:')).toBeInTheDocument();
});
