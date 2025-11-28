const mongoose = require("mongoose");

const roadMapSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        type: String
    }
})

const RoadMap = mongoose.model("RoadMap", roadMapSchema);
module.exports = RoadMap;