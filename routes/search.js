const express = require("express");
const Category = require("../models/category_model");
const Poster = require("../models/poster_model");
const Color = require("../models/color_model");
const { jwtVerifier } = require("../controllers/auth_controller");

const searchRouter = express.Router();

searchRouter.get("/api/search", async (req, res) => {
    try{
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

searchRouter.get("/api/searchCategories", async (req, res) => {
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
        
        return res.status(200).json(categories)
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
        const colorList = req.query.colorList;

        const user = await jwtVerifier(token)
        if(!user){
            return res.status(404).json({
                msg: "User not found!",
            })
        }

        const priceFilter = {};

        if (minPrice !== undefined && maxPrice !== undefined) {
            console.log("HEHE Both not undefined")
            priceFilter.price = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice !== undefined) {
            priceFilter.price = { $gte: minPrice };
        } else if (maxPrice !== undefined) {
            priceFilter.price = { $lte: maxPrice };
        }

        var colors = await Color.find({
            colorName: {$regex: typeof colorList === undefined || colorList == null ? "" : typeof colorList === "string" ? colorList : colorList.join('|'), $options: "i"},
        })

        var hexcodes = []

        for(let element of colors){
            hexcodes.push(element.hexCodes)
        }

        hexcodes = hexcodes.flat().map(element => '"' + element + '"')

        var posters = await Poster.find({
            category: {$regex: typeof categories === undefined || categories == null ? "" : typeof categories  === "string" ? categories : categories.join('|'), $options: "i"},// regex is to like an and it searched for all the queries if it has any or the categories in it
            title: {$regex: typeof keyword === undefined || keyword == null ? "" : keyword, $options: "i"},
            colorPalette: {$in: typeof hexcodes === undefined || hexcodes == null ? [] :  hexcodes},
            ...priceFilter,
        })
        console.log(categories)
        console.log(colorList)
        return res.status(200).json(posters)
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

module.exports = searchRouter