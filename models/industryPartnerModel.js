const mongoose = require("mongoose");

const industryPartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },         
    logo: { type: String, required: true },          
    website: { type: String },                      
    country: { type: String },                       
    partnerType: {                                   
      type: String,
      enum: ["Strategic", "Placement", "Ecosystem", "Other"],
      default: "Placement",
    },
    description: { type: String },                   
    isActive: { type: Boolean, default: true },      
    displayOrder: { type: Number, default: 0 },      
  },
  { timestamps: true }
);

const IndustryPartner = mongoose.model("IndustryPartner", industryPartnerSchema);
module.exports = IndustryPartner;
