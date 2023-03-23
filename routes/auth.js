const express = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth.js");

const authRouter = express.Router();

authRouter.post("/api/sign-up", async (req, res) => {
    try{
        const {name, email, password} = req.body;

        console.log(1);

        const existingUser = await User.findOne({email});

        console.log(2);
        
        console.log(existingUser);

        if(existingUser){

            return res.status(403).json({
                msg: "User with the same email already exists!"
            })
        }
        console.log(3);


        const hashedPassword = await bcryptjs.hash(`${password}`, 8);
        console.log(4);


        let user = User({
            name,
            email,
            password: hashedPassword
        });
        console.log(5);


        user = await user.save();
        console.log(6);


        res.json(user);
    }catch(e){
        res.status(500).json({
            error: e.message
        })
    };
})

authRouter.post("/api/sign-in", async (req, res) =>  {
    try{

        const{email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({msg: "User with the email address does not exist!"});
        }

        const isMatched = await bcryptjs.compare(password, user.password);

        if(!isMatched){
            return res.status(400).json({
                msg: "Incorrect password!"
            });
        }

        const token = jwt.sign({id: user._id}, "passwordKey");
        console.log(token);

        res.json({token, ...user._doc});


    }catch(e){
        res.status(500).json({error: e.message});
    }
})

authRouter.post("/tokenIsValid", async (req, res)=>{
    try{
        const token = req.header("x-auth-token");
        console.log("here 1");
        if(!token) return res.json(false);


        const verified = jwt.verify(token, "passwordKey");
        console.log("here 2");
        if(!verified) return res.json(false);

        const user = await User.findById(verified.id);
        console.log("here 3");
        console.log(verified);
        if(!user) return res.json(false);
        console.log("here 4");

        return res.json(true);

    }catch(e){
        res.status(500).json({error: e.message});
    }
})

authRouter.get("/", auth, async (req, res)=>{
    const user = await User.findById(req.user);
    console.log(user);
    res.json({...user._doc, token: req.token});
})

module.exports = authRouter;