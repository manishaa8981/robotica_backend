const WhyChooseUs = require("../models/whyChooseUsModel");
const { responseHandler } = require("../helper/responseHandler");
const fs = require("fs");
const path = require("path");

// Manage main section (no image here now)
const manageWhyChooseUs = async (req, res) => {
  try {
    const { mainTitle } = req.body;

    let section = await WhyChooseUs.findOne();
    if (section) {
      section.mainTitle = mainTitle || section.mainTitle;
      await section.save();
      return responseHandler(
        res,
        200,
        true,
        "Section updated successfully",
        section
      );
    } else {
      const newSection = new WhyChooseUs({ mainTitle, items: [] });
      await newSection.save();
      return responseHandler(
        res,
        201,
        true,
        "Section created successfully",
        newSection
      );
    }
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

// Get section
const getWhyChooseUs = async (req, res) => {
  try {
    const section = await WhyChooseUs.findOne();
    if (!section)
      return responseHandler(res, 404, false, "No data found", null);
    return responseHandler(
      res,
      200,
      true,
      "Section retrieved successfully",
      section
    );
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

// Add new item with image
const addItem = async (req, res) => {
  try {
    const { mainId } = req.params;
    const { title, description } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!image)
      return responseHandler(res, 400, false, "Item image is required", null);

    const section = await WhyChooseUs.findById(mainId);
    if (!section)
      return responseHandler(res, 404, false, "Main section not found", null);

    const MAX_ITEMS = 9;
    if (section.items.length >= MAX_ITEMS) {
      return responseHandler(
        res,
        400,
        false,
        `Maximum of ${MAX_ITEMS} items allowed`,
        null
      );
    }

    section.items.push({
      title,
      description,
      image,
      duration,
      internship,
      outcomes,
      seats,
      date: date ? new Date(date) : undefined,
    });
    await section.save();
    return responseHandler(res, 201, true, "Item added successfully", section);
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

// Update item (title, description, optional image)
const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { title, description, duration, internship, outcomes, seats, date } =
      req.body;
    const image = req.file ? req.file.filename : null;

    const section = await WhyChooseUs.findOne();
    if (!section)
      return responseHandler(res, 404, false, "Main section not found", null);

    const itemIndex = section.items.findIndex(
      (i) => i._id.toString() === itemId
    );
    if (itemIndex === -1)
      return responseHandler(res, 404, false, "Item not found", null);

    const item = section.items[itemIndex];

    // Replace old image if new image uploaded
    if (image && item.image) {
      const oldImagePath = path.join(__dirname, "../uploads", item.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      item.image = image;
    }

    item.title = title || item.title;
    item.description = description || item.description;
    item.duration = duration || item.duration;
    item.internship = internship || item.internship;
    item.outcomes = outcomes || item.outcomes;
    item.seats = seats || item.seats;
    if (date) item.date = new Date(date);

    await section.save();
    return responseHandler(
      res,
      200,
      true,
      "Item updated successfully",
      section
    );
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

// Delete item and its image
const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const section = await WhyChooseUs.findOne();
    if (!section)
      return responseHandler(res, 404, false, "Main section not found", null);

    const item = section.items.find((i) => i._id.toString() === itemId);
    if (!item) return responseHandler(res, 404, false, "Item not found", null);

    // Delete image file
    if (item.image) {
      const imagePath = path.join(__dirname, "../uploads", item.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    section.items = section.items.filter((i) => i._id.toString() !== itemId);
    await section.save();

    return responseHandler(
      res,
      200,
      true,
      "Item deleted successfully",
      section
    );
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

module.exports = {
  manageWhyChooseUs,
  getWhyChooseUs,
  addItem,
  updateItem,
  deleteItem,
};
