const express = require("express")
const mongoose = require("mongoose")

const index = require("../index")

const imageUploadGfs = require("../middlewares/imageGfsUpload")
const Category = require("../models/category_model")

const categoryRouter = express.Router()

const imageUrl = "https://aisha-sales-app.herokuapp.com/api/categoryCover/"

categoryRouter.get("/categories", async (req, res) =>{
    const categories = await Category.find();
    res.send(categories)
})

categoryRouter.post("/newCategory", imageUploadGfs.single("image"), async (req, res) => {
    const{title} = req.body;
    const category = await Category.find({title});
    console.log(category);
    if(!category || category.length == 0){
        const category = Category({
            "title": title,
            "coverUrl": ""
        });
        if(req.file){
            category.coverUrl = imageUrl + req.file.filename;
            category.save();
            res.send(category);
        }else{
            res.statusCode(422).send({msg: "No cover image!"})
        }
    }else{
        res.statusCode(409).send("The \"" + title + "\" category already exists")
    }
})

categoryRouter.get("/api/categoryCover/:filename", (req, res) => {
    try{
        const parFilename = req.params.filename
        console.log(parFilename)

        index.gfs = new mongoose.mongo.GridFSBucket(mongoose.connection, {
            bucketName: "category_covers"
        })

        const file = index.gfs.openDownloadStreamByName(parFilename);
        file.on("error", function(err){
            res.send("No image found with the given id!")
        });
        file.pipe(res)
    }catch(e){
        console.log(e)
        res.send(e)
    }
})

module.exports = categoryRouter;