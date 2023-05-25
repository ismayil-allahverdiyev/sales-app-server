const express = require("express")
const mongoose = require("mongoose")
const { validate } = require("../models/user")
const { jwtVerifier } = require("../controllers/auth_controller")
const User = require("../models/user")

const favouriteRouter = express.Router()

favouriteRouter.post("/api/addToFavourites", async (req, res) => {
    const{posterId, token} = req.body
    
    const user = await jwtVerifier(token)

    if(!user){
        return res.status(400).json({
            "msg": "User not found!",
        })
    }

    if(user.favourites.includes(posterId)){
        return res.status(400).json({
            "msg": "Poster is already in favourites!",
        })
    }

    const updatedUser = await User.findOneAndUpdate(
        user.id,
        {
            $push: {
                favourites: token
            }
        }
    )

    return res.json(updatedUser)
})