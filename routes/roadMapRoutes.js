const express = require("express");
const router = express.Router();
const roadMapController = require("../controllers/roadMapController");

router.post("/add", roadMapController.addRoadMap);
router.get("/get", roadMapController.getRoadMaps);
router.put("/update/:id", roadMapController.updateRoadMap);
router.delete("/delete/:id", roadMapController.deleteRoadMap);

module.exports = router;
