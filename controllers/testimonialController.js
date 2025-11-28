const Testimonial = require("../models/testimonialModel")
const { responseHandler } = require("../helper/responseHandler");
const path = require("path");
const fs = require("fs");

const createTestimonial = async (req, res) => {
    try {
        const { name, description, role } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!name || !description) {
            return responseHandler(res, 400, false, "Name and description are required", null);
        }

        // Count existing testimonials
        const existingCount = await Testimonial.countDocuments();
        const MAX_TESTIMONIALS = 6;
        if (existingCount >= MAX_TESTIMONIALS) {
            return responseHandler(
                res,
                400,
                false,
                `Maximum of ${MAX_TESTIMONIALS} testimonials reached`,
                null
            );
        }

        const newTestimonial = new Testimonial({
            name,
            description,
            role,
            image
        });

        await newTestimonial.save();
        responseHandler(res, 201, true, "Testimonial created successfully", newTestimonial);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        responseHandler(res, 200, true, "Testimonials fetched successfully", testimonials);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            role,
            description,
        } = req.body;

        const existingTestimonial = await Testimonial.findById(id);
        if (!existingTestimonial) {
            return responseHandler(res, 404, false, "Testimonial not found", null);
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (role !== undefined) updateData.role = role;
        if (description !== undefined) updateData.description = description;

        if (req.file) {
            const newImage = req.file.filename;
            updateData.image = newImage;

            if (existingTestimonial.image) {
                const oldImagePath = path.join(__dirname, "../uploads", existingTestimonial.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        const updatedTestimonial = await Testimonial.findByIdAndUpdate(id, updateData, { new: true });

        responseHandler(res, 200, true, "Testimonial updated successfully", updatedTestimonial);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;

        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return responseHandler(res, 404, false, "Testimonial not found", null);
        }

        if (testimonial.image) {
            const imagePath = path.join(__dirname, "../uploads", testimonial.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Testimonial.findByIdAndDelete(id);

        responseHandler(res, 200, true, "Testimonial deleted successfully", null);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};


module.exports = {
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getAllTestimonials
}