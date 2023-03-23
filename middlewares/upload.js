const path = require("path")
const multer = require("multer")
const uuid = require("uuid")

var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads/")
    },
    filename: (req, file, callback) => {
        let ext = path.extname(file.originalname)
        const { v4: uuidv4 } = require('uuid');
        uuidv4();
        console.log(uuidv4());
        callback(null, uuidv4() + ext)
    }
})

var upload = multer({
    storage: storage,
    fileFilter: (req, file, callback)=>{
        console.log("Multer worked");
        if(file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "video/mp4"){
            callback(null, true)
        }else{
            console.log("Only jpg, jpeg, mp4 and png files are allowed!")
            callback(null, false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 30
    }
})

module.exports = upload