-- CARGA DE DATOS OPERATIVOS (SEED)

-- Insertar Entradas Físicas con IDs fijos para pruebas de desarrollo
insert into entradas_cfp (id, nombre, descripcion) values 
    ('00000000-0000-0000-0000-000000000001', 'Entrada Principal', 'Acceso principal sobre la calle de ingreso'),
    ('00000000-0000-0000-0000-000000000002', 'Entrada Lateral', 'Acceso secundario, cierra más temprano')
on conflict (id) do nothing;

-- Carga de Horarios para la Entrada Principal (Lunes a Viernes hasta las 22, Sábados hasta las 13)
insert into horario_entrada (entrada_id, dia_semana, hora_apertura, hora_cierre) values
    ('00000000-0000-0000-0000-000000000001', 1, '07:00', '22:00'),
    ('00000000-0000-0000-0000-000000000001', 2, '07:00', '22:00'),
    ('00000000-0000-0000-0000-000000000001', 3, '07:00', '22:00'),
    ('00000000-0000-0000-0000-000000000001', 4, '07:00', '22:00'),
    ('00000000-0000-0000-0000-000000000001', 5, '07:00', '22:00'),
    ('00000000-0000-0000-0000-000000000001', 6, '07:00', '13:00')
on conflict do nothing;

-- Carga de Horarios para la Entrada Lateral (Cierra antes)
insert into horario_entrada (entrada_id, dia_semana, hora_apertura, hora_cierre) values
    ('00000000-0000-0000-0000-000000000002', 1, '07:00', '18:00'),
    ('00000000-0000-0000-0000-000000000002', 2, '07:00', '18:00'),
    ('00000000-0000-0000-0000-000000000002', 3, '07:00', '18:00'),
    ('00000000-0000-0000-0000-000000000002', 4, '07:00', '18:00'),
    ('00000000-0000-0000-0000-000000000002', 5, '07:00', '18:00'),
    ('00000000-0000-0000-0000-000000000002', 6, '07:00', '12:00')
on conflict do nothing;

-- Horario General del CFP
insert into horario_cfp (dia_semana, hora_inicio, hora_fin) values
    (1, '07:00', '22:00'),
    (2, '07:00', '22:00'),
    (3, '07:00', '22:00'),
    (4, '07:00', '22:00'),
    (5, '07:00', '22:00'),
    (6, '07:00', '13:00')
on conflict (dia_semana) do nothing;

-- Calendario de Feriados Nacionales (2026)
insert into feriados (fecha, nombre, tipo) values
    ('2026-01-01', 'Año Nuevo', 'nacional'),
    ('2026-02-16', 'Carnaval', 'nacional'),
    ('2026-02-17', 'Carnaval', 'nacional'),
    ('2026-03-24', 'Día Nacional de la Memoria', 'nacional'),
    ('2026-04-02', 'Día del Veterano de Malvinas', 'nacional'),
    ('2026-04-03', 'Viernes Santo', 'nacional'),
    ('2026-05-01', 'Día del Trabajador', 'nacional'),
    ('2026-05-25', 'Día de la Revolución de Mayo', 'nacional'),
    ('2026-06-17', 'Paso a la Inmortalidad del Gral. Güemes', 'nacional'),
    ('2026-06-20', 'Día de la Bandera', 'nacional'),
    ('2026-07-09', 'Día de la Independencia', 'nacional'),
    ('2026-08-17', 'Paso a la Inmortalidad del Gral. San Martín', 'nacional'),
    ('2026-10-12', 'Día del Respeto a la Diversidad Cultural', 'nacional'),
    ('2026-11-20', 'Día de la Soberanía Nacional', 'nacional'),
    ('2026-12-08', 'Inmaculada Concepción de María', 'nacional'),
    ('2026-12-25', 'Navidad', 'nacional')
on conflict (fecha) do nothing;