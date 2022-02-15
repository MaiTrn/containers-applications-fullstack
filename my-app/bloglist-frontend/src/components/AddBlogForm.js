import React, { useState } from "react";
import PropTypes from "prop-types";

const AddBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url,
    });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div className="blogForm">
      <h2>Add new blog</h2>

      <form onSubmit={addBlog}>
        <table>
          <tbody>
            <tr>
              <th> Title: </th>
              <td>
                <input
                  id="title"
                  type="text"
                  value={title}
                  name="Title"
                  onChange={({ target }) => setTitle(target.value)}
                />
              </td>
            </tr>
            <tr>
              <th> Author: </th>
              <td>
                <input
                  id="author"
                  type="text"
                  value={author}
                  name="Author"
                  onChange={({ target }) => setAuthor(target.value)}
                />
              </td>
            </tr>
            <tr>
              <th> Url: </th>
              <td>
                <input
                  id="url"
                  type="text"
                  value={url}
                  name="Url"
                  onChange={({ target }) => setUrl(target.value)}
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <button id="add" type="submit">
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

AddBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default AddBlogForm;
