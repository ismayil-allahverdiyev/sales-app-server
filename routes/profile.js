const express = require("express");
const mongoose = require("mongoose")
const User = require("../models/user.js");
const index = require("../index")

const { jwtVerifier } = require("../controllers/auth_controller.js");

const profileRouter = express.Router();

profileRouter.get("/api/profile/getProfileInfo", async (req, res) => {
    try{
        const {token} = req.query;

        const user = await jwtVerifier(token)

        if (user) {
            res.status(200).json(user)
        } else {
            res.status(400).json({
                msg: "User not found",
            })
        }
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }

})