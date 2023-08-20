const Color = require("../models/color_model");

const colorUploader = async (colors) => {
    try {
        for (const element of colors) {
            let existingColor = await Color.findOne({ "colorName": element["colorName"] })

            if (!existingColor) {
                let color = Color({
                    colorName: element["colorName"],
                    hexCodes: [element["hexCode"],],
                })
                color = await color.save()
            } else if (!existingColor.hexCodes.includes(element["hexCode"])) {
                existingColor.hexCodes.push(element["hexCode"])
                existingColor = await existingColor.save()
            }
        }
        return true
    } catch (e) {
        return false
    }
}

module.exports = {
    colorUploader
}