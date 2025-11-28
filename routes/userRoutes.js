const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/login", userController.loginUser);

router.get("/getAdmin/:id", userController.getAdminById)

module.exports = router