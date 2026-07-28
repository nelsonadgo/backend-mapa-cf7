const express = require("express");
const router = express.Router();

const analyticsController = require("./analytics.controller");
const protegerRuta = require("../../middlewares/auth.middleware");

router.post("/login", protegerRuta, analyticsController.registrarLogin);

router.post(
  "/accessibility",
  protegerRuta,
  analyticsController.registrarAccesibilidad,
);

module.exports = router;
