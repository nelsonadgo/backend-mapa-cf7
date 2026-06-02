const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    port: process.env.PORT || 3000,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    espaciosTable: process.env.SUPABASE_ESPACIOS_TABLE || 'espacios',
    reportesTable: process.env.REPORTES_TABLE || 'reportes',
};