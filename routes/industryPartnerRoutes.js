const router = require("express").Router();
const partnerController = require("../controllers/industryPartnerController");
const authGuard = require("../middleware/authGuard");
const ensureAdmin = require("../middleware/ensureAdmin");
const { upload } = require("../middleware/upload");

// Public – used by frontend (students)
router.get("/", partnerController.getActivePartners);

// Admin – list all partners
router.get(
  "/admin",
  authGuard,
  ensureAdmin,
  partnerController.getAllPartnersAdmin
);

// Admin – create partner (with logo upload)
router.post(
  "/",
  authGuard,
  ensureAdmin,
  upload.single("logo"),
  partnerController.createPartner
);

// Admin – update partner (can also upload new logo)
router.put(
  "/:id",
  authGuard,
  ensureAdmin,
  upload.single("logo"),
  partnerController.updatePartner
);

// Admin – delete partner
router.delete("/:id", authGuard, ensureAdmin, partnerController.deletePartner);

module.exports = router;
