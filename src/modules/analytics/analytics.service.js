const supabase = require("../../config/supabase");

async function registrarLogin(req) {
  const userId = req.user ? req.user.id : null;

  // Mapeamos el rol que viene en req.user (del token)
  let userType = "Usuario general";

  if (req.user && req.user.rol) {
    const rol = String(req.user.rol).toLowerCase();

    // Si en Supabase dice 'admin' o 'administrador', lo detectamos
    if (rol === "admin" || rol === "administrador") {
      userType = "Administrador";
    }
  }

  // 1. Detectar dispositivo (mobile vs computadora)
  const userAgent = req.headers["user-agent"] || "";
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
  const deviceType = isMobile ? "mobile" : "computadora";

  // 2. Consultar si es la primera visita
  let isFirstVisit = true;
  if (userId) {
    const { count } = await supabase
      .from("log_in_events")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    isFirstVisit = count === 0;
  }

  // 3. Registrar evento en Supabase
  const { data, error } = await supabase.from("log_in_events").insert([
    {
      user_id: userId,
      user_type: userType,
      is_first_visit: isFirstVisit,
      device_type: deviceType,
    },
  ]);

  if (error) throw error;
  return data;
}

async function registrarAccesibilidad(req) {
  const userId = req.user ? req.user.id : null;
  const { accessibility_option, action_type } = req.body;

  const { data, error } = await supabase.from("accessibility_events").insert([
    {
      user_id: userId,
      accessibility_option: accessibility_option,
      action_type: action_type,
    },
  ]);

  if (error) throw error;
  return data;
}

module.exports = {
  registrarLogin,
  registrarAccesibilidad,
};
