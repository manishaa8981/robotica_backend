const router = require("express").Router();
const { uploadImage } = require("../controllers/uploadController");
const {upload} = require("../middleware/upload");

// Add or update About Us content
router.post("/image", upload.single("image"), uploadImage);

module.exports = router;