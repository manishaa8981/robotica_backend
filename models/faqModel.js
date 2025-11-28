const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    // for grouping on frontend
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    // for manual ordering in UI
    order: {
      type: Number,
      default: 0,
    },
    // you can "hide" FAQ without deleting
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Faq = mongoose.model("Faq", faqSchema);
module.exports = Faq;
