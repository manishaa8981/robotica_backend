const mongoose = require("mongoose");

const mottoSchema = mongoose.Schema(
  {
    motoTitle: {
      type: String,
      required: true,
    },
    mission: {
      text: {
        type: String,
        required: true,
      },
    },
    vision: {
      text: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const Motto = mongoose.model("Motto", mottoSchema);
module.exports = Motto;
