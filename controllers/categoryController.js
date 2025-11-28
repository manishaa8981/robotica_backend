const Category = require("../models/categoryModel");
const GalleryContent = require("../models/galleryModel");
const News = require("../models/newsModel");

// Helper: Ensure a document exists for a tab
const ensureCategoryDoc = async (tab) => {
  let doc = await Category.findOne({ tab });
  if (!doc) {
    doc = await Category.create({ tab, categories: [{ title: "Others" }] });
  } else {
    // Ensure "Others" exists
    const othersExists = doc.categories.some(
      (c) => c.title?.trim().toLowerCase() === "others"
    );
    if (!othersExists) {
      doc.categories.push({ title: "Others" });
      await doc.save();
    }
  }
  return doc;
};

// GET categories for a tab
const getCategories = async (req, res) => {
  try {
    const { tab } = req.params; // tab = "gallery" or "newsEvents"
    const includeDeleted = req.query.includeDeleted === "true";

    const categoryDoc = await ensureCategoryDoc(tab);
    let categories = includeDeleted
      ? categoryDoc.categories
      : categoryDoc.categories.filter((c) => !c.isDeleted);

    // Sort "Others" first
    categories.sort((a, b) => {
      if (a.title.toLowerCase() === "others") return -1;
      if (b.title.toLowerCase() === "others") return 1;
      return 0;
    });

    res.status(200).json({
      success: true,
      message: `Categories for ${tab} fetched`,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADD a new category
const addCategory = async (req, res) => {
  try {
    const { tab } = req.params;
    const { title } = req.body;

    if (!title) return res.status(400).json({ success: false, message: "Title required" });

    const categoryDoc = await ensureCategoryDoc(tab);

    // Prevent duplicate titles
    const duplicate = categoryDoc.categories.some(
      (c) => c.title.toLowerCase() === title.trim().toLowerCase()
    );
    if (duplicate) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    categoryDoc.categories.push({ title: title.trim() });
    await categoryDoc.save();

    res.status(201).json({ success: true, message: "Category added", data: categoryDoc.categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE a category
const updateCategory = async (req, res) => {
  try {
    const { tab } = req.params;
    const { id, title } = req.body;

    if (!title) return res.status(400).json({ success: false, message: "Title required" });

    const categoryDoc = await ensureCategoryDoc(tab);
    const item = categoryDoc.categories.id(id);
    if (!item) return res.status(404).json({ success: false, message: "Category not found" });

    // Prevent renaming "Others"
    if (item.title.toLowerCase() === "others") {
      return res.status(400).json({ success: false, message: "Cannot rename 'Others' category" });
    }

    // Prevent duplicate titles
    const duplicate = categoryDoc.categories.some(
      (c) => c._id.toString() !== id && c.title.toLowerCase() === title.trim().toLowerCase()
    );
    if (duplicate) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    item.title = title.trim();
    await categoryDoc.save();

    res.status(200).json({ success: true, message: "Category updated", data: categoryDoc.categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { tab } = req.params;
    const { id } = req.body;

    const categoryDoc = await ensureCategoryDoc(tab);
    const item = categoryDoc.categories.id(id);
    if (!item) return res.status(404).json({ success: false, message: "Category not found" });

    // Prevent deleting "Others"
    if (item.title.toLowerCase() === "others") {
      return res.status(400).json({ success: false, message: "Cannot delete 'Others' category" });
    }

    // Soft delete the category
    item.isDeleted = true;
    await categoryDoc.save();

    // Find "Others" category title
    const others = categoryDoc.categories.find(
      (c) => c.title?.toLowerCase() === "others"
    );
    const othersTitle = others?.title || "Others";

    // Reassign items depending on tab
    if (tab === "gallery") {
      await GalleryContent.updateMany(
        { categoryTitle: item.title },
        { categoryTitle: othersTitle }
      );
    } else if (tab === "newsEvents") {
      await News.updateMany(
        { categoryTitle: item.title },
        { categoryTitle: othersTitle }
      );
    }

    res.status(200).json({
      success: true,
      message: `Category soft deleted and items moved to '${othersTitle}'`,
      data: categoryDoc.categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
