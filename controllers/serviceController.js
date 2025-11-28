const Service = require("../models/serviceModel");
const { responseHandler } = require("../helper/responseHandler");
const fs = require("fs");
const path = require("path");

// Create a new main section
const createService = async (req, res) => {
    try {
        const { mainTitle } = req.body;
        const mainImage = req.file ? req.file.filename : null;

        if (!mainTitle || !mainImage) {
            return responseHandler(res, 400, false, "Main title and image are required", null);
        }

        const newSection = new Service({ mainTitle, mainImage, items: [] });
        await newSection.save();

        return responseHandler(res, 201, true, "Main section created successfully", newSection);
    } catch (error) {
        return responseHandler(res, 500, false, error.message, null);
    }
};

// Get all main sections
const getAllServices = async (req, res) => {
    try {
        const sections = await Service.find();
        return responseHandler(res, 200, true, "Sections retrieved successfully", sections);
    } catch (error) {
        return responseHandler(res, 500, false, error.message, null);
    }
};

// Update a main section
const updateService = async (req, res) => {
    console.log(req.file);
    try {
        const { mainId } = req.params;
        const { mainTitle } = req.body;
        const mainImage = req.file ? req.file.filename : null;

        const section = await Service.findById(mainId);
        if (!section) return responseHandler(res, 404, false, "Main section not found", null);

        // Remove old image if replaced
        if (mainImage && section.mainImage) {
            const oldImagePath = path.join(__dirname, "../uploads", section.mainImage);
            if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }

        section.mainTitle = mainTitle || section.mainTitle;
        section.mainImage = mainImage || section.mainImage;

        await section.save();
        return responseHandler(res, 200, true, "Main section updated successfully", section);
    } catch (error) {
        return responseHandler(res, 500, false, error.message, null);
    }
};


// Delete a main section and its items
const deleteService = async (req, res) => {
    try {
        const { mainId } = req.params;

        const section = await Service.findById(mainId);
        if (!section) return responseHandler(res, 404, false, "Main section not found", null);

        // Delete main image
        if (section.mainImage) {
            const imgPath = path.join(__dirname, "../uploads", section.mainImage);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }

        await section.deleteOne();
        return responseHandler(res, 200, true, "Main section deleted successfully", null);
    } catch (error) {
        return responseHandler(res, 500, false, error.message, null);
    }
};

// Add a new item to a main section
const addServiceItem = async (req, res) => {
    try {
        const { mainId } = req.params;
        const { title, description } = req.body;

        const section = await Service.findById(mainId);
        if (!section) return responseHandler(res, 404, false, "Main section not found", null);

        const MAX_ITEMS = 6;
        if (section.items.length >= MAX_ITEMS) {
            return responseHandler(res, 400, false, `Maximum of ${MAX_ITEMS} items allowed`, null);
        }

        section.items.push({ title, description });
        await section.save();

        return responseHandler(res, 201, true, "Item added successfully", section);
    } catch (error) {
        return responseHandler(res, 500, false, error.message, null);
    }
};

// Update an item
const updateServiceItem = async (req, res) => {
    try {
        const { mainId, itemId } = req.params;
        const { title, description } = req.body;

        const section = await Service.findById(mainId);
        if (!section) return responseHandler(res, 404, false, "Main section not found", null);

        const item = section.items.id(itemId);
        if (!item) return responseHandler(res, 404, false, "Item not found", null);

        item.title = title || item.title;
        item.description = description || item.description;

        await section.save();
        return responseHandler(res, 200, true, "Item updated successfully", section);
    } catch (error) {
        return responseHandler(res, 500, false, error.message, null);
    }
};

// Delete an item
const deleteServiceItem = async (req, res) => {
    try {
        const { mainId, itemId } = req.params;

        const section = await Service.findById(mainId);
        if (!section) return responseHandler(res, 404, false, "Main section not found", null);

        section.items = section.items.filter(i => i._id.toString() !== itemId);
        await section.save();

        return responseHandler(res, 200, true, "Item deleted successfully", section);
    } catch (error) {
        return responseHandler(res, 500, false, error.message, null);
    }
};

module.exports = {
    createService,
    getAllServices,
    updateService,
    deleteService,
    addServiceItem,
    updateServiceItem,
    deleteServiceItem,
};
