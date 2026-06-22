const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../../config/supabase");
const env = require("../../config/env");
const httpError = require("../../utils/httpError");

// Registro de usuario
const register = async (req, res) => {
  // Ajuste 1: Cambiamos el rol por defecto a "visitante" para que el ENUM de Postgres no falle
  const { legajo, nombre, password, rol = "visitante" } = req.body;

  if (!legajo || !password || !nombre) {
    throw httpError(
      400,
      "El legajo (o DNI), nombre y contraseña son obligatorios",
    );
  }

  // Verificar si el legajo ya existe
  const { data: usuarioExistente } = await supabase
    .from(env.perfilesTable)
    .select("id")
    .eq("legajo", legajo)
    .single();

  if (usuarioExistente) {
    throw httpError(
      400,
      "Ya existe un usuario registrado con ese número de identificación",
    );
  }

  // Encriptar la contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Guardar en la tabla perfiles
  const { data: nuevoUsuario, error } = await supabase
    .from(env.perfilesTable)
    .insert([
      { legajo, nombre_completo: nombre, password: hashedPassword, rol },
    ])
    .select("id, legajo, nombre_completo, rol")
    .single();

  if (error) throw error;

  res.status(201).json({
    status: "success",
    mensaje: "Usuario registrado correctamente",
    datos: nuevoUsuario,
  });
};

// Inicio de sesión (Login)
const login = async (req, res) => {
  const { legajo, password } = req.body;

  if (!legajo || !password) {
    throw httpError(400, "El legajo/DNI y la contraseña son obligatorios");
  }

  // Buscar al usuario por legajo
  const { data: usuario, error } = await supabase
    .from(env.perfilesTable)
    .select("*")
    .eq("legajo", legajo)
    .single();

  if (error || !usuario) {
    throw httpError(401, "Credenciales inválidas");
  }

  // Comparar la contraseña ingresada con la encriptada
  const passwordValida = await bcrypt.compare(password, usuario.password);
  if (!passwordValida) {
    throw httpError(401, "Credenciales inválidas");
  }

  // Generar el Token (JWT)
  const token = jwt.sign(
    { id: usuario.id, legajo: usuario.legajo, rol: usuario.rol },
    env.jwtSecret,
    { expiresIn: "8h" }, // El token dura 8 horas
  );

  res.json({
    status: "success",
    mensaje: "Inicio de sesión exitoso",
    token,
    usuario: {
      id: usuario.id,
      legajo: usuario.legajo,
      nombre: usuario.nombre_completo,
      rol: usuario.rol,
    },
  });
};

module.exports = {
  register,
  login,
};
