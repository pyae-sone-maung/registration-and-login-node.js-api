const express = require("express");
const multer = require("multer");
const cors = require("cors");
const userRoute = require("./src/route/user-route");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().none()); // for form-data/multipart
app.use(cors());
app.use("/", userRoute);

module.exports = app;
