const express = require('express');
const Blog = require('../models/blog');
const commentsRouter = express.Router();

commentsRouter.post('/:id/comments', async (request, response) => {
  const { id } = request.params;
  const { content } = request.body;

  if (!content || content.length < 1) {
    return response
      .status(400)
      .json({ error: 'Comment content cannot be empty' });
  }

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' });
    }

    const newComment = {
      content,
    };

    blog.comments = blog.comments.concat(newComment);
    await blog.save();

    response.status(201).json(newComment);
  } catch (error) {
    console.error(error.message);
    response.status(500).json({ error: 'Failed to add comment' });
  }
});

module.exports = commentsRouter;
