const GalleryContent = require("../models/galleryModel");
const Category = require("../models/categoryModel");
const { responseHandler } = require("../helper/responseHandler");
const fs = require("fs");
const path = require("path");

// Helper: Get final category title or fallback
const getFinalCategoryTitle = async (categoryTitle) => {
    if (categoryTitle) return categoryTitle;
    const categoryDoc = await Category.findOne({ tab: "gallery" });
    if (!categoryDoc) throw new Error("Gallery categories not found");
    const others = categoryDoc.categories.find(c => c.title?.toLowerCase() === "others");
    return others?.title || "Others";
};

const createGalleryContent = async (req, res) => {
    try {
        const { name, date, categoryTitle, tags } = req.body;
        const files = req.files || (req.file ? [req.file] : []);

        if (!files.length || !name) {
            return responseHandler(res, 400, false, "File(s) and album name are required.");
        }

        const finalCategory = await getFinalCategoryTitle(categoryTitle);
        const tagsArr = Array.isArray(tags) ? tags : JSON.parse(tags || "[]");

        if (tagsArr.length < 2) {
            return responseHandler(res, 400, false, "At least two tags are required.");
        }

        const albumTitle = name;

        const docs = files.map((file) => {
            let fileType = file.mimetype.startsWith("image/") ? "image"
                : file.mimetype.startsWith("video/") ? "video"
                    : null;
            if (!fileType) throw new Error("Unsupported file type");

            return {
                name: albumTitle, // unify naming
                file: file.filename,
                fileType,
                date: date ? new Date(date) : new Date(),
                categoryTitle: finalCategory,
                tags: tagsArr,
                albumTitle,
            };
        });

        const inserted = await GalleryContent.insertMany(docs);
        return responseHandler(res, 200, true, "Gallery album created successfully.", inserted);
    } catch (error) {
        console.error("Error in createGalleryContent:", error);
        return responseHandler(res, 500, false, error.message || "Failed to add gallery content.");
    }
};


// Get all gallery contents
const getAllGalleryContents = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { fileType: type } : {};
        const galleries = await GalleryContent.find(filter).sort({ createdAt: -1 });
        return responseHandler(res, 200, true, "Gallery media content fetched successfully.", galleries);
    } catch (error) {
        console.error("Error in getAllGalleryContents:", error);
        return responseHandler(res, 500, false, "Failed to fetch gallery content.");
    }
};

// Update gallery content
const updateGalleryContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, date, categoryTitle, tags } = req.body;
        const newFiles = req.files || [];

        const existing = await GalleryContent.findById(id);
        if (!existing) return responseHandler(res, 404, false, "Content not found.");

        const tagsArr = Array.isArray(tags) ? tags : JSON.parse(tags || "[]");
        if (!tagsArr || tagsArr.length < 2)
            return responseHandler(res, 400, false, "At least two tags are required");

        const finalCategory = await getFinalCategoryTitle(categoryTitle);

        existing.name = name || existing.name;
        existing.date = date ? new Date(date) : existing.date;
        existing.categoryTitle = finalCategory;
        existing.tags = tagsArr;

        if (newFiles[0]) {
            // delete old file
            const oldFilePath = path.join(__dirname, "../uploads", existing.file);
            if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);

            existing.file = newFiles[0].filename;
            existing.fileType = newFiles[0].mimetype.startsWith("image/")
                ? "image"
                : "video";
        }

        await existing.save();
        return responseHandler(res, 200, true, "Item updated successfully", existing);
    } catch (error) {
        console.error("Error in updateGalleryContent:", error);
        return responseHandler(res, 500, false, "Failed to update gallery content.");
    }
};



// Delete a single file
const deleteGalleryContent = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await GalleryContent.findById(id);
        if (!content) return responseHandler(res, 404, false, "Gallery content not found.");

        const filePath = path.join(__dirname, "../uploads", content.file);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await GalleryContent.findByIdAndDelete(id);
        return responseHandler(res, 200, true, "Content deleted successfully.");
    } catch (error) {
        console.error("Error in deleteGalleryContent:", error);
        return responseHandler(res, 500, false, "Failed to delete content.");
    }
};

// Delete an album by title
const deleteAlbum = async (req, res) => {
    try {
        const { albumTitle } = req.params;
        const albumItems = await GalleryContent.find({ albumTitle });
        if (!albumItems.length) return responseHandler(res, 404, false, "Album not found.");

        // Delete all files
        albumItems.forEach(item => {
            const filePath = path.join(__dirname, "../uploads", item.file);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });

        await GalleryContent.deleteMany({ albumTitle });
        return responseHandler(res, 200, true, "Album deleted successfully.");
    } catch (error) {
        console.error("Error in deleteAlbum:", error);
        return responseHandler(res, 500, false, "Failed to delete album.");
    }
};

const updateAlbum = async (req, res) => {
    try {
        const { albumTitle } = req.params;
        if (!albumTitle)
            return responseHandler(res, 400, false, "Album title required");

        const { name, categoryTitle } = req.body;
        let tags = req.body.tags;

        let tagsArr = [];
        if (typeof tags === "string") {
            try {
                tagsArr = JSON.parse(tags);
            } catch {
                tagsArr = [tags];
            }
        } else if (Array.isArray(tags)) {
            tagsArr = tags;
        }

        if (!tagsArr || tagsArr.length < 2)
            return responseHandler(res, 400, false, "At least two tags are required");

        const finalCategory = await getFinalCategoryTitle(categoryTitle);

        // Update existing album items
        await GalleryContent.updateMany(
            { albumTitle },
            {
                $set: {
                    albumTitle: name || albumTitle,
                    categoryTitle: finalCategory,
                    tags: tagsArr,
                },
            }
        );

        // Add new files to album
        const files = req.files || [];
        if (files.length) {
            const docs = files.map((file) => ({
                name: name || albumTitle,
                file: file.filename,
                fileType: file.mimetype.startsWith("image/") ? "image" : "video",
                date: new Date(),
                categoryTitle: finalCategory,
                tags: tagsArr,
                albumTitle: name || albumTitle,
            }));

            await GalleryContent.insertMany(docs);
        }

        return responseHandler(res, 200, true, "Album updated successfully");
    } catch (error) {
        console.error("Error in updateAlbum:", error);
        return responseHandler(res, 500, false, "Failed to update album");
    }
};



module.exports = {
    createGalleryContent,
    getAllGalleryContents,
    updateGalleryContent,
    deleteGalleryContent,
    deleteAlbum,
    updateAlbum
};