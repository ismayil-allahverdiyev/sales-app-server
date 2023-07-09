const express = require("express");
const Poster = require("../models/poster_model.js");
const User = require("../models/user.js");
const mongoose = require("mongoose")

const index = require("../index")

const posterImageUploadGfs = require("../middlewares/posterImageGfsUpload");
const Category = require("../models/category_model.js");
const compressImages = require("../middlewares/compressor.js");
const { jwtVerifier } = require("../controllers/auth_controller.js");

const posterRouter = express.Router();

const videoUrl = "https://aisha-sales-app.herokuapp.com/api/videos/"
const imageUrl = "https://aisha-sales-app.herokuapp.com/api/posterImage/"


posterRouter.get("/api/getAllPostersByTitle", async (req, res)=>{
    try{
        const{category} = req.body;
        console.log(category);

        const poster = await Poster.find({category});
        console.log(poster);
        if(!poster){
             return res.status(404).json({
                msg: "List is empty!"
            });
        }
        return res.json(
            poster
        );
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

posterRouter.get("/api/getAllPosters", async (req, res)=>{
    try{
        const poster = await Poster.find({});
        console.log(poster);
        if(!poster){
            return res.status(404).json({
                msg: "List is empty!"
            });
        }
        return res.json(
            poster
        );
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

posterRouter.post("/api/getPostersByCategory", async (req, res)=>{

    try{
        const{title} = req.body;
        console.log("req.body " + title);

        const categoryExists = await Category.findOne({title})
        console.log("categoryExists " + categoryExists)

        if(!categoryExists){
            return res.status(404).json({
                msg: "Category does not exist!"
            });
        }else{
            const poster = await Poster.find({"category": title});
            console.log(poster);
            if(!poster){
                return res.status(404).json({
                    msg: "List is empty!"
                });
            }else{
                return res.json(
                    poster
                );
            }
        }
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})


posterRouter.get("/api/poster/getPosterById", async (req, res)=>{
    try{
        const posterId = req.query.posterId;
        console.log("req.body " + posterId);

        const poster = await Poster.findById(posterId)

        if(!poster){
            return res.status(404).json({
                msg: "poster does not exist!"
            });
        }else{ 
            return res.json(
                poster
            );
        }
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

posterRouter.post("/api/addPoster", posterImageUploadGfs.array("image"), async (req, res)=>{
    try{
        console.log("QUQU")
        const{token, category, price, title, coverImage, colorPalette} = req.body;
        console.log("req.body " + category);

        const categoryExists = await Category.findOne({"title": category})

        console.log("categoryExists " + categoryExists);

        if(!categoryExists){
            return res.status(404).json({
                msg: "Category does not exist!"
            });
        }

        const user = await jwtVerifier(token);
        console.log("objId " + categoryExists);
        if(!user){
            return res.status(404).json({
                msg: "The current user does not exist!"
            });
        }else{
            console.log(user);

            let poster = Poster({
                category, 
                price, 
                title,
                "image": [],
                coverImage,
                colorPalette,
            })

            console.log(req.body.image);
            console.log("file " +  req.files[0])
            if(req.files){
                let images = []
                req.files.forEach(async (element) => {
                    const file = element;
                    const buffer = await getStream.buffer(element.stream);
                    images.push(imageUrl + element.filename)
                    if(element.filename == coverImage){
                        poster.coverImage = imageUrl + element.filename;
                    }
                })
                poster.image = images
            }
            poster = await poster.save();

            if(poster){
                const newCatVal = await Category.findOneAndUpdate(
                    {title: category},
                    {$inc : {count: 1}},
                    {new: true },
                )
                console.log("New category: " + newCatVal)
            }

            console.log("Poster is " + poster);
            return res.json(poster);
        }
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

posterRouter.get("/api/posterImage/:filename", (req, res) => {
    try{
        const parFilename = req.params.filename
        console.log(parFilename)

        index.gfs = new mongoose.mongo.GridFSBucket(mongoose.connection, {
            bucketName: "poster_images"
        })

        const file = index.gfs.openDownloadStreamByName(parFilename);
        file.on("error", function(err){
            return res.send("No image found with the given id!")
        });
        file.pipe(res)
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

// posterRouter.post("/api/addVideoPoster", uploadGfs.single("video"), async (req, res)=>{
//     const{userId, categorie, price, title} = req.body;
//     console.log(userId);
//     const objId = mongoose.Types.ObjectId(userId)
//     const user = await User.findById(userId);
//     console.log(objId);
//     if(1==0){
//         res.status(404).json({
//             msg: "The current user does not exist!"
//         });
//     }else{
//         console.log(user);
//         let poster = Poster({
//             userId,
//             categorie, 
//             price, 
//             title,
//             "image": ""
//         })
//         console.log(req.body.video);
//         console.log(videoUrl+req.file.filename)
//         if(req.file){
//             poster.image = videoUrl+req.file.filename
//         }
//         poster = await poster.save();
//         console.log("Poster is " + poster);
//         res.json(poster);
//     }
// })

module.exports = posterRouter;
