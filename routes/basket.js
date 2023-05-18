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
    console.log("Basket includes " + user.basket[0] + "\nPosterinfo " + posterInfo);
    console.log("Basket includes2 " +(user.basket[0] == posterInfo));
    console.log("Is in there " + user.basket.includes({
        id: '64281cfa067266a6aaad834a',
        description: 'Nature 1',
        price: '45.0'
    },));
    
    const updatedUser = await user.updateOne(
        
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
    console.log("USER is " + user.basket.length)
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
    console.log("Basket includes " + user.basket[0] + "\nPosterinfo " + posterInfo);
    console.log("Is in there " + user.basket.includes({
        id: '64281cfa067266a6aaad834a',
        description: 'Nature 1',
        price: '45.0'
    },));
    
    const updatedUser = await user.updateOne(
        
        {$pull: {
            basket: posterInfo
            },
        },
    )
    console.log("Update is " + updatedUser)
    return res.json(updatedUser)
})

module.exports = basketRouter;