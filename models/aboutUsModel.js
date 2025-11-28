const mongoose = require("mongoose");

const aboutUsSchema = mongoose.Schema(
    {
        title:{
            type: String,
            
        },
        description: {
            type: String,
        },
        image: [
            {
                type: String,
            }
        ]
    },
    { timestamps: true }
)

const aboutUs = mongoose.model("aboutUs", aboutUsSchema);
module.exports = aboutUs