const Notification = require("../Model/model");
const User = require("../Model/user");
const express = require("express");
const handlerror = require("../Middleware/HandleValidation");
const {
  notificationValidation,
  editNotificationValidation,
} = require("../Validation/validation");

//const { validationResult } = require("express-validator");

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
    //login garna mildena yesma aile lai so dummy data
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
router.delete("/:id", handlerror, async (req, res) => {
  const id = req.params.id;
  try {
    Notification.deleteOne({ _id: id }, (error, result) => {
      if (error) {
        return res
          .status(400)
          .send({ status: "error", message: error.message });
      }
      return res.status(200).send({ status: "Sucess", data: null });
    });
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
      Notification.findOne({ _id: id }, (error, notification) => {
        if (error) {
          return res
            .status(400)
            .send({ status: "error", message: "Something went wrong" });
        }
        if (!notification) {
          return res.status(400).send({
            status: "fail",
            data: { notification: "No notification exist" },
          });
        }
        if (!req.body.message && !req.body.type && req.body.context) {
          return res.status(400).send({
            status: "fail",
            data: { update: "Atleast try to update some field" },
          });
        }
        if (req.body.message) {
          notification.message = req.body.message;
        }
        if (req.body.type) {
          notification.type = req.body.type;
        }
        if (req.body.context) {
          notification.context = req.body.context;
        }

        notification.save((error, result) => {
          if (error) {
            return res
              .status(400)
              .send({ status: "error", message: error.message });
          }
          return res
            .status(200)
            .send({ status: "success", data: { notification: "updated" } });
        });
      });
    } catch (ex) {
      return res
        .status(400)
        .send({ status: "error", message: "Something went pretty wrong" });
    }
  }
);

module.exports = router;
