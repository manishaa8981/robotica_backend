const mongoose = require("mongoose");
const slugify = require("slugify");

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // e.g. "Robots in Our World"
    },
    durationHours: {
      type: Number,
      required: true, // e.g. 2
    },
    description: {
      type: String,
      required: true, // short public-friendly text
    },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true, // short overview for public site
    },

    level: {
      type: [String],
      enum: ["Class 8,9,10", "Class 11,12", "Bachelor", "Diploma"],
      required: true,
    },

    durationHours: { type: Number, default: 0 },

    modules: {
      type: [moduleSchema],
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

courseSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
    this.slug += "-" + Date.now();
  }
  next();
});

module.exports = mongoose.model("Course", courseSchema);
