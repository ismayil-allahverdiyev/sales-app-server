const mongoose = require("mongoose");
const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Comment = require("../models/comment_model");

const commentsRouter = express.Router();

commentsRouter.post("/comments/addComment", async (req, res) => {
    const {token, email, description} = req.body;

    console.log({
        token,
        description
    });

    const verified = await jwt.verify(token, "passwordKey");

    const user = await User.findById(verified.id);

    console.log("Comparison is " + user)

    if(false){
            return res.status(400).json({
            msg: "Incorrect password!"
        });
    }

    try {

        const date = Date.now();

        let comment = Comment({
            description,
            "userId" : "user.userId",
            "username" : "User Userov",
            "date" : date.toString(),
        });

        return res.status(200).json({
            token,
            description,
            user,
            comment
        });
    } catch (error) {
        return res.status(400).send(error);
    }
})

module.exports = commentsRouter;