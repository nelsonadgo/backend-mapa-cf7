const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: "success",
    mensaje: "Módulo auth funcionando",
  });
});

router.post("/login", (req, res) => {
  res.json({
    status: "success",
    mensaje: "Login pendiente de implementación",
  });
});

router.post("/register", (req, res) => {
  res.status(201).json({
    status: "success",
    mensaje: "Registro pendiente de implementación",
  });
});

module.exports = router;