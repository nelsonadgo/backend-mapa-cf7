const espaciosRepository = require("./espacios.repository.js");
const httpError = require("../../utils/httpError");

const isNotFound = (error) => error && error.code === "PGRST116";

const mapSupabaseError = (error) => {
  if (isNotFound(error)) return httpError(404, "Espacio no encontrado");
  return error;
};

const listEspacios = async (filters) => {
  try {
    return await espaciosRepository.findAll(filters);
  } catch (error) {
    throw mapSupabaseError(error);
  }
};

const getEspacioById = async (id) => {
  try {
    return await espaciosRepository.findById(id);
  } catch (error) {
    throw mapSupabaseError(error);
  }
};

const createEspacio = async (payload) => {
  try {
    return await espaciosRepository.create(payload);
  } catch (error) {
    throw mapSupabaseError(error);
  }
};

const updateEspacio = async (id, payload) => {
  try {
    return await espaciosRepository.updateById(id, payload);
  } catch (error) {
    throw mapSupabaseError(error);
  }
};

const deleteEspacio = async (id) => {
  try {
    return await espaciosRepository.deleteById(id);
  } catch (error) {
    throw mapSupabaseError(error);
  }
};

module.exports = {
  listEspacios,
  getEspacioById,
  createEspacio,
  updateEspacio,
  deleteEspacio,
};
