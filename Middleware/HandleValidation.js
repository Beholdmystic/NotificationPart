const { validationResult } = require("express-validator");
// const { CustomError } = require("../helpers");
module.exports = function (req, res, next) {
  let allErrors = {};
  const { errors } = validationResult(req);
  if (errors.length < 1) {
    return next();
  }
  errors.forEach((error) => {
    allErrors[error.param] = error.msg;
  });
  console.log(allErrors);
  // next(new CustomError(allErrors, 400));
  return res.status(400).send({ status: "fail", data: allErrors });
};
