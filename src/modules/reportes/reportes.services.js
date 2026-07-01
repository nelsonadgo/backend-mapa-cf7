const reportesRepository = require("./reportes.repository");
const httpError = require("../../utils/httpError");

const isNotFound = (error) => error && error.code === "PGRST116";

const mapSupabaseError = (error) => {
  if (isNotFound(error)) return httpError(404, "Reporte no encontrado");
  return error;
};

const listReportes = async () => {
    try {
        return await reportesRepository.findAll();
    } catch (error) {
        throw mapSupabaseError(error);
    }
};

const getReporteById = async (id) => {
    try {
        return await reportesRepository.findById(id);
    } catch (error) {
        throw mapSupabaseError(error);
    }
};

module.exports = {
    listReportes,
    getReporteById,
};