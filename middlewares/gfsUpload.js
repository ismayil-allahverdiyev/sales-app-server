const crypto = require('crypto');
const path = require('path');
const uuid = require("uuid")
const multer = require("multer")
const {GridFsStorage} = require('multer-gridfs-storage');

const DB = "mongodb+srv://isi:1124816%40isi2003@clusteraisha.fgl4fve.mongodb.net/test";

const storage = new GridFsStorage({
  url: DB,
  file: (req, file) => {
    console.log("GridFsStorage worked")
    return new Promise((resolve, reject) => {
      const { v4: uuidv4 } = require('uuid');
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(uuidv4());
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const uploadGfs = multer({ storage });
module.exports = uploadGfs