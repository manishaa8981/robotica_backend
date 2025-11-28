const Banner = require("../models/bannerModel");
const { responseHandler } = require("../helper/responseHandler");

const createBanner = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return responseHandler(res, 400, false, "Title and description are required", null);
    }

    // Count existing active banners
    const existingCount = await Banner.countDocuments({ isDeleted: false });
    const MAX_BANNERS = 2;
    if (existingCount >= MAX_BANNERS) {
      return responseHandler(
        res,
        400,
        false,
        `Maximum of ${MAX_BANNERS} banners reached`,
        null
      );
    }

    const newBanner = new Banner({ title, description });
    await newBanner.save();

    responseHandler(res, 201, true, "Banner created successfully", newBanner);
  } catch (error) {
    console.log("Error in createBanner:", error);
    responseHandler(res, 500, false, "Server error", error.message);
  }
};


// Get all active banners
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isDeleted: false });
    responseHandler(res, 200, true, "Banners fetched successfully", banners);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

// Update a banner by ID
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isDeleted } = req.body;

    const existingBanner = await Banner.findById(id);
    if (!existingBanner) {
      return responseHandler(res, 404, false, "Banner not found", null);
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (typeof isDeleted === "boolean") updateData.isDeleted = isDeleted;

    const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, { new: true });
    responseHandler(res, 200, true, "Banner updated successfully", updatedBanner);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

// Soft delete a banner
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return responseHandler(res, 404, false, "Banner not found", null);
    }

    responseHandler(res, 200, true, "Banner deleted successfully", null);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

module.exports = {
  createBanner,
  getAllBanners,
  updateBanner,
  deleteBanner,
};
