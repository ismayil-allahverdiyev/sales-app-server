const PORT  = process.env.PORT || 3000;

const DB = process.env.URL;

const express = require("express");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
var Grid = require('gridfs-stream');
const authRouter = require("./routes/auth.js");
const posterRouter = require("./routes/poster.js");
const commentsRouter = require("./routes/comments.js")
const filesRouter = require("./routes/files");
const categoryRouter = require("./routes/categories");

const app = express();

const client = MongoClient(DB);

const connectDatabase = async () => {
    try {      
      await client.connect(DB);
  
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

app.get("/hi", (req, res) => {
    res.send("aaa")
})

app.listen(PORT, "", function (){
    console.log(`Connected to ${PORT}`);
});

module.exports = {
  client
}
