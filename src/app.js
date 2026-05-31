//Configuracion de express, rutas y errors
//CONEXION CON LOS DEMAS MODULOS

const express = require("express");
const cors = require("cors");
const supabase = require("./config/supabase");
const espaciosRoutes = require("./modules/espacios/espacios.routes");
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/error.middleware");

const app = express();

// Midlewares globales
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    mensaje: "La API del CF7 está funcionando correctamente.",
    fecha: new Date().toISOString(),
  });
});

// Ruta para probar la conexión a la base de datos
app.get("/api/test-db", async (req, res) => {
  try {
    // Hacemos una consulta rápida a la tabla de categorías
    const { data, error } = await supabase
      .from("categorias_espacio")
      .select("*");

    if (error) throw error;

    res.json({
      status: "Éxito",
      mensaje: "Conectados a Supabase en la nube.",
      datos: data, // Te va a devolver un array vacío [] si todavía no cargaste nada en DBeaver
    });
  } catch (error) {
    console.error("Error al consultar Supabase:", error);
    res.status(500).json({ status: "Error", error: error.message });
  }
});

// Definicion del puerto
//const PORT = process.env.PORT || 3000;

//app.listen(PORT, () => {
//console.log(`Servidor corriendo en el puerto ${PORT}`);
//});
