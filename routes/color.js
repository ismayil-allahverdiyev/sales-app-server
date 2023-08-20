const express = require("express")
const mongoose = require("mongoose")
const Color = require("../models/color_model")

const colorRouter = express.Router()

colorRouter.post("/api/color/addNewColors", async (req, res) => {
    try {
        const { colors } = req.body// add color as a list

        colors.forEach(async element => {
            let existingColor = await Color.findOne({ colorName: element["colorName"] })

            if (!existingColor) {
                let color = Color({
                    colorName: element["colorName"],
                    hexCodes: [element["hexCode"]],
                })
                color = await color.save()
                console.log(color);
            } else if (existingColor && !existingColor.hexCodes.includes(element["hexCode"])) {
                const updatedColor = await existingColor.updateOne(
                    {
                        $push: {
                            hexCodes: element["hexCode"]
                        },
                    },
                )
                console.log(updatedColor);
            }
        });

        return res.status(200).json({
            msg: "Colors added successfully!"
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