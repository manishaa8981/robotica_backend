const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const { upload } = require("../middleware/upload");

// Manage (create/update) group main info
router.post(
    "/",
    upload.fields([{ name: "mainImage", maxCount: 1 }]),
    groupController.manageGroup
);

// Get all groups
router.get("/", groupController.getAllGroups);

// Delete entire group and its images
router.delete("/delete/:id", groupController.deleteGroup);

// Create a new item under a group
router.post(
    "/item/:groupId",
    upload.fields([{ name: "image", maxCount: 1 }]),
    groupController.createGroupItem
);

// Update an existing item
router.put(
    "/item/:groupId/:itemId",
    upload.fields([{ name: "image", maxCount: 1 }]),
    groupController.updateGroupItem
);

// Delete an item from group
router.delete("/item/:itemId", groupController.deleteItem);

module.exports = router;
