const httpError = require("../../utils/httpError");

const writableFields = [
  "nombre",
  "descripcion",
  "origen",
  "destino",
  "origen_id",
  "destino_id",
  "sector_origen",
  "sector_destino",
  "pasos",
  "distancia_metros",
  "duracion_estimada_min",
  "es_accesible",
  "estado",
  "metadata",
];

const numberFields = [
  "origen_id",
  "destino_id",
  "distancia_metros",
  "duracion_estimada_min",
];

const booleanFields = ["es_accesible"];

const normalizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
};

const normalizeRecorridoPayload = (body, { partial = false } = {}) => {
  const payload = {};

  writableFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = body[field];
    }
  });

  if (!partial && !payload.nombre) {
    throw httpError(400, "El campo nombre es obligatorio");
  }

  if (!partial && !payload.origen && !payload.origen_id) {
    throw httpError(400, "Debe indicar origen u origen_id");
  }

  if (!partial && !payload.destino && !payload.destino_id) {
    throw httpError(400, "Debe indicar destino o destino_id");
  }

  if (payload.nombre !== undefined) {
    payload.nombre = String(payload.nombre).trim();

    if (payload.nombre.length < 2) {
      throw httpError(400, "El nombre debe tener al menos 2 caracteres");
    }
  }

  if (payload.descripcion !== undefined && payload.descripcion !== null) {
    payload.descripcion = String(payload.descripcion).trim();
  }

  if (payload.origen !== undefined && payload.origen !== null) {
    payload.origen = String(payload.origen).trim();
  }

  if (payload.destino !== undefined && payload.destino !== null) {
    payload.destino = String(payload.destino).trim();
  }

  numberFields.forEach((field) => {
    if (payload[field] !== undefined && payload[field] !== null) {
      const value = Number(payload[field]);

      if (Number.isNaN(value)) {
        throw httpError(400, `El campo ${field} debe ser numérico`);
      }

      payload[field] = value;
    }
  });

  booleanFields.forEach((field) => {
    if (payload[field] !== undefined) {
      payload[field] = normalizeBoolean(payload[field]);

      if (typeof payload[field] !== "boolean") {
        throw httpError(400, `El campo ${field} debe ser booleano`);
      }
    }
  });

  if (payload.pasos !== undefined && typeof payload.pasos === "string") {
    try {
      payload.pasos = JSON.parse(payload.pasos);
    } catch (error) {
      throw httpError(400, "El campo pasos debe ser un array JSON válido");
    }
  }

  if (payload.pasos !== undefined && !Array.isArray(payload.pasos)) {
    throw httpError(400, "El campo pasos debe ser un array");
  }

  if (payload.estado !== undefined) {
    const estadosValidos = ["activo", "inactivo", "borrador"];

    if (!estadosValidos.includes(payload.estado)) {
      throw httpError(
        400,
        "El campo estado debe ser activo, inactivo o borrador",
      );
    }
  }

  if (partial && Object.keys(payload).length === 0) {
    throw httpError(400, "No se enviaron campos válidos para actualizar");
  }

  return payload;
};

const normalizeListQuery = (query) => {
  const limit = Math.min(Number(query.limit) || 20, 100);
  const offset = Number(query.offset) || 0;

  if (limit < 1) {
    throw httpError(400, "El límite debe ser mayor a 0");
  }

  if (offset < 0) {
    throw httpError(400, "El offset no puede ser negativo");
  }

  return {
    limit,
    offset,
    search: query.search ? String(query.search).trim() : undefined,
    origen: query.origen ? String(query.origen).trim() : undefined,
    destino: query.destino ? String(query.destino).trim() : undefined,
    sector: query.sector ? String(query.sector).trim() : undefined,
    accesible:
      query.accesible === undefined ? undefined : query.accesible === "true",
    estado: query.estado ? String(query.estado).trim() : undefined,
  };
};

module.exports = {
  normalizeRecorridoPayload,
  normalizeListQuery,
};
