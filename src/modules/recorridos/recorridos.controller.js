const recorridosService = require("./recorridos.services");
const {
  normalizeRecorridoPayload,
  normalizeListQuery,
} = require("./recorridos.validation");

const listRecorridos = async (req, res) => {
  const filters = normalizeListQuery(req.query);
  const { data, count } = await recorridosService.listRecorridos(filters);

  res.json({
    status: "success",
    total: count,
    limit: filters.limit,
    offset: filters.offset,
    datos: data,
  });
};

const getRecorrido = async (req, res) => {
  const recorrido = await recorridosService.getRecorridoById(req.params.id);

  res.json({
    status: "success",
    datos: recorrido,
  });
};

const createRecorrido = async (req, res) => {
  const payload = normalizeRecorridoPayload(req.body);
  const recorrido = await recorridosService.createRecorrido(payload);

  res.status(201).json({
    status: "success",
    mensaje: "Recorrido creado correctamente",
    datos: recorrido,
  });
};

const updateRecorrido = async (req, res) => {
  const payload = normalizeRecorridoPayload(req.body, { partial: true });

  const recorrido = await recorridosService.updateRecorrido(
    req.params.id,
    payload,
  );

  res.json({
    status: "success",
    mensaje: "Recorrido actualizado correctamente",
    datos: recorrido,
  });
};

const deleteRecorrido = async (req, res) => {
  const recorrido = await recorridosService.deleteRecorrido(req.params.id);

  res.json({
    status: "success",
    mensaje: "Recorrido eliminado correctamente",
    datos: recorrido,
  });
};

module.exports = {
  listRecorridos,
  getRecorrido,
  createRecorrido,
  updateRecorrido,
  deleteRecorrido,
};
