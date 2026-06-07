//Arranque del servidor

const app = require("./app");
const env = require("./config/env");

app.listen(env.port, () => {
  console.log(`Servidor corriendo en el puerto ${env.port}`);
});

console.log("Cloud Name:", env.cloudinaryCloudName);
