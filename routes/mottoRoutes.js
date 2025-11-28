const router = require("express").Router();
const mottoController = require("../controllers/mottoController");
const ensureAdmin = require("../middleware/ensureAdmin");
const authGuard = require("../middleware/authGuard");

router.post("/add", mottoController.addOrUpdateMottoContent);
router.get("/get", mottoController.getMottoContent);

module.exports = router;
