const Course = require("../models/courseModel");
const fs = require("fs");
const path = require("path");
const { responseHandler } = require("../helper/responseHandler");

// Helper function to delete old image
const deleteImage = (filePath) => {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Failed to delete image:", err);
  }
};

const VALID_LEVELS = ["Class 8,9,10", "Class 11,12", "Bachelor", "Diploma"];

// helper: parse JSON if it's a string
const safeParse = (value) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value; // keep original string if not JSON
    }
  }
  return value;
};

// helper: normalize level to array + validate
const normalizeAndValidateLevels = (level) => {
  const parsed = safeParse(level);
  const levels = Array.isArray(parsed) ? parsed : [parsed];

  const invalid = levels.filter((lvl) => !VALID_LEVELS.includes(lvl));
  return { levels, invalid };
};

// helper: normalize modules to array + validate basic structure
const normalizeAndValidateModules = (modules) => {
  const parsed = safeParse(modules);

  if (!Array.isArray(parsed)) {
    return { modulesArr: null, error: "Modules must be an array" };
  }

  // Basic validation for your new module schema: title, durationHours, description
  const invalidModuleIndex = parsed.findIndex((m) => {
    if (!m) return true;
    const hasTitle = typeof m.title === "string" && m.title.trim().length > 0;
    const hasDuration =
      typeof m.durationHours === "number" && m.durationHours > 0;
    const hasDescription =
      typeof m.description === "string" && m.description.trim().length > 0;

    return !(hasTitle && hasDuration && hasDescription);
  });

  if (invalidModuleIndex !== -1) {
    return {
      modulesArr: null,
      error: `Invalid module at index ${invalidModuleIndex}. Each module requires: title (string), durationHours (number), description (string).`,
    };
  }

  return { modulesArr: parsed, error: null };
};

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, level, modules, durationHours } = req.body;

    if (!title || !description || !modules || !level) {
      return responseHandler(
        res,
        400,
        false,
        "Please fill all required fields"
      );
    }

    const { levels, invalid } = normalizeAndValidateLevels(level);
    if (invalid.length > 0) {
      return responseHandler(
        res,
        400,
        false,
        `Invalid level(s): ${invalid.join(", ")}`
      );
    }

    const { modulesArr, error } = normalizeAndValidateModules(modules);
    if (error) return responseHandler(res, 400, false, error);

    const calcTotalHours = (modulesArr = []) =>
      modulesArr.reduce((sum, m) => sum + (Number(m.durationHours) || 0), 0);
    const totalHours = calcTotalHours(modulesArr);

    const image = req.files?.image?.[0]?.filename;
    if (!image) {
      return responseHandler(res, 400, false, "Course image is required");
    }

    const course = new Course({
      title,
      description,
      level: levels,
      modules: modulesArr,
      image,
      durationHours: totalHours,
    });

    await course.save();

    return responseHandler(
      res,
      201,
      true,
      "Course created successfully",
      course
    );
  } catch (error) {
    console.error("Error creating course:", error);
    return responseHandler(
      res,
      500,
      false,
      "Error creating course",
      error.message
    );
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, description, modules, level, durationHours } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return responseHandler(res, 404, false, "Course not found");

    if (!title || !description || !modules || !level) {
      return responseHandler(
        res,
        400,
        false,
        "Please fill all required fields"
      );
    }

    const { levels, invalid } = normalizeAndValidateLevels(level);
    if (invalid.length > 0) {
      return responseHandler(
        res,
        400,
        false,
        `Invalid level(s): ${invalid.join(", ")}`
      );
    }

    const { modulesArr, error } = normalizeAndValidateModules(modules);
    if (error) return responseHandler(res, 400, false, error);

    const calcTotalHours = (modules = []) =>
      modules.reduce((sum, m) => sum + (Number(m.durationHours) || 0), 0);

    const totalHours = calcTotalHours(modulesArr);
    course.durationHours = totalHours;
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
    course.modules = modulesArr;
    course.durationHours = calcTotalHours(modulesArr); // ✅

    if (durationHours !== undefined) {
      course.durationHours = Number(durationHours);
    }

    await course.save();

    return responseHandler(
      res,
      200,
      true,
      "Course updated successfully",
      course
    );
  } catch (error) {
    console.error("Error updating course:", error);
    return responseHandler(
      res,
      500,
      false,
      "Error updating course",
      error.message
    );
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    return responseHandler(
      res,
      200,
      true,
      "Courses fetched successfully",
      courses
    );
  } catch (error) {
    return responseHandler(
      res,
      500,
      false,
      "Error fetching courses",
      error.message
    );
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course)
      return responseHandler(res, 404, false, "Course not found", null);
    return responseHandler(
      res,
      200,
      true,
      "Course fetched successfully",
      course
    );
  } catch (error) {
    return responseHandler(
      res,
      500,
      false,
      "Error fetching course",
      error.message
    );
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course)
      return responseHandler(res, 404, false, "Course not found", null);

    if (course.image) {
      deleteImage(path.join(__dirname, "../uploads", course.image));
    }

    return responseHandler(res, 200, true, "Course deleted successfully", null);
  } catch (error) {
    return responseHandler(
      res,
      500,
      false,
      "Error deleting course",
      error.message
    );
  }
};

const getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug });
    if (!course)
      return responseHandler(res, 404, false, "Course not found", null);
    return responseHandler(
      res,
      200,
      true,
      "Course fetched successfully",
      course
    );
  } catch (error) {
    return responseHandler(
      res,
      500,
      false,
      "Error fetching course",
      error.message
    );
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
  updateCourse,
  getCourseBySlug,
};
