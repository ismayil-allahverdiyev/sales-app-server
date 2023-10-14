const PORT = process.env.PORT || 3000;

const DB = process.env.URL;
// const DB = "mongodb+srv://  @clusteraisha.fgl4fve.mongodb.net/";

const express = require("express");
const mongoose = require("mongoose");

const authRouter = require("./routes/auth.js");
const posterRouter = require("./routes/poster.js");
const commentsRouter = require("./routes/comments.js")
const filesRouter = require("./routes/files");
const categoryRouter = require("./routes/categories");
const basketRouter = require("./routes/basket.js");
const favouriteRouter = require("./routes/favourite.js");
const searchRouter = require("./routes/search.js");
const colorRouter = require("./routes/color.js");
const profileRouter = require("./routes/profile");

const app = express();


const connectDatabase = async () => {
  try {
    await mongoose.connect(DB);

    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDatabase();

mongoose.connection.on('connected', () => {
  module.exports.gfs = new mongoose.mongo.GridFSBucket(mongoose.connection, {
    bucketName: "uploads"
  })
})

app.use(express.json());
app.use(authRouter);
app.use(filesRouter);
app.use(posterRouter);
app.use(categoryRouter);
app.use(commentsRouter);
app.use(basketRouter);
app.use(favouriteRouter);
app.use(searchRouter);
app.use(colorRouter);
app.use(profileRouter);

app.get("/checker", (req, res) => {
  res.send("aaa")
})

app.listen(PORT, "", function () {
  console.log(`Connected to ${PORT}`);
});