const recorridosRepository = require("./recorridos.repository");
const httpError = require("../../utils/httpError");

const listRecorridos = async (filters) => {
  return recorridosRepository.findAll(filters);
};

const getRecorridoById = async (id) => {
  const recorrido = await recorridosRepository.findById(id);

  if (!recorrido) {
    throw httpError(404, "Recorrido no encontrado");
  }

  return recorrido;
};

const createRecorrido = async (payload) => {
  return recorridosRepository.create(payload);
};

const updateRecorrido = async (id, payload) => {
  const recorrido = await recorridosRepository.updateById(id, payload);

  if (!recorrido) {
    throw httpError(404, "Recorrido no encontrado");
  }

  return recorrido;
};

const deleteRecorrido = async (id) => {
  const recorrido = await recorridosRepository.deleteById(id);

  if (!recorrido) {
    throw httpError(404, "Recorrido no encontrado");
  }

  return recorrido;
};

module.exports = {
  listRecorridos,
  getRecorridoById,
  createRecorrido,
  updateRecorrido,
  deleteRecorrido,
};
