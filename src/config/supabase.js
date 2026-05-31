//Cliente supabase

const { createClient } = require('@supabase/supabase-js');
const env = require('./env');
//require('dotenv').config(); // Carga las variables del archivo .env

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan las credenciales de Supabase en el archivo .env');
}

// Inicializamos el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Cliente de Supabase inicializado correctamente.');

module.exports = supabase;