const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../../config/supabase");
const env = require("../../config/env");
const httpError = require("../../utils/httpError");

// Registro de usuario
const register = async (req, res) => {
  // Cambiamos el rol por defecto a "visitante" para que el ENUM de Postgres no falle
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
  const { data: nuevoUsuario, error: errorUsuario } = await supabase
    .from(env.perfilesTable)
    .insert([
      { legajo, nombre_completo: nombre, password: hashedPassword, rol },
    ])
    .select("id, legajo, nombre_completo, rol")
    .single();

  if (errorUsuario) throw errorUsuario;

  // Crear automáticamente el registro de preferencias de accesibilidad enlazado al ID del nuevo usuario
  const { error: errorPreferencias } = await supabase
    .from("preferencias_accesibilidad")
    .insert([{ perfil_id: nuevoUsuario.id }]);

  if (errorPreferencias) {
    throw errorPreferencias;
  }

  res.status(201).json({
    status: "success",
    mensaje: "Usuario registrado correctamente",
    datos: nuevoUsuario,
  });
};

// Inicio de sesión (Login)
const login = async (req, res) => {
  console.log("ENTRO AL LOGIN");
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

  console.log("LEGAJO RECIBIDO:", legajo);
  console.log("ERROR SUPABASE:", error);
  console.log("USUARIO:", usuario);

  if (error || !usuario) {
    throw httpError(401, "Credenciales inválidas");
  }

  // Comparar la contraseña ingresada con la encriptada
  console.log("Password enviada:", password);
  console.log("Password en BD:", usuario.password);
  const passwordValida = await bcrypt.compare(password, usuario.password);

  console.log("Resultado compare:", passwordValida);
  console.log("PASSWORD VALIDA:", passwordValida);

  if (!passwordValida) {
    throw httpError(401, "Credenciales inválidas");
  }

  console.log("JWT SECRET AL FIRMAR:", env.jwtSecret);
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

// Inicio de sesión o registro con Google
const googleLogin = async (req, res) => {
  const { tokenGoogle } = req.body;

  if (!tokenGoogle) {
    throw httpError(400, "El token de Google es obligatorio");
  }

  try {
    // 1. Le pedimos a Google que nos valide si el token es real y nos dé los datos del usuario
    const googleResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${tokenGoogle}`,
    );
    const googleUser = await googleResponse.json();

    if (googleUser.error_description) {
      throw httpError(401, "Token de Google inválido o expirado");
    }

    // Usamos el email de Google o el "sub" (ID único de Google) como identificador único
    const emailGoogle = googleUser.email;
    const nombreGoogle = googleUser.name;

    // 2. Buscamos si el usuario ya existe en tu tabla de perfiles usando el email como "legajo" o identificador
    let { data: usuario, error } = await supabase
      .from(env.perfilesTable)
      .select("*")
      .eq("legajo", emailGoogle)
      .maybeSingle(); // Usamos maybeSingle para que no rompa si no encuentra nada

    // 3. Si no existe, lo registramos automáticamente (Registro automático por Google)
    if (!usuario) {
      const { data: nuevoUsuario, error: errorInsert } = await supabase
        .from(env.perfilesTable)
        .insert([
          {
            legajo: emailGoogle, // Guardamos el mail como identificador
            nombre_completo: nombreGoogle,
            password: "LOGIN_CON_GOOGLE", // No necesita contraseña real
            rol: "visitante",
          },
        ])
        .select("*")
        .single();

      if (errorInsert) throw errorInsert;
      usuario = nuevoUsuario;

      // Creamos sus preferencias de accesibilidad por defecto
      await supabase
        .from("preferencias_accesibilidad")
        .insert([{ perfil_id: usuario.id }]);
    }

    // 4. Generamos TU propio Token (JWT) de tu aplicación, igual que en el login tradicional
    const token = jwt.sign(
      { id: usuario.id,
         legajo: usuario.legajo,
          rol: usuario.rol
         },
      env.jwtSecret,
      { expiresIn: "8h" },
    );

    // 5. Devolvemos la respuesta exitosa
    res.json({
      status: "success",
      mensaje: "Inicio de sesión con Google exitoso",
      token,
      usuario: {
        id: usuario.id,
        legajo: usuario.legajo,
        nombre: usuario.nombre_completo,
        rol: usuario.rol,
      },
    });
  } catch (err) {
    if (err.statusCode) {
      throw err;
    }
    console.error("Error inesperado en Google Login", err);
    throw httpError(500, "Error interno al procesar el login con Google");
  }

  console.log("TOKEN GENERADO:", token);
};

// Exportamos de manera limpia al final de todo el archivo
module.exports = {
  register,
  login,
  googleLogin,
};
