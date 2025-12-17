const express = require("express");
const path = require("path");
const cors = require("cors");
const moment = require("moment-timezone");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const morgan = require("morgan");

moment.tz.setDefault("Asia/Kathmandu");

const app = express();
app.use(morgan("dev"));

dotenv.config();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const corsPolicy = [
  "https://roboticainstitute.com",
  "https://www.roboticainstitute.com",
  "https://admin.roboticainstitute.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server & curl requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// app.use(cors(corsPolicy));
// app.options("*", cors());
app.use("/uploads", (req, res, next) => {
  express.static(path.resolve(__dirname, "uploads"))(req, res, next);
});

connectDB();

const port = process.env.PORT;
app.use("/images", express.static("public/images"));

app.use("/api/auth", require("./routes/userRoutes"));

app.use("/api/banner", require("./routes/bannerRoutes"));

app.use("/api/team", require("./routes/teamRoutes"));

app.use("/api/testimonial", require("./routes/testimonialRoutes"));

app.use(
  "/api/institutionprofile",
  require("./routes/institutionProfileRoutes")
);

app.use("/api/aboutus", require("./routes/aboutUsRoutes"));

app.use("/api/motto", require("./routes/mottoRoutes"));

app.use("/api/contact", require("./routes/contactRoutes"));

app.use("/api/course", require("./routes/courseRoutes"));

app.use("/api/whychooseus", require("./routes/whyChooseUsRoutes"));

app.use("/api/operatingModel", require("./routes/operatingRoutes"));

app.use("/api/impacts", require("./routes/impactsRoutes"));

app.use("/api/service", require("./routes/serviceRoutes"));

app.use("/api/roadMap", require("./routes/roadMapRoutes"));

app.use("/api/objective", require("./routes/objectiveRoutes"));

app.use("/api/programs", require("./routes/programsRoutes"));

app.use("/api/clients", require("./routes/clientRoutes"));

app.use("/api/category", require("./routes/categoryRoutes"));

app.use("/api/gallery", require("./routes/galleryRoutes"));

app.use("/api/news", require("./routes/newsRoutes"));

app.use("/api/group", require("./routes/groupRoutes"));

app.use("/api/faqs", require("./routes/faqRoutes"));

app.use("/api/signaturelabs", require("./routes/signatureLabsRoutes"));

app.use("/api/admissions", require("./routes/admissionsRoutes"));

app.use("/api/industry-partners", require("./routes/industryPartnerRoutes"));

app.use("/api/applications", require("./routes/applicationsRoutes"));

app.get("/", (req, res) => {
  res.send("Api is running....");
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
