const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const authGuard = require("../middleware/authGuard");
const ensureAdmin = require("../middleware/ensureAdmin");
const programsController = require("../controllers/programsController");

// ---------------- MAIN PROGRAM SECTION ----------------

// Create / Update Program (image included)
router.post(
  "/",
  authGuard,
  ensureAdmin,
  upload.single("image"),
  programsController.managePrograms
);

// Get program
router.get("/", programsController.getPrograms);

// ---------------- LEARNING OUTCOMES ----------------

// Add outcome
router.post("/outcomes", authGuard, ensureAdmin, programsController.addOutcome);

// Update outcome
router.put(
  "/outcomes/:outcomeId",
  authGuard,
  ensureAdmin,
  programsController.updateOutcome
);

// Delete outcome
router.delete(
  "/outcomes/:outcomeId",
  authGuard,
  ensureAdmin,
  programsController.deleteOutcome
);

// ---------------- SEMESTERS ----------------

// Add semester
router.post(
  "/semesters",
  authGuard,
  ensureAdmin,
  programsController.addSemester
);

// Update semester
router.put(
  "/semesters/:semesterId",
  authGuard,
  ensureAdmin,
  programsController.updateSemester
);

// Delete semester
router.delete(
  "/semesters/:semesterId",
  authGuard,
  ensureAdmin,
  programsController.deleteSemester
);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { upload } = require("../middleware/upload");
// const authGuard = require("../middleware/authGuard");
// const ensureAdmin = require("../middleware/ensureAdmin");
// const programsController = require("../controllers/programsController");

// // Main section
// router.post("/", authGuard, ensureAdmin, programsController.managePrograms);
// router.get("/", programsController.getPrograms);

// // Items
// router.post("/items/:mainId", upload.single("image"), authGuard, ensureAdmin, programsController.addItem);
// router.put("/items/:itemId", upload.single("image"), authGuard, ensureAdmin, programsController.updateItem);
// router.delete("/items/:itemId", authGuard, ensureAdmin, programsController.deleteItem);

// module.exports = router;
