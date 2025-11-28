const router = require("express").Router();
const testimonialController = require("../controllers/testimonialController");
const { upload } = require("../middleware/upload");

router.post("/", upload.single("image"), testimonialController.createTestimonial);
router.get("/", testimonialController.getAllTestimonials);
router.put("/:id", upload.single("image"), testimonialController.updateTestimonial);
router.delete("/:id", testimonialController.deleteTestimonial);

module.exports = router;