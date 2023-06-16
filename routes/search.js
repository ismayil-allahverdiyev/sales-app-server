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

searchRouter.get("/api/filteredSearch", async (req, res) => {
    try{
        const token = req.query.token;
        const categories = req.query.categories;
        const keyword = req.query.keyword;
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;

        const user = await jwtVerifier(token)
        if(!user){
            return res.status(404).json({
                msg: "User not found!",
            })
        }

        const priceFilter = {};

        if (minPrice != undefined && maxPrice != undefined) {
            console.log("HEHE Both not undefined")
            priceFilter.price = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice !== undefined) {
            priceFilter.price = { $gte: minPrice };
        } else if (maxPrice !== undefined) {
            priceFilter.price = { $lte: maxPrice };
        }

        var posters = await Poster.find({
            category: {$regex: typeof categories == undefined || categories == null ? "" : categories.join('|'), $options: "i"},
            title: {$regex: typeof keyword == undefined || keyword == null ? "" : keyword, $options: "i"},
            ...priceFilter,
        })
        return res.status(200).json(posters)
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

module.exports = searchRouter