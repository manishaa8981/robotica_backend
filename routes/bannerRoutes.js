const router = require("express").Router();
const bannerController = require("../controllers/bannerController");

router.post("/create", bannerController.createBanner);
router.get("/", bannerController.getAllBanners);
router.put("/:id", bannerController.updateBanner);
router.delete("/:id", bannerController.deleteBanner);

module.exports = router;
