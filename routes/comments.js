const express = require("express");
const Comment = require("../models/comment_model");

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
        const poster = await Poster.findById(posterId);
        if(!poster){
            return res.status(400).json({
                msg: "Poster not found!"
            });
        }

        const pipe = [
            {
                "$match" : {
                    "operationType" : "insert",
                    "fullDocument.posterId" : poster.id,
                }
            }
        ]

        await monitoringComments(mongoose, pipe);

        

    }catch(e){
        return res.status(400).json({
            err: e
        })
    }
})

async function monitoringComments(client, pipeline = []) {

    console.log("in the monitoring");
    const collection = client.db("test").collection("comments");
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
            throw e;
        }
    }
}

module.exports = commentsRouter;