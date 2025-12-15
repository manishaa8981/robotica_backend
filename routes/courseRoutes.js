const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const courseController = require("../controllers/courseController");

// CREATE
router.post(
  "/create",
  upload.fields([{ name: "image", maxCount: 1 }]),
  courseController.createCourse
);

// READ ALL
router.get("/", courseController.getAllCourses);

// READ BY SLUG must be before "/:id"
router.get("/slug/:slug", courseController.getCourseBySlug);

// READ BY ID
router.get("/:id", courseController.getCourseById);

// UPDATE
router.put(
  "/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  courseController.updateCourse
);

// DELETE
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
