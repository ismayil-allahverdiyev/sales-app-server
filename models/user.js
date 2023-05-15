const mongoose = require("mongoose");

const userScheme = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value) => {
                const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return value.match(re);
            },
            message: "Please enter a valid email address"
        }
    },
    basket: {
        type: Array,
        default: []
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        default: "user"
    }
});

const User = mongoose.model("User", userScheme);
module.exports = User;