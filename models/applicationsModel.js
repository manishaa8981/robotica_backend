const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // Basic info
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },

    // Programme / level user selected
    level: { type: String, required: true, trim: true },

    // Extra info
    schoolOrCollege: { type: String, trim: true },
    city: { type: String, trim: true },
    message: { type: String, trim: true },

    // Admin side
    status: {
      type: String,
      enum: ["New", "In Review", "Accepted", "Rejected"],
      default: "New",
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
