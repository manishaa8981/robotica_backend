const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    mainTitle: { type: String, required: true },
    mainImage: { type: String, required: true },
    items: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });


const Service = mongoose.model("Service", ServiceSchema);
module.exports = Service;
