const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../../config/supabase");
const env = require("../../config/env");
const httpError = require("../../utils/httpError");

// Registro de usuario
const register = async (req, res, next) => {
  try {
    // Cambiamos el rol por defecto a "visitante" para que el ENUM de Postgres no falle
    const { legajo, nombre, password, rol = "visitante" } = req.body;

    if (!legajo || !password || !nombre) {
      throw httpError(
        400,
        "El legajo (o DNI), nombre y contraseña son obligatorios"
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
        "Ya existe un usuario registrado con ese número de identificación"
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

    // Crear automáticamente el registro de preferencias de accesibilidad
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

    // Buscar al usuario por legajo
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

    // Generar el Token (JWT)
    const token = jwt.sign(
      { id: usuario.id, legajo: usuario.legajo, rol: usuario.rol },
      env.jwtSecret,
      { expiresIn: "8h" }
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

    // 1. Le pedimos a Google que nos valide el token y nos dé los datos del usuario
    const googleResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${tokenGoogle}`
    );
    const googleUser = await googleResponse.json();

    if (googleUser.error || googleUser.error_description) {
      console.error("Respuesta de error de Google:", googleUser);
      throw httpError(401, "Token de Google inválido o expirado");
    }

    const emailGoogle = googleUser.email;
    const nombreGoogle = googleUser.name || emailGoogle;

    if (!emailGoogle) {
      throw httpError(400, "No se pudo obtener el email desde la cuenta de Google");
    }

    // 2. Buscamos si el usuario ya existe en perfiles usando el email
    let { data: usuario } = await supabase
      .from(env.perfilesTable)
      .select("*")
      .eq("legajo", emailGoogle)
      .maybeSingle();

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

      if (errorInsert) throw errorInsert;
      usuario = nuevoUsuario;

      // Crear preferencias de accesibilidad por defecto
      await supabase
        .from("preferencias_accesibilidad")
        .insert([{ perfil_id: usuario.id }]);
    }

    // 4. Generamos el JWT de la aplicación
    const token = jwt.sign(
      {
        id: usuario.id,
        legajo: usuario.legajo,
        rol: usuario.rol,
      },
      env.jwtSecret,
      { expiresIn: "8h" }
    );

    console.log("✅ LOGIN CON GOOGLE EXITOSO PARA:", usuario.legajo);

    // 5. Devolvemos la respuesta
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
    next(err);
  }
};

module.exports = {
  register,
  login,
  googleLogin,
};