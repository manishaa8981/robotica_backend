const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");

const galleryController = require("../controllers/galleryController");

// Create: single or multiple files
router.post("/add", upload.array("files"), galleryController.createGalleryContent);

router.get("/get", galleryController.getAllGalleryContents);

router.put("/update/:id", upload.array("files"), galleryController.updateGalleryContent);

router.delete("/delete/:id", galleryController.deleteGalleryContent);

router.delete("/album/:albumTitle", galleryController.deleteAlbum);

router.put("/album/update/:albumTitle", upload.array("files"), galleryController.updateAlbum);

module.exports = router;
