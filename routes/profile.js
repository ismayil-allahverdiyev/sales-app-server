const express = require("express");

const { jwtVerifier } = require("../controllers/auth_controller.js");

const profileRouter = express.Router();

profileRouter.get("/api/profile/getProfileInfo", async (req, res) => {
    try{
        const token = req.query.token;

        const user = await jwtVerifier(token)

        if (user) {
            res.status(200).json({
                name: user.name,
                imageUrl: user.imageUrl,
                type: user.type,
            })
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

module.exports = profileRouter