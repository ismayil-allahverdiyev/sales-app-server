const mongoose = require("mongoose")

const colorSchema = mongoose.Schema({
    colorName: {
        type: String,
        required: true,
        trim: true,
    },
    hexCodes: {
        type: Array,
        required: true,
    }
})

const Color = mongoose.model("Color", colorSchema)

module.exports = Color