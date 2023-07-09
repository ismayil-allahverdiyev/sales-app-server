const mongoose = require("mongoose");

const posterSchema = mongoose.Schema({
    category:{
        type: String,
        required: false,
        trim: true,
        default: "all"
    },
    userId:{
        type: String,
        required: true,
        trim: true
    },
    price:{
        type: Number,
        required: true,
    },
    title:{
        type: String,
        default: "This title is automatically generated"
    },
    image:{
        type: [String],
    },
    coverImage:{
        type: String,
    },
    colorPalette:{
        type: [String],
    }
});

const Poster = mongoose.model("Poster", posterSchema);
module.exports = Poster;
