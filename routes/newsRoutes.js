const router = require("express").Router();
const { upload } = require("../middleware/upload");
const newsController = require("../controllers/newsController");

router.post("/add", upload.single("newsImage"), newsController.createNews);
router.get("/all", newsController.getAllNews)
router.delete("/delete/:id", newsController.deleteNews);
router.put("/update/:id", upload.single("newsImage"), newsController.updateNews)
router.get("/get/:id", newsController.getSingleNews)
router.get("/slug/:slug", newsController.getNewsBySlug);
router.get("/recent", newsController.getRecentNews);

module.exports = router;
