const multer = require("multer")
const {GridFsStorage} = require('multer-gridfs-storage');

const DB = "mongodb+srv://";//mongodb like here

const storage = new GridFsStorage({
    url: DB,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
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