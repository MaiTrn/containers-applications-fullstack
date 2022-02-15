const mongoose = require("mongoose");
const supertest = require("supertest");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("../utils/test_helper");
const bcrypt = require("bcrypt");
const app = require("../app");
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const user = await User.findOne({ username: "root" });

  for (let b of helper.initialBlogs) {
    let blogObj = new Blog({ ...b, userId: user.id });
    await blogObj.save();
  }
});

const login = async () => {
  const user = {
    username: "root",
    password: "sekret",
  };

  const response = await api.post("/api/login").send(user);
  return response.body.token;
};

describe("logging a user in", () => {
  test("succeeds with correct username and password", async () => {
    const user = {
      username: "root",
      password: "sekret",
    };

    await api
      .post("/api/login")
      .send(user)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("returns correct status code if username or password is wrong", async () => {
    const user = {
      username: "root",
      password: "seret",
    };

    await api
      .post("/api/login")
      .send(user)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });
});

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as JSON ", async () => {
    const token = await login();

    await api
      .get("/api/blogs")
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("all blogs are returned", async () => {
    const token = await login();
    const response = await api
      .get("/api/blogs")
      .set("Authorization", "bearer " + token);
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
  test("identifier of the blogs is named id", async () => {
    const token = await login();
    const response = await api
      .get("/api/blogs")
      .set("Authorization", "bearer " + token);
    const blogs = response.body;

    blogs.forEach((blog) => expect(blog.id).toBeDefined());
  });
  test("identifier of the blogs is unique", async () => {
    //creating a unique checker
    expect.extend({
      toBeUnique(received) {
        const pass =
          Array.isArray(received) && new Set(received).size === received.length;
        if (pass) {
          return {
            message: () => `expected [${received}] array is unique`,
            pass: true,
          };
        } else {
          return {
            message: () => `expected [${received}] array is not unique`,
            pass: false,
          };
        }
      },
    });

    const token = await login();
    const response = await api
      .get("/api/blogs")
      .set("Authorization", "bearer " + token);
    const ids = response.body.map((blog) => blog.id);

    expect(ids).toBeUnique();
  });
});

describe("addition of a new blog", () => {
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
    };

    const token = await login();
    await api
      .post("/api/blogs")
      .set("Authorization", "bearer " + token)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogs = await helper.blogsInDB();
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
    expect(blogs).toContainEqual(expect.objectContaining(newBlog));
  });
  test("has likes equals 0 if likes property is missing", async () => {
    const newBlog = {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    };

    const token = await login();
    await api
      .post("/api/blogs")
      .set("Authorization", "bearer " + token)
      .send(newBlog);
    const blogs = await helper.blogsInDB();
    const lastAddedBlog = blogs[blogs.length - 1];
    expect(lastAddedBlog.likes).toEqual(0);
  });
  test("fails with status code 400 if data is invaild", async () => {
    const newBlog = {
      author: "Robert C. Martin",
      likes: 12,
    };
    const token = await login();
    await api
      .post("/api/blogs")
      .set("Authorization", "bearer " + token)
      .send(newBlog)
      .expect(400);
  });
  test("fails with status code 401 if a token is not provided", async () => {
    const newBlog = {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 12,
    };
    await api.post("/api/blogs").send(newBlog).expect(401);
  });
});

describe("updating a blog", () => {
  test("returns the updated blog if it is valid", async () => {
    const blogs = await helper.blogsInDB();
    const blogToUpdate = blogs[0];
    const update = {
      likes: 9,
    };

    const token = await login();
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", "bearer " + token)
      .send(update)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd[0].likes).toEqual(update.likes);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogs = await helper.blogsInDB();
    const blogToDelete = blogs[0];

    const token = await login();
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", "bearer " + token)
      .expect(204);
    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const ids = blogsAtEnd.map((b) => b.id);
    expect(ids).not.toContain(blogToDelete.id);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
