const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../../config/supabase");
const env = require("../../config/env");
const httpError = require("../../utils/httpError");

// Registro de usuario
const register = async (req, res, next) => {
  try {
    const { legajo, nombre, password, rol = "visitante" } = req.body;

    if (!legajo || !password || !nombre) {
      throw httpError(
        400,
        "El legajo (o DNI), nombre y contraseña son obligatorios",
      );
    }

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data: nuevoUsuario, error: errorUsuario } = await supabase
      .from(env.perfilesTable)
      .insert([
        { legajo, nombre_completo: nombre, password: hashedPassword, rol },
      ])
      .select("id, legajo, nombre_completo, rol")
      .single();

    if (errorUsuario) throw errorUsuario;

    const { error: errorPreferencias } = await supabase
      .from("preferencias_accesibilidad")
      .insert([{ perfil_id: nuevoUsuario.id }]);

    if (errorPreferencias) throw errorPreferencias;

    return res.status(201).json({
      status: "success",
      mensaje: "Usuario registrado correctamente",
      datos: nuevoUsuario,
    });
  } catch (error) {
    next(error);
  }
};

// Inicio de sesión (Login)
const login = async (req, res, next) => {
  try {
    const { legajo, password } = req.body;

    if (!legajo || !password) {
      throw httpError(400, "El legajo/DNI y la contraseña son obligatorios");
    }

    const { data: usuario, error } = await supabase
      .from(env.perfilesTable)
      .select("*")
      .eq("legajo", legajo)
      .single();

    if (error || !usuario) {
      throw httpError(401, "Credenciales inválidas");
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      throw httpError(401, "Credenciales inválidas");
    }

    const token = jwt.sign(
      { id: usuario.id, legajo: usuario.legajo, rol: usuario.rol },
      env.jwtSecret,
      { expiresIn: "8h" },
    );

    return res.json({
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
  } catch (error) {
    next(error);
  }
};

// Inicio de sesión o registro con Google
const googleLogin = async (req, res, next) => {
  try {
    const { tokenGoogle } = req.body;

    if (!tokenGoogle) {
      throw httpError(400, "El token de Google es obligatorio");
    }

    // 1. Validar token con Google
    const googleResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${tokenGoogle}`,
    );
    const googleUser = await googleResponse.json();

    if (googleUser.error || googleUser.error_description) {
      throw httpError(401, "Token de Google inválido o expirado");
    }

    const emailGoogle = googleUser.email;
    const nombreGoogle = googleUser.name || emailGoogle;

    if (!emailGoogle) {
      throw httpError(
        400,
        "No se pudo obtener el email desde la cuenta de Google",
      );
    }

    // 2. Buscamos al usuario en Supabase
    let { data: usuario, error: errorBusqueda } = await supabase
      .from(env.perfilesTable)
      .select("*")
      .eq("legajo", emailGoogle)
      .maybeSingle();

    if (errorBusqueda) {
      throw httpError(
        500,
        `Error de Supabase al buscar: ${errorBusqueda.message}`,
      );
    }

    // 3. Si no existe, lo registramos automáticamente
    if (!usuario) {
      const { data: nuevoUsuario, error: errorInsert } = await supabase
        .from(env.perfilesTable)
        .insert([
          {
            legajo: emailGoogle,
            nombre_completo: nombreGoogle,
            password: "LOGIN_CON_GOOGLE",
            rol: "visitante",
          },
        ])
        .select("*")
        .single();

      if (errorInsert) {
        throw httpError(
          500,
          `Error de Supabase al insertar usuario: ${errorInsert.message}`,
        );
      }
      usuario = nuevoUsuario;

      // Crear preferencias de accesibilidad
      const { error: errorPref } = await supabase
        .from("preferencias_accesibilidad")
        .insert([{ perfil_id: usuario.id }]);

      if (errorPref) {
        console.error("Error al crear preferencias:", errorPref);
      }
    }

    // 4. Generamos el JWT de la aplicación
    const token = jwt.sign(
      {
        id: usuario.id,
        legajo: usuario.legajo,
        rol: usuario.rol,
      },
      env.jwtSecret,
      { expiresIn: "8h" },
    );

    return res.json({
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
    return res.status(err.statusCode || 500).json({
      status: "error",
      mensaje: err.message || "Error interno al procesar el login con Google",
    });
  }
};

module.exports = {
  register,
  login,
  googleLogin,
};
