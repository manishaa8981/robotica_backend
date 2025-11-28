const router = require("express").Router();
const teamController = require("../controllers/teamController");
const { upload } = require("../middleware/upload");

router.post("/", upload.single("image"), teamController.createTeamMember);
router.get("/", teamController.getAllTeamMembers);
router.get("/:id", teamController.getTeamMemberById);
router.put("/:id", upload.single("image"), teamController.updateTeamMember);
router.delete("/:id", teamController.deleteTeamMember);

module.exports = router;