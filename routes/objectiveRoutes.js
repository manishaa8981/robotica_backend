const express = require("express");
const router = express.Router();
const objectivesController = require("../controllers/objectiveController");

router.post("/add", objectivesController.addObjective);
router.get("/get", objectivesController.getObjectives);
router.put("/update/:id", objectivesController.updateObjective);
router.delete("/delete/:id", objectivesController.deleteObjective);

module.exports = router;
