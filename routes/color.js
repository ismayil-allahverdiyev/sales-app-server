const express = require("express")
const mongoose = require("mongoose")
const Color = require("../models/color_model")

const colorRouter = express.Router()

colorRouter.post("/api/color/addNewColors", async (req, res) => {
    try {
        const { colors } = req.body// add color as a list

        colors.forEach(async element => {
            let existingColor = await Color.findOne({ colorName: element["colorName"] })

            console.log("element is " + existingColor)
            console.log("element name is " + existingColor["colorName"])

            if (!existingColor) {
                console.log("Found color is " + existingColor)

                let color = Color({
                    colorName: element["colorName"],
                    hexCodes: [
                        { "hexCode": element["hexCode"] },
                    ],
                })
                color = await color.save()
                console.log(color);
            } else if (existingColor && !existingColor.hexCodes.includes({ "hexCode": element["hexCode"] })) {
                // console.log("Existing color is " + existingColor)
                // console.log("Existing color hexCodes is " + existingColor.hexCodes)
                // console.log("Existing color col name is " + element["colorName"])
                // console.log("Existing color col hex is " + element["hexCode"])

                const updatedColor = await existingColor.updateOne(

                    {
                        $push: {
                            hexCodes: {
                                "hexCode": element["hexCode"],
                            }
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