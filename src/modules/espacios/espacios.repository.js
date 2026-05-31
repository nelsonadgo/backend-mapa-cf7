const supabase = require('../../config/supabase');
const env = require('../../config/env');

const table = () => supabase.from(env.espaciosTable);

const findAll = async ({ limit, offset, search, categoriaId, pisoId, accesible }) => {
    let query = table()
        .select('*', { count: 'exact' })
        .order('nombre', { ascending: true })
        .range(offset, offset + limit - 1);

    if (search) {
        query = query.or(`nombre.ilike.%${search}%,descripcion.ilike.%${search}%,sector.ilike.%${search}%`);
    }

    if (categoriaId) query = query.eq('categoria_id', categoriaId);
    if (pisoId) query = query.eq('piso_id', pisoId);
    if (accesible !== undefined) query = query.eq('es_accesible', accesible);

    const { data, error, count } = await query;
    if (error) throw error;

    return { data, count };
};

const findById = async (id) => {
    const { data, error } = await table()
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

const create = async (payload) => {
    const { data, error } = await table()
        .insert(payload)
        .select('*')
        .single();

    if (error) throw error;
    return data;
};

const updateById = async (id, payload) => {
    const { data, error } = await table()
        .update(payload)
        .eq('id', id)
        .select('*')
        .single();

    if (error) throw error;
    return data;
};

const deleteById = async (id) => {
    const { data, error } = await table()
        .delete()
        .eq('id', id)
        .select('*')
        .single();

    if (error) throw error;
    return data;
};

module.exports = {
    findAll,
    findById,
    create,
    updateById,
    deleteById
};
