const express = require("express")
const mongoose = require("mongoose")
const imageUploadGfs = require("../middlewares/imageGfsUpload")
const Category = require("../models/category_model")

const categoryRouter = express.Router()

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
            category.coverUrl = req.file.filename;
            category.save();
            res.send(category);
        }else{
            res.send({msg: "No cover image!"})
        }
    }else{
        res.send("The \"" + title + "\" category already exists")
    }
})

module.exports = categoryRouter;