const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload"); 
const authGuard = require("../middleware/authGuard");
const ensureAdmin = require("../middleware/ensureAdmin");
const signatureLabsController = require("../controllers/signatureLabsController");

// NOTE: add authGuard + ensureAdmin around POST/PUT/DELETE if you want
// e.g. router.post("/", authGuard, ensureAdmin, ...)

router.post(
  "/",
  authGuard,
  ensureAdmin,
  signatureLabsController.manageSignatureLabs
);
router.get("/", signatureLabsController.getSignatureLabs);

router.post(
  "/labs",
  authGuard,
  ensureAdmin,
  upload.array("images", 10),
  signatureLabsController.addLab
);

router.put(
  "/labs/:labId",
  authGuard,
  ensureAdmin,
  upload.array("images", 10),
  signatureLabsController.updateLab
);

router.delete(
  "/labs/:labId",
  authGuard,
  ensureAdmin,
  signatureLabsController.deleteLab
);

// optional – delete a single image from a lab
router.delete(
  "/labs/:labId/images/:imageName",
  authGuard,
  ensureAdmin,
  signatureLabsController.deleteLabImage
);

module.exports = router;
