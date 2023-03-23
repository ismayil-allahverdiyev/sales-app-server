const mongoose = require("mongoose")

const categorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    coverUrl:{
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 0
    }
})

const Category = mongoose.model("Category", categorySchema)

module.exports = Category;
