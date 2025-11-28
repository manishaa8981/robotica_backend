const mongoose = require("mongoose");

const admissionsSchema = new mongoose.Schema(
  {
    mainTitle: { type: String, required: true }, 
    load: { type: String }, 
    prerequisites: [{ type: String }],
    grading: [{ type: String }],
    badges: [{ type: String }],
  },
  { timestamps: true }
);

const Admissions = mongoose.model("Admissions", admissionsSchema);
module.exports = Admissions;
