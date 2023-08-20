const express = require("express")
const mongoose = require("mongoose")
const Color = require("../models/color_model")

const colorRouter = express.Router()

colorRouter.post("/api/color/addNewColors", async (req, res) => {
    try {
        const { colors } = req.body// add color as a list
        //logs updated in multicolor adding function
        colors.forEach(async element => {
            let existingColor = await Color.findOne({ "colorName": element["colorName"] })

            console.log("element is " + element)
            console.log("element name is " + element["colorName"])

            if (!existingColor) {
                console.log("Found color is " + existingColor)

                let color = Color({
                    colorName: element["colorName"],
                    hexCodes: [element["hexCode"],],
                })
                color = await color.save()
                console.log(color);
            } else if (!existingColor.hexCodes.includes(element["hexCode"])) {
                console.log("Existing color is " + existingColor)
                console.log("Existing color hexCodes is " + existingColor.hexCodes)
                console.log("Existing color col name is " + element["colorName"])
                console.log("Existing color col hex is " + element["hexCode"])

                existingColor.hexCodes.push(element["hexCode"])
                existingColor = await existingColor.save()

                // const updatedColor = await existingColor.updateOne(

                //     {
                //         $push: {
                //             hexCodes: element["hexCode"]
                //         },
                //     },
                // )
                console.log(existingColor);
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