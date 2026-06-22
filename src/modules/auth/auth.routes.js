const { Router } = require("express");
const authController = require("./auth.controller");
const asyncHandler = require("../../utils/asyncHandler");

const router = Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));

module.exports = router;