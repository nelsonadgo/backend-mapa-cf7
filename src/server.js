//Arranque del servidor

const app = require("./app");
const env = require("./config/env");

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

console.log("Cloud Name:", env.cloudinaryCloudName);
