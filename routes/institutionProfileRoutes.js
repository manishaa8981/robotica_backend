const router = require("express").Router();
const institutionProfileController = require("../controllers/institutionProfileController");
const ensureAdmin = require("../middleware/ensureAdmin");
const authGuard = require("../middleware/authGuard");
const { uploadPDF } = require("../middleware/upload");

router.post(
    "/add",
    uploadPDF.fields([
        { name: "brochure", maxCount: 1 },
        { name: "certificate", maxCount: 1 },
        { name: "institutionCertificate", maxCount: 1 },
    ]),
    institutionProfileController.updateInstitutionProfile);
router.get("/get", institutionProfileController.getInstitutionProfile);

// Delete brochure
router.delete("/delete-brochure", institutionProfileController.deleteBrochure);

// Delete certificate
router.delete("/delete-certificate", institutionProfileController.deleteCertificate);

// Delete instution certificate
router.delete("/delete-institution-certificate", institutionProfileController.deleteInstitutionCertificate);

module.exports = router