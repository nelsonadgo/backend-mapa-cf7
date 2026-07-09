const express = require("express");
const router = express.Router();
const preferencesController = require("../controllers/preferences.controller");
const protegerRuta = require("../middlewares/auth.middleware");

router.get("/", protegerRuta, preferencesController.getPreferences);
router.put("/", protegerRuta, preferencesController.updatePreferences);

module.exports = router;