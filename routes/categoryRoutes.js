const express = require("express");
const router = express.Router();
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

router.get("/:tab/get", getCategories);
router.post("/:tab/add", addCategory);
router.put("/:tab/update", updateCategory);
router.delete("/:tab/delete", deleteCategory);

module.exports = router;
