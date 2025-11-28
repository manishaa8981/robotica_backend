const express = require("express");
const router = express.Router();
const {
    createService,
    getAllServices,
    updateService,
    deleteService,
    addServiceItem,
    updateServiceItem,
    deleteServiceItem,
} = require("../controllers/serviceController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const authGuard = require("../middleware/authGuard");
const ensureAdmin = require("../middleware/ensureAdmin");


// Main sections
router.post("/main", authGuard, ensureAdmin, upload.single("mainImage"), createService);
router.get("/main", getAllServices);
router.put("/main/:mainId", authGuard, ensureAdmin, upload.single("mainImage"), updateService);
router.delete("/main/:mainId", authGuard, ensureAdmin, deleteService);

// Items
router.post("/main/:mainId/item", authGuard, ensureAdmin, addServiceItem);
router.put("/main/:mainId/item/:itemId", authGuard, ensureAdmin, updateServiceItem);
router.delete("/main/:mainId/item/:itemId", authGuard, ensureAdmin, deleteServiceItem);

module.exports = router;
