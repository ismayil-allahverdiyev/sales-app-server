const express = require("express")
const mongoose = require("mongoose")
const { validate } = require("../models/user")
const { jwtVerifier } = require("../controllers/auth_controller")
const User = require("../models/user")
const Poster = require("../models/poster_model")

const favouriteRouter = express.Router()

favouriteRouter.post("/api/addToFavourites", async (req, res) => {
    const{posterId, token} = req.body
    
    const user = await jwtVerifier(token)

    if(!user){
        return res.status(400).json({
            "msg": "User not found!",
        })
    }

    const poster = await Poster.findById(posterId)
    console.log("user.fav " + user.id)
    console.log("user.fav " + user._id)
    console.log("user.fav " + user["_id"])
    console.log(user.favourites)
    console.log("user.fav 2 " + user["favourites"])
    console.log(user["favourites"])
    for(const favourite of user.favourites){
        console.log("addToFavourites1" + favourite)
        console.log("addToFavourites2" + favourite["id"])
        console.log("addToFavourites3" + favourite.id)
        if(favourite["id"] == posterId){
            return res.status(400).json({
                msg: "Poster is already in favourites!",
            })
        }
    }

    const updatedUser = await User.findOneAndUpdate(
        user.id,
        {
            $push: {
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
})

favouriteRouter.post("/api/removeFromFavourites", async (req, res) => {
    const{posterId, image, price, description, token} = req.body
    
    const user = await jwtVerifier(token)

    if(!user){
        return res.status(400).json({
            "msg": "User not found!",
        })
    }

    for(const favourite of user.favourites){
        console.log(favourite)
        console.log(favourite["id"])
        console.log(favourite.id)
        if(favourite["id"] == posterId){
            return res.status(400).json({
                msg: "Poster is already in favourites!",
            })
        }
    }

    const updatedUser = await User.findOneAndUpdate(
        user.id,
        {
            $pull: {
                // favourites: ,
            }
        }
    )

    return res.json(updatedUser)
})

favouriteRouter.post("/api/getFavourites", async (req, res) => {
    const{posterId, image, token} = req.body
    
    const user = await jwtVerifier(token)

    if(!user){
        return res.status(400).json({
            "msg": "User not found!",
        })
    }

    return res.json(user.favourites)
})

module.exports = favouriteRouter