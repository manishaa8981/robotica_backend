const mongoose = require("mongoose");

const categoryItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

const categorySchema = new mongoose.Schema(
  {
    tab: {
      type: String,
      enum: ["gallery", "newsEvents"],
      required: true
    },
    categories: {
      type: [categoryItemSchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
