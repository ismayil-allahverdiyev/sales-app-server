const sharp = require('sharp');

const compressImages = async (req, res, next) => {
  try {
    if (req.files) {
      for (const element of req.files) {
        const buffer = await sharp(element.buffer)
          .resize({ quality: 70 })
          .toBuffer();
          
        element.buffer = buffer;
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