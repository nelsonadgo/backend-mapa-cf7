const supabase = require("../../config/supabase");
const httpError = require("../../utils/httpError");

// Obtener las preferencias del usuario autenticado
const getPreferences = async (req, res) => {
  // El id viene del middleware de autenticación (token JWT)
  const perfil_id = req.usuario.id; 

  const { data: preferencias, error } = await supabase
    .from("preferencias_accesibilidad")
    .select("*")
    .eq("perfil_id", perfil_id)
    .single();

  if (error || !preferencias) {
    throw httpError(404, "No se encontraron preferencias para este usuario");
  }

  res.json({
    status: "success",
    datos: preferencias
  });
};

// Actualizar las preferencias del usuario autenticado
const updatePreferences = async (req, res) => {
  const perfil_id = req.usuario.id;
  
  // Extraemos solo los campos permitidos para evitar que modifiquen el id o perfil_id
  const { 
    requiere_ascensor, 
    evita_escaleras, 
    requiere_rampa, 
    alto_contraste, 
    escala_fuente, 
    movimiento_reducido 
  } = req.body;

  // Creamos el objeto con los campos que se enviaron en el body
  const camposAActualizar = {};
  if (requiere_ascensor !== undefined) camposAActualizar.requiere_ascensor = requiere_ascensor;
  if (evita_escaleras !== undefined) camposAActualizar.evita_escaleras = evita_escaleras;
  if (requiere_rampa !== undefined) camposAActualizar.requiere_rampa = requiere_rampa;
  if (alto_contraste !== undefined) camposAActualizar.alto_contraste = alto_contraste;
  if (escala_fuente !== undefined) camposAActualizar.escala_fuente = escala_fuente;
  if (movimiento_reducido !== undefined) camposAActualizar.movimiento_reducido = movimiento_reducido;
  
  camposAActualizar.fecha_actualizacion = new Date();

  const { data: preferenciasActualizadas, error } = await supabase
    .from("preferencias_accesibilidad")
    .update(camposAActualizar)
    .eq("perfil_id", perfil_id)
    .select()
    .single();

  if (error) {
    // Si la escala_fuente no pasa el CHECK (50-200) de Postgres, saltará un error aquí
    throw httpError(400, `Error al actualizar las preferencias: ${error.message}`);
  }

  res.json({
    status: "success",
    mensaje: "Preferencias actualizadas correctamente",
    datos: preferenciasActualizadas
  });
};

module.exports = {
  getPreferences,
  updatePreferences
};