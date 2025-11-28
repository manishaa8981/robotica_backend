const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const courseController = require("../controllers/courseController");

router.post(
  "/create",
  upload.fields([
    { name: "image", maxCount: 1 },
  ]),
  courseController.createCourse
);
// router.get("/type/:main/:sub?", courseController.getCourseByCourseType);
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);
router.delete("/:id", courseController.deleteCourse);
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
  ]),
  courseController.updateCourse
);
router.get("/slug/:slug", courseController.getCourseBySlug);


module.exports = router;
