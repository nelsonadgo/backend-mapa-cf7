-- Modulo Fisico 

-- Tabla de Edificios
create table edificios (
	id uuid primary key default uuid_generate_v4(),
	nombre text not null,
	descripcion text,
	codigo_corto text, -- ej: A, B, sede central
	direccion text,
	fecha_creacion timestamp default now()
);

-- Tabla de pisos
create table pisos (
	id uuid primary key default uuid_generate_v4(),
	edificio_id uuid not null references edificios(id) on delete cascade,
	nombre text not null,
	numero_nivel int not null,
	url_mapa_svg text,
	viewbox_svg text
);

-- Tabla de categorias de espacio
create table categorias_espacio (
	id uuid primary key default uuid_generate_v4(),
	nombre text not null,
	icono text,
	color text,
	descripcion text
);