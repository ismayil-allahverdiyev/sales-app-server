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
        const minPrice = req.query.keyword;
        const maxPrice = req.query.keyword;

        const user = await jwtVerifier(token)
        if(!user){
            return res.status(404).json({
                msg: "User not found!",
            })
        }

        const filters = {
            category: {$regex: typeof categories == undefined || categories == null ? "" : categories.join('|'), $options: "i"},
            title: {$regex: typeof keyword == undefined || keyword == null ? "" : keyword, $options: "i"},
        }

        let priceFilter = {};

        if (minPrice !== undefined && maxPrice !== undefined) {
            priceFilter = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice !== undefined) {
            priceFilter = { $gte: minPrice };
        } else if (maxPrice !== undefined) {
            priceFilter = { $lte: maxPrice };
        }
        
        console.log("PRIIIICEEFILTEEER " + priceFilter)
        console.log("PRIIIICEEFILTEEER 2 " + priceFilter != {})
        console.log("PRIIIICEEFILTEEER 3 " + priceFilter == {})
        if(priceFilter != {}){

            filters.price = priceFilter
            console.log("PRIIIICEEFILTEEER 4 " + filters)

        }

        var posters = await Poster.find(filters)
        return res.status(200).json(posters)
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

module.exports = searchRouter