const supabase = require("../../config/supabase");
const env = require("../../config/env");

const table = () => supabase.from(env.reportesTable);

const findAll = async () => {
  const { data, error, count } = await table()
    .select(`
        *,
        fotos:fotos_reporte(url, leyenda, orden_visualizacion)
      `)
    .order("fecha_creacion", { ascending: false });
  if (error) throw error;

  return { data, count };
};

const findById = async (id) => {
  const { data, error } = await table().select("*,fotos:fotos_reporte(*)").eq("id", id).single();

  if (error) throw error;
  return data;
};

module.exports = {
    findAll,
    findById,
};