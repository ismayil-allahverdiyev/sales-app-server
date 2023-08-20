const express = require("express")
const mongoose = require("mongoose")
const Color = require("../models/color_model")
const { colorUploader } = require("../controllers/color_controller")

const colorRouter = express.Router()

colorRouter.post("/api/color/addNewColors", async (req, res) => {
    try {
        const { colors } = req.body// add color as a list

        const result = await colorUploader(colors)
        if (result == true) {
            return res.status(200).json({
                msg: "Colors added successfully!"
            })
        }
        else {
            return res.status(500).json({
                error: "Something went wrong!"
            })
        }
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