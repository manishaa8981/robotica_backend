const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const authGuard = require("../middleware/authGuard");
const ensureAdmin = require("../middleware/ensureAdmin");
const operatingController = require("../controllers/operatingController");

// Main section
router.post("/", operatingController.manageOperating);
router.get("/", operatingController.getOperating);

// Items
router.post("/items/:mainId", upload.single("image"), operatingController.addItem);
router.put("/items/:itemId", upload.single("image"), operatingController.updateItem);
router.delete("/items/:itemId", operatingController.deleteItem);

module.exports = router;
