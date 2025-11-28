const fs = require("fs");
const path = require("path");
const { responseHandler } = require("../helper/responseHandler");
const AboutUs = require("../models/aboutUsModel");

const addAboutUsContent = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newImages = req.files ? req.files.map((file) => file.filename) : [];
    const existingImages = JSON.parse(req.body.existingImages || "[]");

    if (!title || !description) {
      return responseHandler(res, 400, false, "Title and description are required.");
    }

    const existingContent = await AboutUs.findOne();
    if (existingContent) {
      existingContent.title = title;
      existingContent.description = description;

      existingContent.image = [...existingImages, ...newImages].slice(0, 3);

      await existingContent.save();
      return responseHandler(res, 200, true, "Content updated successfully.", existingContent);
    } else {
      const newContent = new AboutUs({
        title,
        description,
        image: newImages.slice(0, 3),
      });

      await newContent.save();
      return responseHandler(res, 200, true, "Content created successfully.", newContent);
    }
  } catch (error) {
    console.log("Error in addAboutUsContent:", error);
    return responseHandler(res, 500, false, "An error occurred while processing your request.");
  }
};

const getAboutUsContent = async (req, res) => {
  try {
    const content = await AboutUs.findOne();
    return responseHandler(res, 200, true, "Content fetched successfully.", content);
  } catch (error) {
    console.log("Error in getAboutUsContent:", error);
    return responseHandler(res, 500, false, "An error occurred while processing your request.");
  }
};


module.exports = {
  addAboutUsContent,
  getAboutUsContent,
};