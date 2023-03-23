const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try{
        console.log("auth");
        const token = req.header("x-auth-token");
        if(!token){
            return res.status(401).json({msg: "No auth token, access denied!"});
        }

        const verified = jwt.verify(token, "passwordKey");
        if(!verified) return res.status(401).json({msg: "Token verification failed, authorization denied!"});

        req.user = verified.id;
        console.log("midware"+verified.id);
        req.token = token;
        next();
    }catch(e){

    }
}

module.exports = auth;