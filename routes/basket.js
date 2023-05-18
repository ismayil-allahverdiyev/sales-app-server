const express = require("express")
const mongoose = require("mongoose")
const { jwtVerifier } = require("../controllers/auth_controller")
const Poster = require("../models/poster_model")
const User = require("../models/user")

const basketRouter = express.Router()

basketRouter.post("/basket/addToBasket", async (req, res) => {
    const {token, posterId} = req.body

    const user = await jwtVerifier(token)
    console.log("USER is " + user)
    if(!user){
        return res.status(400).json({
            msg: "User not found!",
        })
    }

    const poster = await Poster.findById(posterId)

    if(!poster){
        return res.status(400).json({
            msg: "Poster not found!",
        })
    }

    const posterInfo = {
        id: poster.id,
        description: poster.title,
        price: poster.price,
    }
    console.log("Basket includes " + user.basket);
    console.log("Is in there " + user.basket.includes(posterInfo));
    
    const updatedUser = await user.update(
        
        {$push: {
            basket: posterInfo
            },
        },
    )
    console.log("Update is " + updatedUser)
    return res.json(updatedUser)
})

basketRouter.post("/basket/removeFromBasket", async (req, res) => {
    const {token, posterId} = req.body

    const user = await jwtVerifier(token)
    console.log("USER is " + user)
    if(!user){
        return res.status(400).json({
            msg: "User not found!",
        })
    }

    const poster = await Poster.findById(posterId)

    if(!poster){
        return res.status(400).json({
            msg: "Poster not found!",
        })
    }

    const posterInfo = {
        id: poster.id,
        description: poster.title,
        price: poster.price,
    }
    console.log("Basket includes " + user.basket);
    console.log("Is in there " + user.basket.includes(posterInfo));
    
    const updatedUser = await user.update(
        
        {$pull: {
            basket: posterInfo
            },
        },
    )
    console.log("Update is " + updatedUser)
    return res.json(updatedUser)
})

module.exports = basketRouter;