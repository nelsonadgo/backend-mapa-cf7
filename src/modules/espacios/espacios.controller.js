const espaciosService = require("./espacios.services.js");
const {
  normalizeEspacioPayload,
  normalizeListQuery,
} = require("./espacios.validation");

const listEspacios = async (req, res) => {
  const filters = normalizeListQuery(req.query);
  const { data, count } = await espaciosService.listEspacios(filters);

  res.json({
    status: "success",
    total: count,
    limit: filters.limit,
    offset: filters.offset,
    datos: data,
  });
};

const getEspacio = async (req, res) => {
  const espacio = await espaciosService.getEspacioById(req.params.id);

  res.json({
    status: "success",
    datos: espacio,
  });
};

const createEspacio = async (req, res) => {
  const payload = normalizeEspacioPayload(req.body);
  const espacio = await espaciosService.createEspacio(payload);

  res.status(201).json({
    status: "success",
    mensaje: "Espacio creado correctamente",
    datos: espacio,
  });
};

const replaceEspacio = async (req, res) => {
  const payload = normalizeEspacioPayload(req.body);
  const espacio = await espaciosService.updateEspacio(req.params.id, payload);

  res.json({
    status: "success",
    mensaje: "Espacio actualizado correctamente",
    datos: espacio,
  });
};

const updateEspacio = async (req, res) => {
  const payload = normalizeEspacioPayload(req.body, { partial: true });
  const espacio = await espaciosService.updateEspacio(req.params.id, payload);

  res.json({
    status: "success",
    mensaje: "Espacio actualizado correctamente",
    datos: espacio,
  });
};

const deleteEspacio = async (req, res) => {
  const espacio = await espaciosService.deleteEspacio(req.params.id);

  res.json({
    status: "success",
    mensaje: "Espacio eliminado correctamente",
    datos: espacio,
  });
};

module.exports = {
  listEspacios,
  getEspacio,
  createEspacio,
  replaceEspacio,
  updateEspacio,
  deleteEspacio,
};
