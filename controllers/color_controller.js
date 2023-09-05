const Color = require("../models/color_model");

const colorUploader = async (colors) => {
    try {
        for (const element of colors) {
            console.log(element["colorName"])
            let existingColor = await Color.findOne({ "colorName": element["colorName"] })

            if (!existingColor) {
                let color = Color({
                    colorName: element["colorName"],
                    hexCodes: [element["hexCode"],],
                })
                color = await color.save()
                console.log("in uploader 1")
            } else if (!existingColor.hexCodes.includes(element["hexCode"])) {
                existingColor.hexCodes.push(element["hexCode"])
                existingColor = await existingColor.save()
                console.log("in uploader 2")
            }
        }
        return true
    } catch (e) {
        console.log("in uploader error" + e)

        return false
    }
}

module.exports = {
    colorUploader
}
