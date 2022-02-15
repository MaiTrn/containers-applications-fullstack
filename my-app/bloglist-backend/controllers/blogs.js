const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("userId", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});
blogsRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id).populate("userId", {
    username: 1,
    name: 1,
  });
  if (blog) {
    response.json(blog);
  } else {
    response
      .status(404)
      .json({ error: `cannot find blog with id ${id}` })
      .end();
  }
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    userId: user._id,
  });

  const addedBlog = await blog.save();
  user.blogs = user.blogs.concat(addedBlog._id);
  await user.save();

  response.status(201).json(addedBlog);
});
blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const id = request.params.id;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {
    new: true,
  });

  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const user = await request.user;
  const blog = await Blog.findById(id);
  if (!blog) {
    response
      .status(404)
      .json({ error: `cannot find blog with id ${id}` })
      .end();
  }
  if (blog.userId.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(id);
    response.status(204).end();
  } else
    response
      .status(401)
      .json({ error: "You don't have the permission to delete this blog" })
      .end();
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  if (!blog) {
    response
      .status(404)
      .json({ error: `cannot find blog with id ${id}` })
      .end();
  }
  blog.comments = blog.comments.concat(request.body.comment);
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

module.exports = blogsRouter;
