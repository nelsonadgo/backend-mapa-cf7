-- Nodos, Aristas y Espacios
-- Tabla de Espacios
create table espacios (
	id uuid primary key default uuid_generate_v4(),
	piso_id uuid not null references pisos(id) on delete cascade,
	categoria_id uuid not null references categorias_espacio(id),
	codigo text,
	nombre text not null,
	descripcion text,
	es_accesible boolean default true,
	tiene_rampa boolean default false,
	capacidad int,
	area_m2 float,
	codigo_qr text,
	fecha_creacion timestamp default now()
);

-- Tabla de fotos de los espacios
create table fotos_espacio (
	id uuid primary key default uuid_generate_v4(),
	espacio_id uuid not null references espacios(id) on delete cascade,
	url text not null,
	leyenda text,
	orden_visualizacion int default 0,
	fecha_creacion timestamp default now()
);

-- Tabla de Nodos (Vertices)
create table nodos (
	id uuid primary key default uuid_generate_v4(),
	piso_id uuid not null references pisos(id) on delete cascade,
	espacio_id uuid references espacios(id) on delete set null,
	tipo_nodo categoria_nodo not null,
	etiqueta text,
	svg_x float not null, -- coordenada x
	svg_y float not null, -- coordenada y
	es_accesible boolean default true,
	esta_activo boolean default true
);

-- Tabla de Aristas (Caminos que unen los nodos)
create table aristas (
	id uuid primary key default uuid_generate_v4(),
	piso_id uuid not null references pisos(id) on delete cascade,
	nodo_origen_id uuid not null references nodos(id) on delete cascade,
	nodo_destino_id uuid not null references nodos(id) on delete cascade,
	tipo_arista categoria_arista not null,
	es_bidireccional boolean default true,
	es_accesible boolean default true,
	peso float not null,
	distancia_m float,
	svg_path text, -- El trazado path
	esta_activo boolean default true
);