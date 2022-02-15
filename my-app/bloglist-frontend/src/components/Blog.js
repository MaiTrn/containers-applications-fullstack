import React, { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, user, updateLike, removeBlog }) => {
  const [visible, setVisible] = useState(false);
  const [likes, setLikes] = useState(blog.likes);
  const blogStyle = {
    padding: 10,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
    marginTop: 5,
  };
  const displayStyle = {
    display: visible ? "" : "none",
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };
  const increaseLike = async () => {
    const updatedBlog = {
      userId: blog.userId.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: likes + 1,
    };
    updateLike(blog.id, updatedBlog);
    setLikes(likes + 1);
  };

  const remove = async () => {
    const result = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    );
    if (result) {
      removeBlog(blog);
    }
  };

  return (
    <div style={blogStyle} className="blog">
      <div className="header">
        {blog.title} - {blog.author}{" "}
        <button onClick={toggleVisibility}>{visible ? "Hide" : "View"}</button>
      </div>
      <div style={displayStyle} className="info">
        <p>{blog.url}</p>
        <p>
          Likes {likes} <button onClick={increaseLike}>like</button>
        </p>
        <p>{blog.userId.name}</p>
        {blog.userId.username === user && (
          <button onClick={remove}>Remove</button>
        )}
      </div>
    </div>
  );
};
Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.string.isRequired,
  updateLike: PropTypes.func.isRequired,
};

export default Blog;
