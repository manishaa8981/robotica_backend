const Group = require("../models/groupModel");
const { responseHandler } = require("../helper/responseHandler");
const fs = require("fs");
const path = require("path");

// Create or update Group main info + optionally add one item
const manageGroup = async (req, res) => {
  try {
    const { mainTitle, mainDescription, mainWebsite } = req.body;
    const newMainImage = req.files?.mainImage?.[0];
    const mainImagePath = newMainImage ? `/uploads/${newMainImage.filename}` : null;

    // Try to find existing group
    let group = await Group.findOne();

    if (group) {
      group.mainTitle = mainTitle || group.mainTitle;
      group.mainDescription = mainDescription || group.mainDescription;
      group.mainWebsite = mainWebsite || group.mainWebsite;

      // Replace image file if new image uploaded
      if (mainImagePath) {
        if (group.mainImage) {
          const oldPath = path.join(__dirname, "../", group.mainImage);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        group.mainImage = mainImagePath;
      }

      await group.save();
      return responseHandler(res, 200, true, "Group updated successfully", group);
    } else {
      const newGroup = new Group({
        mainTitle,
        mainDescription,
        mainWebsite,
        mainImage: mainImagePath,
        items: [],
      });

      await newGroup.save();
      return responseHandler(res, 201, true, "Group created successfully", newGroup);
    }
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

const createGroupItem = async (req, res) => {
  try {
    const { website } = req.body;
    const imageFile = req.files?.image?.[0];
    if (!imageFile) {
      return responseHandler(res, 400, false, "Image is required");
    }

    const image = `/uploads/${imageFile.filename}`;
    const group = await Group.findById(req.params.groupId);
    if (!group) return responseHandler(res, 404, false, "Group not found");

    group.items.push({ website, image });
    await group.save();
    return responseHandler(res, 200, true, "Item added", group);
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

const updateGroupItem = async (req, res) => {
  try {
    const { groupId, itemId } = req.params;
    const { website } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return responseHandler(res, 404, false, "Group not found", null);
    }

    const item = group.items.id(itemId);
    if (!item) {
      return responseHandler(res, 404, false, "Item not found", null);
    }

    const updateData = {};

    if (website !== undefined) {
      updateData["items.$.website"] = website;
    }

    if (req.files && req.files.image && req.files.image.length > 0) {
      const file = req.files.image[0];

      // Delete old image
      if (item.image) {
        const oldImagePath = path.join(__dirname, "../uploads", item.image.replace("/uploads/", ""));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      updateData["items.$.image"] = `/uploads/${file.filename}`;
    }


    if (Object.keys(updateData).length === 0) {
      return responseHandler(res, 400, false, "No data to update", null);
    }

    // Perform atomic update using positional operator
    const updatedGroup = await Group.findOneAndUpdate(
      { _id: groupId, "items._id": itemId },
      { $set: updateData },
      { new: true }
    );

    return responseHandler(res, 200, true, "Item updated successfully", updatedGroup);
  } catch (error) {
    console.error("Error in updateGroupItem:", error);
    return responseHandler(res, 500, false, "Server error", error.message);
  }
};


// Get all groups
const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, result: groups });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// Delete group and all associated images
const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);

    if (!group) {
      return responseHandler(res, 404, false, "Group not found.");
    }

    // Delete main image
    const mainImagePath = path.join(__dirname, "../../uploads", group.mainImage.replace("/uploads/", ""));
    if (fs.existsSync(mainImagePath)) {
      fs.unlinkSync(mainImagePath);
    }

    // Delete all item images
    group.items.forEach((item) => {
      const itemImagePath = path.join(__dirname, "../../uploads", item.image.replace("/uploads/", ""));
      if (fs.existsSync(itemImagePath)) {
        fs.unlinkSync(itemImagePath);
      }
    });

    await Group.findByIdAndDelete(id);
    return responseHandler(res, 200, true, "Group deleted successfully.");
  } catch (error) {
    console.error("Error in deleteGroup:", error);
    return responseHandler(res, 500, false, "Failed to delete group.");
  }
};

// Delete single item by item ID inside the group
const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    let group = await Group.findOne();
    if (!group) {
      return responseHandler(res, 404, false, "Group not found", null);
    }
    group.items = group.items.filter((item) => item._id.toString() !== itemId);
    await group.save();
    return responseHandler(res, 200, true, "Item deleted successfully", group);
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

module.exports = {
  manageGroup,
  getAllGroups,
  deleteGroup,
  deleteItem,
  createGroupItem,
  updateGroupItem
};
