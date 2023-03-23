const express = require("express");
const Poster = require("../models/poster_model.js");
const User = require("../models/user.js");
const mongoose = require("mongoose")
const upload = require("../middlewares/upload")
const uploadGfs = require("../middlewares/gfsUpload")

const posterRouter = express.Router();

const videoUrl = "https://aisha-sales-app.herokuapp.com/api/videos/"
const imageUrl = "https://aisha-sales-app.herokuapp.com/api/images/"


posterRouter.get("/api/getAllPostersByTitle", async (req, res)=>{
    const{categorie} = req.body;
    console.log(categorie);
    const poster = await Poster.find({categorie});
    console.log(poster);
    if(!poster){
        res.status(404).json({
            msg: "List is empty!"
        });
    }
    res.json(
        poster
    )
})

posterRouter.get("/api/getAllPosters", async (req, res)=>{
    const poster = await Poster.find({});
    console.log(poster);
    if(!poster){
        res.status(404).json({
            msg: "List is empty!"
        });
    }
    res.json(
        poster
    )
})

posterRouter.post("/api/addPoster", uploadGfs.array("image"), async (req, res)=>{
    console.log("QUQU")
    const{userId, categorie, price, title} = req.body;
    console.log(userId);
    const objId = mongoose.Types.ObjectId(userId)
    const user = await User.findById(userId);
    console.log("objId " + user);
    if(!user){
        res.status(404).json({
            msg: "The current user does not exist!"
        });
    }else{
        console.log(user);
        let poster = Poster({
            userId,
            categorie, 
            price, 
            title,
            "image": []
        })
        console.log(req.body.image);
        console.log("file " +  req.files[0])
        if(req.files){
            let images = []
            req.files.forEach((element) => {
                console.log(element.filename)
                images.push(imageUrl + element.filename)
            })
            poster.image = images
        }
        poster = await poster.save();
        console.log("Poster is " + poster);
        res.json(poster);
    }
})

posterRouter.post("/api/addVideoPoster", uploadGfs.single("video"), async (req, res)=>{
    const{userId, categorie, price, title} = req.body;
    console.log(userId);
    const objId = mongoose.Types.ObjectId(userId)
    const user = await User.findById(userId);
    console.log(objId);
    if(1==0){
        res.status(404).json({
            msg: "The current user does not exist!"
        });
    }else{
        console.log(user);
        let poster = Poster({
            userId,
            categorie, 
            price, 
            title,
            "image": ""
        })
        console.log(req.body.video);
        console.log(videoUrl+req.file.filename)
        if(req.file){
            poster.image = videoUrl+req.file.filename
        }
        poster = await poster.save();
        console.log("Poster is " + poster);
        res.json(poster);
    }
})

module.exports = posterRouter;
