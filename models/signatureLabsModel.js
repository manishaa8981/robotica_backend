const mongoose = require("mongoose");

const labSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // e.g. "Industrial Cell"
    shortTitle: { type: String }, // e.g. "6-axis Industrial Cell"
    description: { type: String }, // short marketing copy
    equipment: [{ type: String }], // bullet points
    images: [{ type: String }], // filenames of uploaded images
    order: { type: Number, default: 0 }, // for manual ordering on UI
  },
  { _id: true, timestamps: true }
);

const signatureLabsSchema = new mongoose.Schema(
  {
    mainTitle: {
      type: String,
      required: true,
      default: "Signature Labs & Equipment",
    },
    subTitle: {
      type: String,
      default: "",
    },
    labs: [labSchema],
  },
  { timestamps: true }
);

const SignatureLabs = mongoose.model("SignatureLabs", signatureLabsSchema);
module.exports = SignatureLabs;
