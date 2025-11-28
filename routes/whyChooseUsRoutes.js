const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const authGuard = require("../middleware/authGuard");
const ensureAdmin = require("../middleware/ensureAdmin");
const whyChooseUsController = require("../controllers/whyChooseUsController");

// Main section
router.post("/", whyChooseUsController.manageWhyChooseUs);
router.get("/", whyChooseUsController.getWhyChooseUs);

// Items
router.post("/items/:mainId", upload.single("image"), whyChooseUsController.addItem);
router.put("/items/:itemId", upload.single("image"), whyChooseUsController.updateItem);
router.delete("/items/:itemId", whyChooseUsController.deleteItem);

module.exports = router;
