const mongoose = require("mongoose");
const teamSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, required: true },
    email: { type: String },
    number: { type: String },
    facebook: { type: String },
    threadLink: { type: String },
    whatsapp: { type: String },
    insta: { type: String },
    linkedin: { type: String },
  },
  { timestamps: true }
);
const Team = mongoose.model("Team", teamSchema);
module.exports = Team;