const httpError = require('../../utils/httpError');

const writableFields = [
    'nombre',
    'descripcion',
    'categoria_id',
    'piso_id',
    'sector',
    'codigo',
    'capacidad',
    'es_accesible',
    'tiene_rampa',
    'tiene_ascensor',
    'tiene_qr',
    'qr_url',
    'foto_url',
    'imagen_360_url',
    'punto_mapa_x',
    'punto_mapa_y',
    'estado',
    'metadata'
];

const booleanFields = ['es_accesible', 'tiene_rampa', 'tiene_ascensor', 'tiene_qr'];
const numberFields = ['capacidad', 'punto_mapa_x', 'punto_mapa_y'];

const normalizeEspacioPayload = (body, { partial = false } = {}) => {
    const payload = {};

    writableFields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
            payload[field] = body[field];
        }
    });

    if (!partial && !payload.nombre) {
        throw httpError(400, 'El campo nombre es obligatorio');
    }

    if (payload.nombre !== undefined && String(payload.nombre).trim().length < 2) {
        throw httpError(400, 'El nombre debe tener al menos 2 caracteres');
    }

    booleanFields.forEach((field) => {
        if (payload[field] !== undefined && typeof payload[field] !== 'boolean') {
            throw httpError(400, `El campo ${field} debe ser booleano`);
        }
    });

    numberFields.forEach((field) => {
        if (payload[field] !== undefined && payload[field] !== null && Number.isNaN(Number(payload[field]))) {
            throw httpError(400, `El campo ${field} debe ser numerico`);
        }
    });

    if (payload.nombre !== undefined) payload.nombre = String(payload.nombre).trim();
    if (payload.descripcion !== undefined && payload.descripcion !== null) payload.descripcion = String(payload.descripcion).trim();
    if (payload.sector !== undefined && payload.sector !== null) payload.sector = String(payload.sector).trim();
    if (payload.codigo !== undefined && payload.codigo !== null) payload.codigo = String(payload.codigo).trim();

    numberFields.forEach((field) => {
        if (payload[field] !== undefined && payload[field] !== null) {
            payload[field] = Number(payload[field]);
        }
    });

    if (partial && Object.keys(payload).length === 0) {
        throw httpError(400, 'No se enviaron campos validos para actualizar');
    }

    return payload;
};

const normalizeListQuery = (query) => {
    const limit = Math.min(Number(query.limit) || 20, 100);
    const offset = Number(query.offset) || 0;

    if (limit < 1) throw httpError(400, 'El limite debe ser mayor a 0');
    if (offset < 0) throw httpError(400, 'El offset no puede ser negativo');

    return {
        limit,
        offset,
        search: query.search ? String(query.search).trim() : undefined,
        categoriaId: query.categoria_id,
        pisoId: query.piso_id,
        accesible: query.accesible === undefined ? undefined : query.accesible === 'true'
    };
};

module.exports = {
    normalizeEspacioPayload,
    normalizeListQuery
};
