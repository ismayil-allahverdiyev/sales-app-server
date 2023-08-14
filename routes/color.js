const express = require("express")
const mongoose = require("mongoose")
const Color = require("../models/color_model")

const colorRouter = express.Router()

colorRouter.post("/api/color/addNewColor", async (req, res) => {
    const { colorName, hexCodes } = req.body

    let color = Color({
        colorName,
        hexCodes,
    })

    color = await color.save()

    console.log("COLOR IS " + color)
})

colorRouter.get("/api/color/searchByName", async (req, res) => {
    const colorName = req.query.name

    let color = await Color.find({ colorName })

    console.log(color)
})

module.exports = colorRouter