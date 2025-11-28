const mongoose = require("mongoose");

const whyChooseUsSchema = new mongoose.Schema({
  mainTitle: { type: String, required: true },
  items: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String, required: true },
      duration: { type: String },
      internship: { type: String },
      outcomes: { type: String },
      seats: { type: String },
      date: { type: Date },
    },
  ],
});

const WhyChooseUs = mongoose.model("WhyChooseUs", whyChooseUsSchema);
module.exports = WhyChooseUs;
