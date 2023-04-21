const express = require("express");
const Comment = require("../models/comment_model");

const authController = require("../controllers/auth_controller");
const Poster = require("../models/poster_model");

const commentsRouter = express.Router();

commentsRouter.post("/comments/addComment", async (req, res) => {
    const {token, email, description, posterId} = req.body;

    const poster = await Poster.findById(posterId);

    if(!poster){
        return res.status(400).json({
            msg: "Poster not found!"
        });
    }

    const user = await authController.jwtVerifier(token);

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
            "posterId" : poster.id,
        });

        console.log("comment is " + comment);

        comment = await comment.save();

        console.log("saved comment is " + comment);

        return res.status(200).json(comment);
    } catch (error) {
        return res.status(400).send(error);
    }
})

commentsRouter.get("/comments/getCommentsById", (req, res) => {
    const posterId = req.params.posterId;
    console.log("posterId " + req.params.posterId);
    res.json(posterId)
})

module.exports = commentsRouter;