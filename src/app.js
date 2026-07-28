//Configuracion de express, rutas y errors
//CONEXION CON LOS DEMAS MODULOS

const express = require("express");
const cors = require("cors");
const supabase = require("./config/supabase");

const espaciosRoutes = require("./modules/espacios/espacios.routes");
const reportesRoutes = require("./modules/reportes/reportes.routes");
const recorridosRoutes = require("./modules/recorridos/recorridos.routes");
const authRoutes = require("./modules/auth/auth.routes");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const analyticsRoutes = require("./modules/analytics/analytics.routes");

const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/error.middleware");

const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Accesibilidad y Autenticación",
      version: "1.0.0",
      description:
        "Documentación de endpoints para login, usuarios y preferencias",
    },
    servers: [
      {
        url: "http://localhost:3000", // Cambiá según tu puerto/URL de desarrollo
        description: "Servidor local",
      },
    ],
    // Si usás JWT para proteger rutas, definimos la seguridad global
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  // Archivos donde Swagger buscará los comentarios JSDoc
  apis: ["./src/modules/**/*.js", "./modules/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
console.log(
  "Rutas detectadas por Swagger:",
  Object.keys(swaggerSpec.paths || {}),
);

// Servir la interfaz gráfica de Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Midlewares globales
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/espacios", espaciosRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/recorridos", recorridosRoutes);
app.use("/api/analytics", analyticsRoutes);

// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    mensaje: "La API del CF7 está funcionando correctamente.",
    fecha: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    mensaje: "API Online",
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

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
