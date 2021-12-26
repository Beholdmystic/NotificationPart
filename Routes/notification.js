const Notification = require("../Model/model");
const User = require("../Model/user");
const express = require("express");
const handlerror = require("../Middleware/HandleValidation");
const {
  notificationValidation,
  editNotificationValidation,
} = require("../Validation/validation");

const { validationResult } = require("express-validator");

const router = express.Router();

//to get all notification

router.get("/", async (req, res) => {
  try {
    await Notification.find()
      .populate("receiver", "_id")
      .exec((error, notification) => {
        if (error) {
          return res.status(400).send({ status: "error", message: error });
        } else {
          return res
            .status(200)
            .send({ status: "success", data: { notification: notification } });
        }
      });
  } catch (ex) {
    return res
      .status(400)
      .send({ status: "error", message: "Something went wrong" });
  }
});

//to get single notification
router.get("/my", (req, res) => {
  try {
    req.user = { _id: "61c43c3434551ad2f90007af" };
    //login garna mildena dummy data
    Notification.find({ receiver: req.user._id }, (error, notification) => {
      if (error) {
        return res.status(400).send({
          status: "error",
          message: "Error while getting single Notification",
        });
      } else {
        return res
          .status(200)
          .send({ status: "success", data: { notification: notification } });
      }
    });
  } catch (ex) {
    console.log(ex);
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
router.delete("/:id", notificationValidation, async (req, res) => {
  const id = req.params.id;
  try {
    Notification.deleteOne({ _id: id }, (error, result) => {});
  } catch (ex) {}
});

//to edit notice
router.put("/:id", editNotificationValidation, (req, res) => {});

module.exports = router;
