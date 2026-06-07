const cloudinary = require("./config/cloudinary");

async function test() {
  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary conectado:", result);
  } catch (error) {
    console.error("Error Cloudinary:", error.message);
  }
}

test();
