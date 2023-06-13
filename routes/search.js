const express = require("express");
const Category = require("../models/category_model");
const Poster = require("../models/poster_model");

const searchRouter = express.Router();

searchRouter.get("/api/search", async (req, res) => {
    try{
        const token = req.query.token;
        const keyword = req.query.keyword;

        const user = await jwtVerifier(token)
        if(!user){
            return res.status(404).json({
                msg: "User not found!",
            })
        }

        var categories = await Category.find({"title": keyword})
        var posters = await Poster.find({"title": keyword})
        
        return res.status(200).json({
            "posters" : posters,
            "categories" : categories,
        })
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

module.exports = searchRouter