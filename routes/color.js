const express = require("express")
const mongoose = require("mongoose")
const Color = require("../models/color_model")

const colorRouter = express.Router()

colorRouter.post("/api/color/addNewColors", async (req, res) => {
    try {
        const { colorName, hexCodes } = req.body// add color as a list

        let exsistingColor = await Color.findOne({ colorName })

        if (exsistingColor && exsistingColor.hexCodes.contains()) {
            return res.status(400).json({
                "msg": "Color already found!",
            })
        }

        let color = Color({
            colorName,
            hexCodes,
        })

        color = await color.save()

        console.log("COLOR IS " + color)

        return res.status(200).json({
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

        let color = await Color.findOne({ colorName })

        res.status(200).json(color)
    } catch (error) {
        res.status(500).json({
            error: e.message
        })
    }
})

colorRouter.get("/api/color/getAll", async (req, res) => {
    try {
        let colors = await Color.find()

        res.status(200).json(colors)
    } catch (error) {
        res.status(500).json({
            error: e.message
        })
    }
})

module.exports = colorRouter