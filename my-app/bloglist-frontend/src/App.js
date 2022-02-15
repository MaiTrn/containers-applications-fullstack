import React, { useState, useEffect, useRef } from "react";
import AddBlogForm from "./components/AddBlogForm";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import Notifications from "./components/Notifications";
import Togglable from "./components/Togglable";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    const fetchBlogs = async () => {
      const newBlogs = await blogService.getAll();
      setBlogs(newBlogs);
    };
    if (user !== null) fetchBlogs();
  }, [user]);

  useEffect(() => {
    const loggedInBLogAppUser = window.localStorage.getItem(
      "loggedInBLogAppUser"
    );
    if (loggedInBLogAppUser !== null) {
      const newUser = JSON.parse(loggedInBLogAppUser);
      setUser(newUser);
      blogService.setToken(newUser.token);
    }
  }, []);

  const handleLogin = async (userObject) => {
    try {
      const newUser = await loginService.login(userObject);
      window.localStorage.setItem(
        "loggedInBLogAppUser",
        JSON.stringify(newUser)
      );
      setUser(newUser);
      blogService.setToken(newUser.token);
    } catch (exeption) {
      setErrorMessage("Wrong user name or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  const handleAddBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject);
      blogFormRef.current.toggleVisibility();
      setConfirmMessage(
        `A new blog ${newBlog.title} by ${newBlog.author} added`
      );
      setBlogs(
        blogs.concat({
          ...newBlog,
          userId: { name: user.name, username: user.username },
        })
      );
      setTimeout(() => {
        setConfirmMessage(null);
      }, 5000);
    } catch (exeption) {
      setErrorMessage("Error adding new blog");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  const handleLike = async (id, newBlogObject) => {
    try {
      await blogService.update(id, newBlogObject);
    } catch (exception) {
      setErrorMessage("Error upading blog");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  const handleRemove = async (blogObject) => {
    try {
      await blogService.remove(blogObject.id);
      setBlogs(blogs.filter((b) => b.id !== blogObject.id));
      setConfirmMessage(
        `Blog ${blogObject.title} by ${blogObject.author} deleted`
      );
      setTimeout(() => {
        setConfirmMessage(null);
      }, 5000);
    } catch (exception) {
      setErrorMessage("Error deleting blog");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("loggedInBLogAppUser");
    setUser(null);
    blogService.setToken(null);
  };

  const blogsList = () => {
    //modify blogs without mutating the actual state
    const copy = [...blogs];
    return (
      <div>
        <p>
          {user.name} is logged in <button onClick={logout}>Logout</button>
        </p>
        <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
          <AddBlogForm createBlog={handleAddBlog} />
        </Togglable>
        {copy
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user.username}
              updateLike={handleLike}
              removeBlog={handleRemove}
            />
          ))}
      </div>
    );
  };

  return (
    <div>
      <h1>Blogs</h1>
      <Notifications message={confirmMessage} notificationType="confirm" />
      <Notifications message={errorMessage} notificationType="error" />
      {!user ? <LoginForm login={handleLogin} /> : blogsList()}
    </div>
  );
};

export default App;
