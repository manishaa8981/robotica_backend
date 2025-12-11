const IndustryPartner = require("../models/industryPartnerModel");
const { responseHandler } = require("../helper/responseHandler");

// PUBLIC – get active partners for website
const getActivePartners = async (req, res) => {
  try {
    const partners = await IndustryPartner.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return responseHandler(res, 200, true, "Partners fetched", partners);
  } catch (err) {
    console.error("Error fetching partners:", err);
    return responseHandler(res, 500, false, "Failed to fetch partners");
  }
};

// ADMIN – list all partners
const getAllPartnersAdmin = async (req, res) => {
  try {
    const partners = await IndustryPartner.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    return responseHandler(res, 200, true, "Partners fetched", partners);
  } catch (err) {
    console.error("Error fetching partners (admin):", err);
    return responseHandler(res, 500, false, "Failed to fetch partners");
  }
};

// ADMIN – create partner
const createPartner = async (req, res) => {
  try {
    const { name, website, country, partnerType, description, displayOrder } =
      req.body;

    if (!name) {
      return responseHandler(res, 400, false, "Name is required");
    }

    if (!req.file) {
      return responseHandler(res, 400, false, "Logo image is required");
    }

    const newPartner = await IndustryPartner.create({
      name,
      website,
      country,
      partnerType,
      description,
      displayOrder: displayOrder || 0,
      logo: req.file.filename,
    });

    return responseHandler(res, 201, true, "Partner created", newPartner);
  } catch (err) {
    console.error("Error creating partner:", err);
    return responseHandler(res, 500, false, "Failed to create partner");
  }
};

// ADMIN – update partner
const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, website, country, partnerType, description, displayOrder, isActive } =
      req.body;

    const updateData = {
      name,
      website,
      country,
      partnerType,
      description,
      displayOrder,
      isActive,
    };

    // If a new logo is uploaded, replace filename
    if (req.file) {
      updateData.logo = req.file.filename;
    }

    const updated = await IndustryPartner.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return responseHandler(res, 404, false, "Partner not found");
    }

    return responseHandler(res, 200, true, "Partner updated", updated);
  } catch (err) {
    console.error("Error updating partner:", err);
    return responseHandler(res, 500, false, "Failed to update partner");
  }
};

// ADMIN – delete partner
const deletePartner = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await IndustryPartner.findByIdAndDelete(id);
    if (!deleted) {
      return responseHandler(res, 404, false, "Partner not found");
    }

    return responseHandler(res, 200, true, "Partner deleted", deleted);
  } catch (err) {
    console.error("Error deleting partner:", err);
    return responseHandler(res, 500, false, "Failed to delete partner");
  }
};

module.exports = {
  getActivePartners,
  getAllPartnersAdmin,
  createPartner,
  updatePartner,
  deletePartner,
};
