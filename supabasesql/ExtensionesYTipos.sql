-- Extensiones y Tipos

-- Habilitar generación de UUIDs
CREATE extension if not exists "uuid-ossp";

-- Creación de tipos ENUM
create type rol_usuario as enum ('visitante', 'personal', 'admin');
create type categoria_nodo as enum ('interseccion', 'aula', 'ascensor', 'escalera', 'rampa', 'entrada', 'salida', 'sanitario', 'laboratorio', 'oficina');
create type categoria_arista as enum ('pasillo', 'rampa', 'escalera', 'ascensor', 'exterior', 'puerta');
create type categoria_barrera as enum ('escalon', 'puerta_angosta', 'sin_rampa', 'sin_guia_tactil', 'obra', 'pendiente', 'limite_altura');
create type estado_reporte as enum ('pendiente', 'en_progreso', 'resuelto', 'rechazado');

-- Módulo de usuarios y accesibilidad

-- Tabla de perfiles el ID viene de Firebase Auth
create table perfiles (
	id uuid primary key,
	nombre_completo text not null,
	url_avatar text,
	rol rol_usuario default 'visitante',
	fecha_creacion timestamp default now()
);

-- Tabla de preferencias de accesibilidad
create table preferencias_accesibilidad (
	id uuid primary key default uuid_generate_v4(),
	perfil_id uuid unique not null references perfiles(id) on delete cascade,
	requiere_ascensor boolean default false,
	evita_escaleras boolean default false,
	requiere_rampa boolean default false,
	alto_contraste boolean default false,
	escala_fuente int default 100 check (escala_fuente >= 50 and escala_fuente <= 200),
	movimiento_reducido boolean default false,
	fecha_actualizacion timestamp default now()
);