const mongoose = require("mongoose");
const supertest = require("supertest");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const helper = require("../utils/test_helper");
const app = require("../app");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ username: "root", passwordHash });

  await user.save();
});
describe("when there is initially one user in the database", () => {
  test("user is returned correctly", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe("addition of a new user", () => {
  test("creation succeeds with a fresh username", async () => {
    const initialUsers = await helper.usersInDB();
    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toHaveLength(initialUsers.length + 1);

    const userNames = usersAtEnd.map((u) => u.username);
    expect(userNames).toContain(newUser.username);
  });
  test("creation fails with proper statuscode and message if username is already taken", async () => {
    const initialUsers = await helper.usersInDB();
    const newUser = {
      username: "root",
      name: "Matti Luukkainen",
      password: "salainen",
    };
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("`username` to be unique");

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toHaveLength(initialUsers.length);
  });

  test("creation fails with proper statuscode and message if password is missing", async () => {
    const initialUsers = await helper.usersInDB();
    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("Path `password` is required");

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toHaveLength(initialUsers.length);

    const userNames = usersAtEnd.map((u) => u.username);
    expect(userNames).not.toContain(newUser.username);
  });
  test("creation fails with proper statuscode and message if password length too small", async () => {
    const initialUsers = await helper.usersInDB();
    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "ab",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("Path `password` is shorter");

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toHaveLength(initialUsers.length);

    const userNames = usersAtEnd.map((u) => u.username);
    expect(userNames).not.toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if username is missing", async () => {
    const initialUsers = await helper.usersInDB();
    const newUser = {
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    expect(result.body.error).toContain("Path `username` is required");

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toHaveLength(initialUsers.length);
  });
  test("creation fails with proper statuscode and message if username length too small", async () => {
    const initialUsers = await helper.usersInDB();
    const newUser = {
      username: "ml",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "Path `username` (`",
      newUser.username,
      "`) is shorter"
    );

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toHaveLength(initialUsers.length);

    const userNames = usersAtEnd.map((u) => u.username);
    expect(userNames).not.toContain(newUser.username);
  });
});

afterAll(() => mongoose.connection.close());
