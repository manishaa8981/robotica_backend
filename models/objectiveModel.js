const mongoose = require("mongoose");

const objectiveSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        type: String
    }
})

const Objectives = mongoose.model("Objectives", objectiveSchema);
module.exports = Objectives;