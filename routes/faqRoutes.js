const router = require("express").Router();
const faqController = require("../controllers/faqController");
const authGuard = require("../middleware/authGuard");
const ensureAdmin = require("../middleware/ensureAdmin");

// Public – used by frontend FAQ section
router.get("/", faqController.getFaqs);

// Admin – list all (including inactive)
router.get("/admin", authGuard, ensureAdmin, faqController.getAllFaqsAdmin);

// Admin – create FAQ
router.post("/", authGuard, ensureAdmin, faqController.createFaq);

// Admin – update FAQ
router.put("/:faqId", authGuard, ensureAdmin, faqController.updateFaq);

// Admin – delete FAQ
router.delete("/:faqId", authGuard, ensureAdmin, faqController.deleteFaq);

module.exports = router;
