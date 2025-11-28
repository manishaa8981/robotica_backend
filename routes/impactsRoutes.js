const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const authGuard = require("../middleware/authGuard");
const ensureAdmin = require("../middleware/ensureAdmin");
const impactsController = require("../controllers/impactsController");

// Main section
router.post("/", impactsController.manageImpacts);
router.get("/", impactsController.getImpacts);

// Items
router.post("/items/:mainId", upload.single("image"), impactsController.addItem);
router.put("/items/:itemId", upload.single("image"), impactsController.updateItem);
router.delete("/items/:itemId", impactsController.deleteItem);

module.exports = router;
