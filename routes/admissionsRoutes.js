// const express = require("express");
// const router = express.Router();

// const admissionsController = require("../controllers/admissionsController");

// // const authGuard = require("../middleware/authGuard");
// // const ensureAdmin = require("../middleware/ensureAdmin");

// router.get("/", admissionsController.getAdmissions);
// router.post("/", admissionsController.manageAdmissions);

// module.exports = router;
// routes/admissionsRoutes.js
const express = require("express");
const router = express.Router();

const {
  getAdmissions,
  upsertAdmissions,
} = require("../controllers/admissionsController");

// Get current admissions doc
router.get("/", getAdmissions);

// Create/update admissions doc (single doc)
router.post("/", upsertAdmissions);


module.exports = router;
