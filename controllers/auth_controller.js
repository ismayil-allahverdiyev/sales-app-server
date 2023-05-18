const jwt = require("jsonwebtoken");
const User = require("../models/user");

const jwtVerifier = async (token) => {
    const verified = await jwt.verify(token, "passwordKey");
    console.log("Verified id is " + verified.id)
    const user = await User.findById(verified.id);
    console.log("User id is " + user.id)

    console.log("Comparison is " + user)

    return user;
}

module.exports = {
    jwtVerifier
}