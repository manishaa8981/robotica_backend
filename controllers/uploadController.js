const uploadImage = async (req, res) => {
  const image = req.file ? req.file.filename : null;
  try {
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageName: image,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  uploadImage,
};
