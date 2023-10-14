const express = require("express")
const mongoose = require("mongoose")
const { jwtVerifier } = require("../controllers/auth_controller")
const Poster = require("../models/poster_model")
const User = require("../models/user")

const basketRouter = express.Router()

basketRouter.post("/api/basket/addToBasket", async (req, res) => {
    try{
        const {token, posterId} = req.body

        const user = await jwtVerifier(token)
        console.log("USER is " + user)
        if(!user){
            return res.status(404).json({
                msg: "User not found!",
            })
        }

        const poster = await Poster.findById(posterId)

        if(!poster){
            return res.status(404).json({
                msg: "Poster not found!",
            })
        }

        const posterInfo = {
            id: poster.id,
            description: poster.title,
            price: poster.price,
            image:poster.image,
            colorPalette:poster.colorPalette,
        }
        
        for(const basketPoster of user["basket"]){
            if(basketPoster["id"] == poster.id){
                return res.status(404).json({
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
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

basketRouter.post("/api/basket/removeFromBasket", async (req, res) => {
    try{
        const {token, posterId} = req.body

        const user = await jwtVerifier(token)
        if(!user){
            return res.status(404).json({
                msg: "User not found!",
            })
        }

        const poster = await Poster.findById(posterId)

        if(!poster){
            return res.status(404).json({
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
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

basketRouter.post("/api/basket/emptyBasket", async (req, res) => {
    try{
        const {token} = req.body

        const user = await jwtVerifier(token)
        if(!user){
            return res.status(404).json({
                msg: "User not found!",
            })
        }

        const updatedUser = await user.updateOne(
            
            {$set: {
                basket: []
                },
            },
        )
        return res.json(updatedUser)
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

basketRouter.post("/api/basket/isInTheBasket", async (req, res) => {
    try{
        const {token, posterId} = req.body

        const user = await jwtVerifier(token)
        if(!user){
            return res.status(404).json({
                msg: "User not found!",
            })
        }

        const poster = await Poster.findById(posterId)

        if(!poster){
            return res.status(404).json({
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
                return res.status(200).json({
                    msg: "Poster is in the basket!",
                })
            }
        }
        
        return res.status(200).json({
            msg: "Poster is not in the basket!",
        })
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

basketRouter.get("/api/basket/info", async (req, res) => {
    try{
        const token = req.query.token;

        const user = await jwtVerifier(token)
        if(!user){
            return res.status(404).json({
                msg: "User not found!",
            })
        }
        
        return res.status(200).json(user["basket"])
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

module.exports = basketRouter;