const express = require("express");
const Comment = require("../models/comment_model");
const index = require("../index")

const authController = require("../controllers/auth_controller");
const Poster = require("../models/poster_model");
const { default: mongoose } = require("mongoose");

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

commentsRouter.get("/comments/getCommentsById", async (req, res) => {
    const posterId = req.query.posterId;

    try{
        console.log("Try catch")
        const poster = await Poster.findById("64281cfa067266a6aaad834a");
        console.log(poster.id)

        if(!poster){
            return res.status(400).json({
                msg: "Poster not found!"
            });
        }
        
        const comments = await Comment.find({"posterId" : poster.id})

        return comments
    }catch(e){
        return res.status(400).json({
            err: e
        })
    }
})

async function monitoringComments(client, pipeline = []) {

    console.log("in the monitoring");
    const collection = client;
    console.log("collection added");

    const changeStream = collection.watch(pipeline);
    console.log("changeStream added");

    try{
        console.log("trying changeStream hasnext");

        while(await changeStream.hasNext()){
            console.log("has hasnext");

            console.log(await changeStream.next());
        }
    }catch(e){
        if(changeStream.closed){
            console.log("The change stream is closed");
        }else{
            console.log(e);
            req.json(e);
            throw e;
        }
    }
}

module.exports = commentsRouter;