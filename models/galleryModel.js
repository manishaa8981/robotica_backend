const mongoose = require("mongoose");

const galleryContentSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    file: { type: String, required: true },
    fileType: { type: String, enum: ['image', 'video'], required: true },
    date: { type: Date, default: Date.now },
    categoryTitle: { type: String, required: true },
    tags: { type: [String], required: true },
    albumTitle: { type: String, default: null },
});

const GalleryContent = mongoose.model("GalleryContent", galleryContentSchema);
module.exports = GalleryContent;