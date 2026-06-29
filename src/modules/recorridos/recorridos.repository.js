let recorridosMock = [
  {
    id: 1,
    nombre: "Entrada principal a Informes",
    descripcion: "Recorrido básico desde el ingreso hasta el área de Informes.",
    origen: "Entrada principal",
    destino: "Informes / Regencia",
    sector_destino: "Sector 3",
    pasos: [
      "Ingresar por la entrada principal.",
      "Avanzar hacia el Sector 3.",
      "Ubicar el área de Informes junto a Regencia.",
    ],
    distancia_metros: 12,
    duracion_estimada_min: 2,
    es_accesible: true,
    estado: "activo",
  },
  {
    id: 2,
    nombre: "Entrada principal a Aula 3 - SUM",
    descripcion: "Recorrido básico desde el ingreso hasta Aula 3 - SUM.",
    origen: "Entrada principal",
    destino: "Aula 3 - SUM",
    sector_destino: "Sector 4",
    pasos: [
      "Ingresar por la entrada principal.",
      "Avanzar por el pasillo central.",
      "Dirigirse hacia el Sector 4.",
      "Ubicar Aula 3 - SUM entre Aula 2 y Aula 4.",
    ],
    distancia_metros: 25,
    duracion_estimada_min: 3,
    es_accesible: true,
    estado: "activo",
  },
  {
    id: 3,
    nombre: "Entrada principal a Electricidad",
    descripcion: "Recorrido básico hacia el taller de Electricidad.",
    origen: "Entrada principal",
    destino: "Electricidad",
    sector_destino: "Sector 1",
    pasos: [
      "Ingresar al Sector 1.",
      "Avanzar por el pasillo principal.",
      "Ubicar Electricidad sobre el lado izquierdo.",
    ],
    distancia_metros: 18,
    duracion_estimada_min: 3,
    es_accesible: true,
    estado: "activo",
  },
];

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
  let data = [...recorridosMock];

  if (search) {
    const term = search.toLowerCase();

    data = data.filter(
      (recorrido) =>
        recorrido.nombre.toLowerCase().includes(term) ||
        recorrido.descripcion.toLowerCase().includes(term) ||
        recorrido.origen.toLowerCase().includes(term) ||
        recorrido.destino.toLowerCase().includes(term) ||
        recorrido.sector_destino.toLowerCase().includes(term),
    );
  }

  if (origen) {
    data = data.filter((recorrido) =>
      recorrido.origen.toLowerCase().includes(String(origen).toLowerCase()),
    );
  }

  if (destino) {
    data = data.filter((recorrido) =>
      recorrido.destino.toLowerCase().includes(String(destino).toLowerCase()),
    );
  }

  if (sector) {
    data = data.filter((recorrido) =>
      recorrido.sector_destino
        .toLowerCase()
        .includes(String(sector).toLowerCase()),
    );
  }

  if (accesible !== undefined) {
    data = data.filter((recorrido) => recorrido.es_accesible === accesible);
  }

  if (estado) {
    data = data.filter((recorrido) => recorrido.estado === estado);
  }

  const count = data.length;
  const paginatedData = data.slice(offset, offset + limit);

  return {
    data: paginatedData,
    count,
  };
};

const findById = async (id) => {
  return recorridosMock.find((recorrido) => recorrido.id === Number(id));
};

const create = async (payload) => {
  const nuevoRecorrido = {
    id: recorridosMock.length + 1,
    estado: "activo",
    ...payload,
  };

  recorridosMock.push(nuevoRecorrido);

  return nuevoRecorrido;
};

const updateById = async (id, payload) => {
  const index = recorridosMock.findIndex(
    (recorrido) => recorrido.id === Number(id),
  );

  if (index === -1) return null;

  recorridosMock[index] = {
    ...recorridosMock[index],
    ...payload,
  };

  return recorridosMock[index];
};

const deleteById = async (id) => {
  const index = recorridosMock.findIndex(
    (recorrido) => recorrido.id === Number(id),
  );

  if (index === -1) return null;

  const eliminado = recorridosMock.splice(index, 1);

  return eliminado[0];
};

module.exports = {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
};
