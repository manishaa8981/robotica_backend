const mongoose = require("mongoose");

const impactsSchema = new mongoose.Schema({
  mainTitle: { type: String, required: true },
  items: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String, required: true },
    },
  ],
});

const Impacts = mongoose.model("Impacts", impactsSchema);
module.exports = Impacts;
