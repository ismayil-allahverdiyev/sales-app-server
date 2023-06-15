const express = require("express");
const Category = require("../models/category_model");
const Poster = require("../models/poster_model");
const { jwtVerifier } = require("../controllers/auth_controller");

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

        var categories = await Category.find({title: {$regex: keyword, $options: "i"}})
        var posters = await Poster.find({title: {$regex: keyword, $options: "i"}})
        
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

searchRouter.get("/api/searchByCategories", async (req, res) => {
    try{
        const token = req.query.token;
        const categories = req.query.categories;

        const user = await jwtVerifier(token)
        if(!user){
            return res.status(404).json({
                msg: "User not found!",
            })
        }

        var posters = await Poster.find({category: {$regex: categories.join('|'), $options: "i"}})
        
        return res.status(200).json(posters)
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

searchRouter.get("/api/filteredSearch", async (req, res) => {
    try{
        const token = req.query.token;
        const categories = req.query.categories;
        const keyword = req.query.keyword;
        const minPrice = req.query.keyword;
        const maxPrice = req.query.keyword;

        const user = await jwtVerifier(token)
        if(!user){
            return res.status(404).json({
                msg: "User not found!",
            })
        }

        var posters = await Poster.find({
            category: {$regex: !categories ? [] : categories.join('|'), $options: "i"},
            title: {$regex: !keyword ? "" : keyword, $options: "i"}
        })
        
        return res.status(200).json(posters)
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

module.exports = searchRouter