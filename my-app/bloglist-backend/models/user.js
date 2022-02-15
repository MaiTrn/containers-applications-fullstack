const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    unique: true,
    required: true,
    minLength: 3,
  },
  passwordHash: String,
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
});

userSchema.set("toJSON", {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

userSchema.plugin(uniqueValidator);
const User = mongoose.model("User", userSchema);

module.exports = User;
