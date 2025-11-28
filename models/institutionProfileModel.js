const mongoose = require("mongoose");

const institutionProfileSchema = mongoose.Schema(
    {
        locationForMap: {
            type: String,
        },
        email: {
            type: String,
        },
        location: {
            type: String,
        },
        number: {
            type: String,
        },
        facebook: {
            type: String,
        },
        threadLink: {
            type: String,
        },
        whatsapp: {
            type: String,
        },
        insta: {
            type: String,
        },
        linkedin: {
            type: String,
        },
        brochure: {
            type: String,
        },
        certificate: {
            type: String,
        },
        institutionCertificate: {
            type: String,
        },
    },
    { timestamps: true }
);

const institutionProfile = mongoose.model("institutionProfile", institutionProfileSchema);
module.exports = institutionProfile;
