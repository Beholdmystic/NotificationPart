const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Notification = mongoose.model(
  "Notification",
  new mongoose.Schema(
    {
      receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },

      //Entity will help us to know what the notification is about.
      message: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 250,
      },
      //Entity types are the different types of notifications.
      type: {
        type: String,
        required: true,
      },

      context: {
        type: String,
        required: false,
      },

      read: {
        type: Date,
        default: null,
      },
    },
    { timestamps: true } //express-timestamp creates a new moment when a new request is recived.
  )
);

module.exports = Notification;
