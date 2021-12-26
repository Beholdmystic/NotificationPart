const { body } = require("express-validator");
const User = require("../Model/user");

const notificationValidation = () => {
  return [
    //we are using custom value for validation of id referenced from user.
    body("receiver").custom(async (value) => {
      const user = await User.findById(value);
      if (!user) {
        return Promise.reject("User is not found");
      }
    }),

    body("message")
      .isString()
      .withMessage("Not a valid message")
      .isLength({ min: 10, max: 250 })
      .withMessage(
        "Message must exceed 10 charcter long and should be less than 250"
      ),

    body("type").isString().withMessage("Not a valid type"),

    body("context").isString().withMessage("Must be String"),
  ];
};

const editNotificationValidation = () => {
  return [
    body("receiver")
      .optional()
      .custom((value) => {
        return User.findById(value).then((user) => {
          if (user) {
            return Promise.reject("Id is already in use");
          }
        });
      })
      .isLength({ min: 4 })
      .withMessage("Receiver name must be at least 4 charcter long."),

    body("message")
      .optional()
      .isString()
      .withMessage("Not a valid message")
      .isLength({ min: 10, max: 250 })
      .withMessage(
        "Message must exceed 10 charcter long and should be less than 250"
      ),

    body("type").optional().isString().withMessage("Not a valid type"),

    body("context").optional().isString().withMessage("Must be String"),
  ];
};

module.exports = {
  notificationValidation,
  editNotificationValidation,
};
