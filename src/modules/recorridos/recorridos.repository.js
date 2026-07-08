const supabase = require("../../config/supabase");
const env = require("../../config/env");

const findAll = async ({
  limit = 20,
  offset = 0,
  search,
  origen,
  destino,
  sector,
  accesible,
  estado,
}) => {
  let query = supabase
    .from(env.recorridosTable)
    .select("*", { count: "exact" });

  if (search) {
    query = query.or(
      `nombre.ilike.%${search}%,descripcion.ilike.%${search}%,origen.ilike.%${search}%,destino.ilike.%${search}%,sector_destino.ilike.%${search}%`
    );
  }

  if (origen) query = query.ilike("origen", `%${origen}%`);
  if (destino) query = query.ilike("destino", `%${destino}%`);
  if (sector) query = query.ilike("sector_destino", `%${sector}%`);
  if (accesible !== undefined) query = query.eq("es_accesible", accesible);
  if (estado) query = query.eq("estado", estado);

  // Paginación en Supabase
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) throw error;

  return { data, count };
};

const findById = async (id) => {
  const { data, error } = await supabase
    .from(env.recorridosTable)
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data || null;
};

const create = async (payload) => {
  const { data, error } = await supabase
    .from(env.recorridosTable)
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const updateById = async (id, payload) => {
  const { data, error } = await supabase
    .from(env.recorridosTable)
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data || null;
};

const deleteById = async (id) => {
  const { data, error } = await supabase
    .from(env.recorridosTable)
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data || null;
};

module.exports = {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
};