const mongoose = require("mongoose");

const clientSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    website: { type: String },
    number: { type: String },
    location: { type: String },
    clientImage: { type: String },
    fbVideoUrl:{type: String},
    ytVideoUrl:{type: String}
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);
module.exports = Client;
