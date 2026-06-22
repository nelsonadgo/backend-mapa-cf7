const { Router } = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const authController = require("./auth.controller");

const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: "success",
    mensaje: "Módulo auth funcionando",
  });
});

router.post("/login", asyncHandler(authController.login));
router.post("/register", asyncHandler(authController.register));

module.exports = router;
