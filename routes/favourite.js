const express = require("express")
const mongoose = require("mongoose")
const { validate } = require("../models/user")
const { jwtVerifier } = require("../controllers/auth_controller")
const User = require("../models/user")
const Poster = require("../models/poster_model")

const favouriteRouter = express.Router()

favouriteRouter.post("/api/addToFavourites", async (req, res) => {
    try{
        const{posterId, token} = req.body
    
        const user = await jwtVerifier(token)

        if(!user){
            return res.status(404).json({
                "msg": "User not found!",
            })
        }

        const poster = await Poster.findById(posterId)
        for(const favourite of user.favourites){
            if(favourite["id"] == posterId){
                return res.status(404).json({
                    msg: "Poster is already in favourites!",
                })
            }
        }

        const updatedUser = await user.updateOne(
            {
                $push: {
                    favourites: {
                        "id": posterId,
                        "image": poster.image[0],
                        "price": poster.price,
                        "title": poster.title,
                        "colorPalette": poster.colorPalette,
                    },
                }
            }
        )

        return res.json(updatedUser)
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

favouriteRouter.post("/api/removeFromFavourites", async (req, res) => {
    try{
        const{posterId, token} = req.body
        
        const user = await jwtVerifier(token)

        if(!user){
            return res.status(404).json({
                "msg": "User not found!",
            })
        }

        const poster = await Poster.findById(posterId)

        const updatedUser = await user.updateOne(
            {
                $pull: {
                    favourites: {
                        "id": posterId,
                        "image": poster.image[0],
                        "price": poster.price,
                        "title": poster.title,
                    },
                }
            }
        )

        return res.json(updatedUser)
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

favouriteRouter.get("/api/getFavourites", async (req, res) => {
    try{
        const token = req.query.token;
        const user = await jwtVerifier(token)

        if(!user){
            return res.status(404).json({
                "msg": "User not found!",
            })
        }
        return res.json(user.favourites)
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

favouriteRouter.post("/api/favourite/isInTheFavourites", async (req, res) => {
    try{
        const{posterId, token} = req.body
    
        const user = await jwtVerifier(token)

        if(!user){
            return res.status(404).json({
                "msg": "User not found!",
            })
        }

        const poster = await Poster.findById(posterId)

        if(!poster){
            return res.status(404).json({
                "msg": "poster not found!",
            })
        }

        for(const favourite of user.favourites){
            if(favourite["id"] == posterId){
                return res.status(200).json({
                    inFavourites: true,
                })
            }
        }
        
        return res.status(200).json({
            inFavourites: false,
        })
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
})

module.exports = favouriteRouter
