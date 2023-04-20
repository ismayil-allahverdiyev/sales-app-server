const mongoose = require("mongoose");
const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Comment = require("../models/comment_model");

const authController = require("../controllers/auth_controller");

const commentsRouter = express.Router();

commentsRouter.post("/comments/addComment", async (req, res) => {
    const {token, email, description} = req.body;

    console.log({
        token,
        description
    });

    const user = authController.jwtVerifier(token);

    console.log("Comparison is " + user)

    if(!user){
            return res.status(400).json({
            msg: "User not found!"
        });
    }

    try {

        const date = Date.now();

        let comment = Comment({
            description,
            "userId" : user.id,
            "username" : user.name,
            "date" : date.toString(),
        });

        comment = await comment.save();

        console.log("comment is " + comment);

        return res.status(200).json(comment);
    } catch (error) {
        return res.status(400).send(error);
    }
})

module.exports = commentsRouter;