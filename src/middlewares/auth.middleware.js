const jwt = require("jsonwebtoken");
const env = require("../../config/env");
const httpError = require("../../utils/httpError");

const protegerRuta = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw httpError(401, "Acceso denegado. No se proporcionó un token válido.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const verificado = jwt.verify(token, env.jwtSecret);
    // Inyectamos los datos del usuario (id, legajo, rol) en la petición
    req.usuario = verificado; 
    next();
  } catch (error) {
    throw httpError(401, "Token inválido o expirado");
  }
};

module.exports = protegerRuta;