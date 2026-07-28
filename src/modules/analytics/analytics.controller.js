const analyticsService = require("./analytics.service");

exports.registrarLogin = async (req, res, next) => {
  console.log("ENTRÓ AL CONTROLLER ANALYTICS");
  try {
    await analyticsService.registrarLogin(req);

    res.status(201).json({
      status: "success",
      mensaje: "Login registrado correctamente.",
    });
  } catch (error) {
    next(error);
  }
};

exports.registrarAccesibilidad = async (req, res, next) => {
  try {
    await analyticsService.registrarAccesibilidad(req);

    res.status(201).json({
      status: "success",
      mensaje: "Evento de accesibilidad registrado.",
    });
  } catch (error) {
    next(error);
  }
};
