const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: "error",
    mensaje: "Ruta no encontrada",
  });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "error",
    mensaje: err.message || "Error interno del servidor",
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};