const jwt = require("jsonwebtoken");
const env = require("../config/env");
const httpError = require("../utils/httpError");

const protegerRuta = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("HEADERS:", req.headers);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw httpError(401, "Acceso denegado. No se proporcionó un token válido.");
  }

  const token = authHeader.split(" ")[1];
  console.log("JWT SECRET AL VERIFICAR:", env.jwtSecret);
  console.log("TOKEN:", token);

  try {
    const verificado = jwt.verify(token, env.jwtSecret);
    // Inyectamos los datos del usuario (id, legajo, rol) en la petición
    console.log("TOKEN VERIFICADO:", verificado);
    req.user = verificado;
    next();
  } catch (error) {
    console.log("ERROR JWT:", error.message);
    throw httpError(401, "Token inválido o expirado");
  }

  console.log("AUTH HEADER:", authHeader);
  console.log("TOKEN:", token);
  console.log("LARGO TOKEN:", token.length);
};

module.exports = protegerRuta;
