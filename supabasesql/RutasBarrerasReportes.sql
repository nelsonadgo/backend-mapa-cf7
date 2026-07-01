-- Rutas, Barreras y Reportes
-- Tabla de Rutas
create table rutas (
	id uuid primary key default uuid_generate_v4(),
	nombre text,
	nodo_origen_id uuid not null references nodos(id) on delete cascade,
	nodo_destino_id uuid not null references nodos(id) on delete cascade,
	es_ruta_accesible boolean default false,
	peso_total float not null,
	segundos_estimados int,
	creado_por uuid references perfiles(id) on delete set null,
	fecha_creacion timestamp default now()
);

-- Tabla de pasos de ruta (para animar el svg)
create table pasos_ruta (
	id uuid primary key default uuid_generate_v4(),
	ruta_id uuid not null references rutas(id) on delete cascade,
	nodo_id uuid not null references nodos(id) on delete cascade,
	arista_id uuid references aristas(id) on delete set null,
	orden_paso int not null
);

-- Tabla de Barreras (Obstaculos dinamicos, puede estar en un nodo o en una arista)
create table barreras (
	id uuid primary key default uuid_generate_v4(),
	arista_id uuid references aristas(id) on delete cascade,
	nodo_id uuid references nodos(id) on delete cascade,
	tipo_barrera categoria_barrera not null,
	descripcion text,
	severidad int check (severidad >= 1 and severidad <=5),
	es_temporal boolean default false,
	fecha_creacion timestamp default now(),
	-- Restriccion para asegurar que se asocia a un nodo o a una arista, pero no a ambos
	constraint check_barrera_objetivo check (
		(arista_id is not null and nodo_id is null) or 
		(arista_id is null and nodo_id is not null)
	)
);

-- Tabla de Reportes
create table reportes (
	id uuid primary key default uuid_generate_v4(),
	reportador_id uuid not null references perfiles(id) on delete cascade,
	espacio_id uuid references espacios(id) on delete set null,
	arista_id uuid references aristas(id) on delete set null,
	barrera_id uuid references barreras(id) on delete set null,
	tipo_reporte categoria_barrera not  null, -- Reutilizamos el enum
	descripcion text,
	estado estado_reporte default 'pendiente',
	prioridad int check (prioridad >= 1 and prioridad <=5),
	fecha_creacion timestamp default now(),
	fecha_resolucion timestamp
);

-- Tabla de Fotos de Reportes
create table fotos_reporte (
	id uuid primary key default uuid_generate_v4(),
	reporte_id uuid not null references reportes(id) on delete cascade,
	url text not null, -- URL de firebase storage
	leyenda text,
	orden_visualizacion int default 0,
	fecha_creacion timestamp default now()
);