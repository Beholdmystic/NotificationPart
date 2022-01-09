const Notification = require("../Model/model");
const User = require("../Model/user");
const express = require("express");
const handlerror = require("../Middleware/HandleValidation");
const {
  notificationValidation,
  editNotificationValidation,
} = require("../Validation/validation");

const router = express.Router();

//Rewriting the code with Async Await
//It is based behavior to be written in a cleaner style, avoiding the need to explicitly configure promise chains.

//to get all notification

router.get("/", async (req, res) => {
  try {
    const notification = await Notification.find().populate("receiver", "_id");
    return res
      .status(200)
      .send({ status: "success", data: { notification: notification } });
  } catch (ex) {
    return res
      .status(400)
      .send({ status: "error", message: "Something went wrong" });
  }
});

//to get single notification
router.get("/my", async (req, res) => {
  try {
    req.user = { _id: "61c43c3434551ad2f90007af" };
    const notification = await Notification.find({ receiver: req.user._id });
    return res
      .status(200)
      .send({ status: "success", data: { notification: notification } });
  } catch (ex) {
    return res
      .status(400)
      .send({ status: "error", message: "Cannot get Notification" });
  }
});

//to add/post notice
router.post("/", notificationValidation(), handlerror, async (req, res) => {
  try {
    const receiver = req.receiver;
    console.log(receiver);
    const notificationDetails = {
      message: req.body.message,
      type: req.body.type,
      context: req.body.context,
      receiver: req.body.receiver,
    };

    const notification = new Notification(notificationDetails);
    console.log(notification);
    const result = await notification.save();
    return res.send({ status: "Success", data: { notification: result } });
  } catch (ex) {
    return res.send({ status: "error", message: ex.message });
  }
});

//to delete notice
router.delete("/:id", handlerror, async (req, res) => {
  const id = req.params.id;
  try {
    await Notification.deleteOne({ _id: id });
    return res.status(200).send({ status: "Sucess", data: null });
  } catch (ex) {
    console.log(ex);
    return res.status(404).send({ status: "error", message: ex.message });
  }
});

//to edit notice
router.put(
  "/:id",
  editNotificationValidation(),
  handlerror,
  async (req, res) => {
    const id = req.params.id;
    try {
      const notification = await Notification.findOne({ _id: id });
      if (req.body.message) {
        notification.message = req.body.message;
      }
      if (req.body.type) {
        notification.type = req.body.type;
      }
      if (req.body.context) {
        notification.context = req.body.context;
      }
      notification.save();
      return res
        .status(200)
        .send({ status: "success", data: { notification: "updated" } });
    } catch (ex) {
      return res
        .status(400)
        .send({ status: "error", message: "Something went wrong" });
    }
  }
);

//to find wether the customer have read the notification or not
router.put("/read/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const notification = await Notification.findById(id);
    notification.read = Date.now(); //getting the date of notification read by user
    notification.save();
    return res
      .status(200)
      .send({ status: "success", data: { notification: "read" } });
  } catch (ex) {
    return res
      .status(400)
      .send({ status: "error", message: "Something went wrong" });
  }
});
module.exports = router;
