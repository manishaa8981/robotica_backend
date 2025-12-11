const router = require("express").Router();
const applicationController = require("../controllers/applicationsController");
const authGuard = require("../middleware/authGuard");
const ensureAdmin = require("../middleware/ensureAdmin");

// Public – submit application
router.post("/", applicationController.submitApplication);

// Admin – list all applications
router.get(
  "/admin",
  authGuard,
  ensureAdmin,
  applicationController.getAllApplications
);

// Admin – update status / mark read
router.put(
  "/:id",
  authGuard,
  ensureAdmin,
  applicationController.updateApplication
);

// Admin – delete application
router.delete(
  "/:id",
  authGuard,
  ensureAdmin,
  applicationController.deleteApplication
);

module.exports = router;
