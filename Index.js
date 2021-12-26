const express = require("express");
const mongoose = require("mongoose");
const NotificationRoutes = require("./Routes/notification");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://localhost/firsttask")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/notification", NotificationRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Listening to the port ${process.env.PORT}`);
});
