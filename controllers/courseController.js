const Course = require("../models/courseModel");
const fs = require("fs");
const path = require("path");
const { responseHandler } = require("../helper/responseHandler");
const e = require("cors");

// Helper function to delete old image
const deleteImage = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, level, modules } = req.body;

    if (!title || !description || !modules || !level) {
      return responseHandler(res, 400, false, "Please fill all required fields");
    }

    const levels = Array.isArray(level) ? level : [level];
    const validLevels = ["Class 11", "Class 12"];
    const invalidLevels = levels.filter((lvl) => !validLevels.includes(lvl));
    if (invalidLevels.length > 0) {
      return responseHandler(res, 400, false, "Invalid level(s) provided");
    }

    let parsedModules;
    try {
      parsedModules = JSON.parse(modules);
    } catch (err) {
      return responseHandler(res, 400, false, "Invalid modules format");
    }

    if (!Array.isArray(parsedModules)) {
      return responseHandler(res, 400, false, "Modules must be an array");
    }

    const image = req.files?.image?.[0]?.filename;
    if (!image) {
      return responseHandler(res, 400, false, "Course image is required");
    }

    const course = new Course({
      title,
      description,
      level: levels,
      modules: parsedModules,
      image,
    });

    await course.save();

    return responseHandler(res, 201, true, "Course created successfully", course);
  } catch (error) {
    console.error("Error creating course:", error);
    return responseHandler(res, 500, false, "Error creating course", error.message);
  }
};


// Update course
const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, description, modules, level } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return responseHandler(res, 404, false, "Course not found");
    }

    if (!title || !description || !modules || !level) {
      return responseHandler(res, 400, false, "Please fill all required fields");
    }

    const levels = Array.isArray(level) ? level : [level];
    const validLevels = ["Class 11", "Class 12"];
    const invalidLevels = levels.filter((lvl) => !validLevels.includes(lvl));
    if (invalidLevels.length > 0) {
      return responseHandler(res, 400, false, "Invalid level(s) provided");
    }

    // Parse modules JSON string
    let parsedModules;
    try {
      parsedModules = JSON.parse(modules);
    } catch (err) {
      return responseHandler(res, 400, false, "Invalid modules format");
    }

    // Validate parsedModules
    if (!Array.isArray(parsedModules)) {
      return responseHandler(res, 400, false, "Modules should be an array");
    }

    // Handle image update
    if (req.files?.image?.length > 0) {
      if (course.image) {
        const oldImagePath = path.join(__dirname, "../uploads", course.image);
        deleteImage(oldImagePath);
      }
      course.image = req.files.image[0].filename;
    }

    course.title = title;
    course.description = description;
    course.level = levels;
    course.modules = parsedModules;

    await course.save();

    return responseHandler(res, 200, true, "Course updated successfully", course);
  } catch (error) {
    console.error("Error updating course:", error);
    return responseHandler(res, 500, false, "Error updating course", error.message);
  }
};


// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    responseHandler(res, 200, true, "Courses fetched successfully", courses);
  } catch (error) {
    responseHandler(res, 500, false, "Error fetching courses", error);
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return responseHandler(res, 404, false, "Course not found", null);
    }
    responseHandler(res, 200, true, "Course fetched successfully", course);
  } catch (error) {
    responseHandler(res, 500, false, "Error fetching course", error);
  }
};


// Delete course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return responseHandler(res, 404, false, "Course not found", null);
    }

    ["image"].forEach((field) => {
      if (course[field]) {
        deleteImage(path.join(__dirname, "../uploads", course[field]));
      }
    });

    responseHandler(res, 200, true, "Course deleted successfully", null);
  } catch (error) {
    responseHandler(res, 500, false, "Error deleting course", error);
  }
};

const getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug });
    if (!course) {
      return responseHandler(res, 404, false, "Course not found", null);
    }
    responseHandler(res, 200, true, "Course fetched successfully", course);
  } catch (error) {
    responseHandler(res, 500, false, "Error fetching course", error);
  }
};



module.exports = { createCourse, getAllCourses, getCourseById, deleteCourse, updateCourse, getCourseBySlug };