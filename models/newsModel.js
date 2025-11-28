const mongoose = require("mongoose");
const slugify = require("slugify");

const newsSchema = mongoose.Schema(
    {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        },
        categoryTitle: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            required: true,
        },
        date: { type: Date, default: Date.now },
        slug: { type: String, unique: true },
    },
    { timestamps: true });

newsSchema.pre("save", function (next) {
    if (this.isModified("title") || !this.slug) {
        this.slug = slugify(this.title, { lower: true, strict: true });
        this.slug += "-" + Date.now();
    }
    next();
});

const News = mongoose.model("News", newsSchema);
module.exports = News