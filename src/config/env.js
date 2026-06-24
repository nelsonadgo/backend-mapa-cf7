const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,

  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,

  espaciosTable: process.env.SUPABASE_ESPACIOS_TABLE || "espacios",
  reportesTable: process.env.SUPABASE_REPORTES_TABLE || "reportes",
  recorridosTable: process.env.SUPABASE_RECORRIDOS_TABLE || "recorridos",
  perfilesTable: process.env.SUPABASE_PERFILES_TABLE || "perfiles",

  jwtSecret: process.env.JWT_SECRET || "dev_secret_change_me",

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};
