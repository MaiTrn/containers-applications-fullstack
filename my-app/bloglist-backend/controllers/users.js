const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const body = request.body;

  //check password
  if (!body.password) {
    return response.status(400).json({
      error: "User validation failed: Path `password` is required.",
    });
  }
  if (body.password.length < 3) {
    return response.status(400).json({
      error:
        "User validation failed: Path `password` is shorter than the minimum allowed length (3).",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    name: body.name,
    username: body.username,
    passwordHash,
  });

  const savedUser = await user.save();
  response.json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  });
  response.json(users);
});

module.exports = usersRouter;
