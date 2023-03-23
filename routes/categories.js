const express = require("express")
const mongoose = require("mongoose")
const Category = require("../models/category_model")

const categoryRouter = express.Router()

categoryRouter.get("/categories", async (req, res) =>{
    const categories = await Category.find();
    res.send(categories)
})

categoryRouter.post("/newCategory", async (req, res) => {
    const{title} = req.body;
    const category = await Category.find({title});
    console.log(category);
    if(!category || category.length == 0){
        console.log("was empty")
        const category = Category({"title": title});
        category.save();
        res.send(category);
    }else{
        res.send("The \"" + title + "\" category already exists")
    }
})

module.exports = categoryRouter;