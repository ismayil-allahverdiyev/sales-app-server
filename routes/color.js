const express = require("express")
const mongoose = require("mongoose")
const Color = require("../models/color_model")

const colorRouter = express.Router()

colorRouter.post("/api/color/addNewColor", async (req, res) => {
    try {
        const { colorName, hexCodes } = req.body

        let color = Color({
            colorName,
            hexCodes,
        })

        color = await color.save()

        console.log("COLOR IS " + color)

        res.status(400).json({
            color
        })
    } catch (error) {
        res.status(500).json({
            error: e.message
        })
    }
})

colorRouter.get("/api/color/searchByName", async (req, res) => {
    try {
        const colorName = req.query.colorName

        let color = await Color.find({ colorName })

        res.status(400).json({
            color
        })
    } catch (error) {
        res.status(500).json({
            error: e.message
        })
    }
})

module.exports = colorRouter