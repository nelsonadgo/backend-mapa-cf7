-- Tablas de entradads fisicas a la institucion
create table if not exists entradas_cfp (
	id uuid primary key default uuid_generate_v4(),
	nombre text not null,
	descripcion text,
	activa boolean not null default true,
	fecha_creacion timestamptz not null default now()
);

-- Horarios especificos por Entrada y dia de la semana
create table if not exists horario_entrada (
	id uuid primary key default uuid_generate_v4(),
	entrada_id uuid not null references entradas_cfp(id) on delete cascade,
	dia_semana smallint not null check (dia_semana between 1 and 7),
	hora_apertura time not null,
	hora_cierre time not null,
	activo boolean not null default true,
	constraint unique_entrada_dia unique (entrada_id, dia_semana)
);

-- Horario general de operacion del cfp
create table if not exists horario_cfp (
	id uuid primary key default uuid_generate_v4(),
	dia_semana smallint not null unique check (dia_semana between 1 and 7),
	hora_inicio time not null,
	hora_fin time not null,
	activo boolean not null default true
);

-- Clausuras temporales o indefinidas de espacios
create table if not exists clausuras_espacio (
	id uuid primary key default uuid_generate_v4(),
	espacio_id uuid not null references espacios(id) on delete cascade,
	motivo text not null,
	fecha_inicio timestamptz not null default now(),
	fecha_fin timestamptz,
	creado_por uuid references perfiles(id) on delete set null,
	fecha_creacion timestamptz not null default now()
);

-- Tabla de dias feriados / no laborales
create table if not exists feriados (
	id uuid primary key default uuid_generate_v4(),
	fecha date not null unique,
	nombre text not null,
	tipo text not null default 'nacional' check (tipo in ('nacional', 'provincial', 'institucional')),
	activo boolean not null default true,
	fecha_creacion timestamptz not null default now()
);

-- Indices para consulta de alta velocidad
create index if not exists idx_clausuras_espacio_id on clausuras_espacio (espacio_id);
create index if not exists idx_clausuras_vigentes on clausuras_espacio (espacio_id, fecha_inicio) where fecha_fin is null;
create index if not exists idx_feriados_busqueda on feriados (fecha) where activo = true;

-- Vista de disponibilidad en tiempo real
-- Esta vista une el espacio fisico con las reglas temporales (feriados)
create or replace view espacios_con_estado as
select
	e.*,
	case
		-- Si el espacio esta clausurado hoy, no esta disponible
		when exists (
			select 1 from clausuras_espacio c
			where c.espacio_id = e.id
			and c.fecha_inicio <= now()
			and (c.fecha_fin is null or c.fecha_fin > now())
		) then false
		-- Si hoy es feriado activo, el espacio no esta disponible
		when exists (
			select 1 from feriados f
			where f.fecha = current_date and f.activo = true
		) then false
		else true
	end as disponible,
	-- Agrega un objeto json con el detalle de la clausura si existiera
	(
		select json_build_object(
			'id', c.id,
			'motivo', c.motivo,
			'fecha_inicio', c.fecha_inicio,
			'fecha_fin', c.fecha_fin
		)
		from clausuras_espacio c
		where c.espacio_id = e.id
		and c.fecha_inicio <= now()
		and (c.fecha_fin is null or c.fecha_fin > now())
		order by c.fecha_inicio desc
		limit 1
	) as clausura_activa
from espacios e;
	








