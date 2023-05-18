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
    
    for(const basketPoster of user["basket"]){
        if(basketPoster["id"] == poster.id){
            return res.status(400).json({
                msg: "Poster already in the basket!",
            })
        }
    }
    
    
    const updatedUser = await user.updateOne(
        
        {$push: {
            basket: posterInfo
            },
        },
    )
    return res.json(updatedUser)
})

basketRouter.post("/basket/removeFromBasket", async (req, res) => {
    const {token, posterId} = req.body

    const user = await jwtVerifier(token)
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
    
    const updatedUser = await user.updateOne(
        
        {$pull: {
            basket: posterInfo
            },
        },
    )
    return res.json(updatedUser)
})

module.exports = basketRouter;