const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.post("/send", contactController.addContactQuery);
router.get("/", contactController.getAllContacts);
router.get("/contact/:id", contactController.getContactById);

module.exports = router;
