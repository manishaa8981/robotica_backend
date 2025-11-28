const SignatureLabs = require("../models/signatureLabsModel");
const { responseHandler } = require("../helper/responseHandler");
const fs = require("fs");
const path = require("path");

const MAX_LABS = 20;

/* ───────────────── MAIN SECTION (title) ───────────────── */

const manageSignatureLabs = async (req, res) => {
  try {
    const { mainTitle, subTitle } = req.body;

    let section = await SignatureLabs.findOne();
    if (section) {
      section.mainTitle = mainTitle || section.mainTitle;
      section.subTitle = subTitle ?? section.subTitle;
      await section.save();

      return responseHandler(
        res,
        200,
        true,
        "Signature labs section updated successfully",
        section
      );
    } else {
      const newSection = new SignatureLabs({
        mainTitle,
        subTitle,
        labs: [],
      });
      await newSection.save();

      return responseHandler(
        res,
        201,
        true,
        "Signature labs section created successfully",
        newSection
      );
    }
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

const getSignatureLabs = async (req, res) => {
  try {
    const section = await SignatureLabs.findOne();
    if (!section) {
      return responseHandler(res, 404, false, "No data found", null);
    }
    return responseHandler(
      res,
      200,
      true,
      "Signature labs retrieved successfully",
      section
    );
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

/* ───────────────── LABS CRUD ───────────────── */

/**
 * helper: normalize equipment into [string]
 */
const normalizeEquipment = (equipment) => {
  if (!equipment) return [];

  // from array in JSON
  if (Array.isArray(equipment)) {
    return equipment
      .map((e) => String(e).trim())
      .filter((e) => e.length > 0);
  }

  // from textarea / CSV string – split by newlines or comma
  return String(equipment)
    .split(/\r?\n|,/)
    .map((e) => e.trim())
    .filter((e) => e.length > 0);
};

/* Add a lab (images are optional) */
const addLab = async (req, res) => {
  try {
    const { title, shortTitle, description, equipment, order } = req.body;
    const files = req.files || []; // upload.array("images")

    if (!title) {
      return responseHandler(res, 400, false, "Lab title is required", null);
    }

    const section = await SignatureLabs.findOne();
    if (!section) {
      return responseHandler(res, 404, false, "Main section not found", null);
    }

    if (section.labs.length >= MAX_LABS) {
      return responseHandler(
        res,
        400,
        false,
        `Maximum of ${MAX_LABS} labs allowed`,
        null
      );
    }

    // images are optional – if none, just an empty array
    const images = files.map((f) => f.filename);
    const equipmentArr = normalizeEquipment(equipment);

    section.labs.push({
      title,
      shortTitle,
      description,
      equipment: equipmentArr,
      images,
      order,
    });

    await section.save();

    return responseHandler(res, 201, true, "Lab added successfully", section);
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

/* Update lab (can also append new images) */
const updateLab = async (req, res) => {
  try {
    const { labId } = req.params;
    const { title, shortTitle, description, equipment, order } = req.body;
    const files = req.files || [];

    const section = await SignatureLabs.findOne();
    if (!section) {
      return responseHandler(res, 404, false, "Main section not found", null);
    }

    const lab = section.labs.id(labId);
    if (!lab) {
      return responseHandler(res, 404, false, "Lab not found", null);
    }

    if (title) lab.title = title;
    if (shortTitle !== undefined) lab.shortTitle = shortTitle;
    if (description !== undefined) lab.description = description;
    if (equipment !== undefined) {
      lab.equipment = normalizeEquipment(equipment);
    }
    if (order !== undefined) lab.order = order;

    // append new images if any uploaded
    if (files.length) {
      const newImages = files.map((f) => f.filename);
      lab.images = [...(lab.images || []), ...newImages];
    }

    await section.save();

    return responseHandler(
      res,
      200,
      true,
      "Lab updated successfully",
      section
    );
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

/* Delete whole lab (and all its images from disk) */
const deleteLab = async (req, res) => {
  try {
    const { labId } = req.params;

    const section = await SignatureLabs.findOne();
    if (!section) {
      return responseHandler(res, 404, false, "Main section not found", null);
    }

    const lab = section.labs.id(labId);
    if (!lab) {
      return responseHandler(res, 404, false, "Lab not found", null);
    }

    // delete images from /uploads
    if (lab.images && lab.images.length) {
      lab.images.forEach((image) => {
        const imagePath = path.join(__dirname, "../uploads", image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    lab.deleteOne(); // remove from array

    await section.save();

    return responseHandler(res, 200, true, "Lab deleted successfully", section);
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

/* Optional: delete a single image from a lab */
const deleteLabImage = async (req, res) => {
  try {
    const { labId, imageName } = req.params;

    const section = await SignatureLabs.findOne();
    if (!section) {
      return responseHandler(res, 404, false, "Main section not found", null);
    }

    const lab = section.labs.id(labId);
    if (!lab) {
      return responseHandler(res, 404, false, "Lab not found", null);
    }

    lab.images = (lab.images || []).filter((img) => img !== imageName);

    const imagePath = path.join(__dirname, "../uploads", imageName);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await section.save();

    return responseHandler(
      res,
      200,
      true,
      "Lab image deleted successfully",
      section
    );
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

module.exports = {
  manageSignatureLabs,
  getSignatureLabs,
  addLab,
  updateLab,
  deleteLab,
  deleteLabImage,
};
