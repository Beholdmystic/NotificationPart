const mongoose = require("mongoose");
const schema = mongoose.Schema;

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 25,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 25,
    },
  })
);

module.exports = User;
