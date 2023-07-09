const sharp = require('sharp');

const compressImages = async (req, res, next) => {
  try {
    if (req.files) {
      for (const element of req.files) {
        console.log("Compressor working 1")
        const buffer = await sharp(element.buffer)
          .resize({ quality: 70 })
          .toBuffer();
        console.log("Compressor working 2")
        element.buffer = buffer;
        console.log("Compressor working 3")

      }
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};

module.exports = compressImages;