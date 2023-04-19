

const PORT  = process.env.PORT || 3000;

const DB = process.env.URL;

const express = require("express");
const mongoose = require("mongoose");
var Grid = require('gridfs-stream');
const authRouter = require("./routes/auth.js");
const posterRouter = require("./routes/poster.js");
const commentsRouter = require("./routes/comments.js")
const filesRouter = require("./routes/files");
const categoryRouter = require("./routes/categories");

const app = express();

let db;

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

app.post("/beyza", (req, res) => {
  const{name, surname, isMarried} = req.body;
  const name1 = req.body["name"];
  const surname1 = req.body["surname"];
  const isMarried1 = req.body["isMarried"]
  console.log("");

  res.send({
    "name": name,
    "surname": surname,
    "id": 1,
    "isMarried": isMarried,
    "secondary": {
      "name1": name1,
      "surname1": surname1,
      "isMarried1": isMarried1
    }
  })
})

app.get("/hi", (req, res) => {
    res.send("aaa")
})

app.listen(PORT, "", function (){
    console.log(`Connected to ${PORT}`);
});

// module.exports = {gfs}
