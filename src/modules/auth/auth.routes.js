const { Router } = require("express");

const authController = require("./auth.controller");
//const asyncHandler = require("../../utils/asyncHandler");

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google", authController.googleLogin);

module.exports = router;
