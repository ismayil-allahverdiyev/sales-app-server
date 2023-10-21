const express = require("express");
const Poster = require("../models/poster_model.js");
const mongoose = require("mongoose")

const index = require("../index")

const posterImageUploadGfs = require("../middlewares/posterImageGfsUpload");
const Category = require("../models/category_model.js");
const { jwtVerifier } = require("../controllers/auth_controller.js");
const { colorUploader } = require("../controllers/color_controller.js");
const uploadGfs = require("../middlewares/uploadGfs");

const posterRouter = express.Router();

const videoUrl = "https://aisha-sales-app.herokuapp.com/api/videos/"
const imageUrl = "https://aisha-sales-app.herokuapp.com/api/posterImage/"

posterRouter.get("/api/getAllPosters", async (req, res) => {
    try {
        const poster = await Poster.find({}).sort('-_id');
        console.log(poster);
        if (!poster) {
            return res.status(404).json({
                msg: "List is empty!"
            });
        }
        return res.json(
            poster
        );
    } catch (e) {
        return res.status(500).json({
            error: e.message
        })
    }
})

posterRouter.get("/api/getAllPostersByTitle", async (req, res) => {
    try {
        const { category } = req.body;
        console.log(category);

        const poster = await Poster.find({ category });
        console.log(poster);
        if (!poster) {
            return res.status(404).json({
                msg: "List is empty!"
            });
        }
        return res.json(
            poster
        );
    } catch (e) {
        return res.status(500).json({
            error: e.message
        })
    }
})

posterRouter.post("/api/getPostersByCategory", async (req, res) => {

    try {
        const { title } = req.body;
        console.log("req.body " + title);

        const categoryExists = await Category.findOne({ title })
        console.log("categoryExists " + categoryExists)

        if (!categoryExists) {
            return res.status(404).json({
                msg: "Category does not exist!"
            });
        } else {
            const poster = await Poster.find({ "category": title });
            console.log(poster);
            if (!poster) {
                return res.status(404).json({
                    msg: "List is empty!"
                });
            } else {
                return res.json(
                    poster
                );
            }
        }
    } catch (e) {
        return res.status(500).json({
            error: e.message
        })
    }
})

posterRouter.get("/api/poster/getPosterById", async (req, res) => {
    try {
        const posterId = req.query.posterId;
        console.log("req.body " + posterId);

        const poster = await Poster.findById(posterId)

        if (!poster) {
            return res.status(404).json({
                msg: "poster does not exist!"
            });
        } else {
            return res.json(
                poster
            );
        }
    } catch (e) {
        return res.status(500).json({
            error: e.message
        })
    }
})

posterRouter.post("/api/addPoster", posterImageUploadGfs.array("image"), async (req, res) => {
    try {
        console.log("1")
        const { token, category, price, title, colorPalette } = req.body;
        console.log("2");

        const categoryExists = await Category.findOne({ "title": category })

        console.log("3");

        if (!categoryExists) {
            return res.status(404).json({
                msg: "Category does not exist!"
            });
        }
        console.log("4 " + colorPalette[0]["colorName"]);
        //logs added to check poster adding
        const result = await colorUploader(colorPalette)
        console.log("ress " + result);

        if (!result) {
            return res.status(500).json({
                error: "Something went wrong!"
            })
        }

        let colors = [];
                console.log("another  " + colorPalette[0]["colorName"]);

        console.log("ress " + JSON.stringify(colorPalette));

        for (const element of colorPalette) {
                                            console.log("ress 1111");

                                console.log("ress " + JSON.stringify(colorPalette));

                    console.log("ress " + JSON.stringify(element["hexCode"]));

            colors.push(JSON.stringify(element["hexCode"]))
        }

        const user = await jwtVerifier(token);

        if (!user) {
            return res.status(404).json({
                msg: "The current user does not exist!"
            });
        } else {
            console.log("6");

            let poster = Poster({
                category,
                price,
                title,
                "image": [],
                "coverImage": "",
                "colorPalette": colors,
            })

            console.log(req.body.image);
            console.log("file " + req.files[0])
            if (req.files) {
                console.log("7");

                let images = []
                req.files.forEach(async (element) => {
                    console.log("file looper");

                    images.push(imageUrl + element.filename)

                })

                poster.coverImage = images[0];
                console.log("8");

                poster.image = images
            }

            poster = await poster.save();
            console.log("9");


            if (poster) {
                const newCatVal = await Category.findOneAndUpdate(
                    { title: category },
                    { $inc: { count: 1 } },
                    { new: true },
                )
                console.log("New category: " + newCatVal)
            }
            console.log("10");

            console.log("Poster is " + poster);
            return res.json(poster);
        }
    } catch (e) {
        return res.status(500).json({
            error: e.message
        })
    }
})

posterRouter.get("/api/posterImage/:filename", (req, res) => {
    try {
        const parFilename = req.params.filename
        console.log(parFilename)

        index.gfs = new mongoose.mongo.GridFSBucket(mongoose.connection, {
            bucketName: "poster_images"
        })

        const file = index.gfs.openDownloadStreamByName(parFilename);
        file.on("error", function (err) {
            return res.send("No image found with the given id!" + err)
        });
        file.pipe(res)
    } catch (e) {
        return res.status(500).json({
            error: e.message
        })
    }
})

posterRouter.get("/api/files/:filename", (req, res) => {
    try{
        console.log("file search func")
        const parFilename = req.params.filename
        console.log(parFilename)

        index.gfs.find({filename: parFilename}).toArray((err, files) =>{
            if(err){
                res.status(200).send(err);
                return;
            }
            if (!files) {
                res.status(404).send("No video uploaded!");
                return;
            }
            console.log(files[0].length + "");


            // Create response headers
            // const range = files[0].length; //getting the length of the first found file
            const videoSize = files[0].length;
            const start = 0;

            const end = videoSize - 1;

            const contentLength = end - start + 1;

            console.log(videoSize+" videoSize"+start+" start")

            const headers = {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": contentLength,
                "Content-Type": "video/mp4",
            };

            console.log(" 1 ")
            // HTTP Status 206 for Partial Content
            res.writeHead(206, headers);
            console.log(" 2 ")
            console.log(" 3 ")
            const downloadStream = index.gfs.openDownloadStreamByName(parFilename, {
                start
            });
            console.log(downloadStream)
            console.log(" 4 ")
            // Finally pipe video to response
            downloadStream.pipe(res);
            console.log(" 5 ")
        });
    }catch(e){
        console.log(e)
        res.send(e)
    }
})

posterRouter.post("/api/addVideoPoster", uploadGfs.single("video"), async (req, res)=>{
    console.log("Add video func")
    const{userId, categorie, price, title} = req.body;
    console.log(userId);
    const objId = mongoose.Types.ObjectId(userId)
    //const user = await User.findById(userId);
    console.log(objId);
    if(!userId){//check user here
        res.status(404).json({
            msg: "The current user does not exist!"
        });
    }else{
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
