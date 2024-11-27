import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBlogs, addBlog } from '../reducers/blogReducer';
import blogService from '../services/blogs';
import BlogForm from './BlogForm';

const BlogList = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);

  useEffect(() => {
    const fetchBlogs = async () => {
      const initialBlogs = await blogService.getAll();
      dispatch(setBlogs(initialBlogs));
    };

    fetchBlogs();
  }, [dispatch]);

  const handleNewBlog = (newBlog) => {
    dispatch(addBlog(newBlog));
  };

  return (
    <div>
      <h2>Blogs</h2>
      <BlogForm handleNewBlog={handleNewBlog} />
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            {blog.title} by {blog.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
